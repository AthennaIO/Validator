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
import { SimpleErrorReporter } from '#src'
import { Exec, Module, Path } from '@athenna/common'
import { Annotation, ServiceProvider } from '@athenna/ioc'
import { ValidatorImpl } from '#src/validator/ValidatorImpl'
import type { UniqueOptions, ExistsOptions } from '#src/types'
import { CustomValidations } from '#src/validator/CustomValidations'
import { ValidationException } from '#src/exceptions/ValidationException'

declare module '@vinejs/vine' {
  interface VineString {
    unique(options: UniqueOptions): this
    exists(options: ExistsOptions): this
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

    CustomValidations.registerUnique()
    CustomValidations.registerExists()
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
