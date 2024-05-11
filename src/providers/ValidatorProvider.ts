/**
 * @athenna/validator
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { sep } from 'node:path'
import { Config } from '@athenna/config'
import { Validate, SimpleErrorReporter } from '#src'
import { Is, Exec, Module, Path } from '@athenna/common'
import { Annotation, ServiceProvider } from '@athenna/ioc'
import { ValidatorImpl } from '#src/validator/ValidatorImpl'
import { ValidationException } from '#src/exceptions/ValidationException'

type UniqueOptions = {
  /**
   * The table where the database will lookup for the data.
   */
  table: string

  /**
   * The column name in database. If not defined, the name
   * of the field in the schema will be used.
   *
   * @default 'fieldNameInYourSchema'
   */
  column?: string

  /**
   * Use the max field to stablish a max limit for your validation.
   * In some cases in your database you might have a max of 10 tuples
   * with the same data. Use this option to validate that the number
   * of fields registered in database cannot be bigger than the number
   * defined on this option.
   *
   * @example
   * ```ts
   * const schema = this.validator.object({
   *   name: this.validator.string().unique({ table: 'users', max: 10 })
   * })
   *
   * const data = { name: 'lenon' }
   *
   * // Will throw if there are 10 users with name `lenon`
   * // created in database
   * await this.validator.validate({ schema: this.schema, data })
   * ```
   * @default undefined
   */
  max?: number
}

declare module '@vinejs/vine' {
  interface VineString {
    unique(options: UniqueOptions): this
  }
}

class ErrorReporter extends SimpleErrorReporter {
  createError(): any {
    return new ValidationException(this.errors)
  }
}

export class ValidatorProvider extends ServiceProvider {
  public async register() {
    const validator = new ValidatorImpl()

    validator.schema.errorReporter = () => new ErrorReporter()

    this.container.instance('Athenna/Core/Validator', validator)

    await this.registerValidators()
  }

  public async boot() {
    if (!ioc.has('Athenna/Core/Database')) {
      return
    }

    const DB = ioc.safeUse('Athenna/Core/Database')

    Validate.extend().string('unique', async (value, options, field) => {
      /**
       * We do not want to deal with non-string
       * values. The "string" rule will handle the
       * the validation.
       */
      if (!Is.String(value)) {
        return
      }

      if (!options.column) {
        options.column = field.name as string
      }

      if (options.max) {
        const rows = await DB.table(options.table)
          .select(options.column)
          .where(options.column, value)
          .findMany()

        if (rows.length > options.max) {
          field.report('The {{ field }} field is not unique', 'unique', field)
        }

        return
      }

      const existsRow = await DB.table(options.table)
        .select(options.column)
        .where(options.column, value)
        .exists()

      if (existsRow) {
        field.report('The {{ field }} field is not unique', 'unique', field)
      }
    })
  }

  public async registerValidators() {
    const validators = Config.get<string[]>('rc.validators', [])

    await Exec.concurrently(validators, async path => {
      const Validator = await Module.resolve(path, this.getMeta())

      if (Annotation.isAnnotated(Validator)) {
        this.registerValidatorByMeta(Validator)

        return
      }

      this.container.transient(`App/Validators/${Validator.name}`, Validator)
    })

    await this.registerNamedValidators()
  }

  public async registerValidatorByMeta(validator: unknown) {
    const meta = Annotation.getMeta(validator)

    this.container[meta.type](meta.alias, validator)

    if (meta.name) {
      this.container.alias(meta.name, meta.alias)
    }

    if (meta.camelAlias) {
      this.container.alias(meta.camelAlias, meta.alias)
    }

    return meta
  }

  public async registerNamedValidators() {
    const namedValidators = Config.get<Record<string, string>>(
      'rc.namedValidators',
      {}
    )

    await Exec.concurrently(Object.keys(namedValidators), async key => {
      const Validator = await Module.resolve(
        namedValidators[key],
        this.getMeta()
      )

      if (Annotation.isAnnotated(Validator)) {
        this.registerValidatorByMeta(Validator)

        return
      }

      const { alias, namedAlias } = this.getNamedValidatorAlias(key, Validator)

      this.container.bind(alias, Validator).alias(namedAlias, alias)
    })
  }

  /**
   * Get the meta URL of the project.
   */
  public getMeta() {
    return Config.get('rc.parentURL', Path.toHref(Path.pwd() + sep))
  }

  /**
   * Fabricate the named validator aliases.
   */
  public getNamedValidatorAlias(name: string, Validator: any) {
    return {
      alias: `App/Validators/${Validator.name}`,
      namedAlias: `App/Validators/Names/${name}`
    }
  }
}
