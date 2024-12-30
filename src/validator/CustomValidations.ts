/**
 * @athenna/validator
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Is } from '@athenna/common'
import { Validate } from '#src/facades/Validate'

export class CustomValidations {
  /**
   * Register custom `string().unique()` validation.
   */
  public static registerUnique() {
    const DB = ioc.safeUse('Athenna/Core/Database')

    Validate.extend().string('unique', async (value, options, field) => {
      /**
       * Don't validate non string values, let `string`
       * validation rule throw the error.
       */
      if (!Is.String(value)) {
        return
      }

      /**
       * Use custom column name, otherwise use the same
       * in the field name.
       */
      if (!options.column) {
        options.column = field.name as string
      }

      /**
       * Define a max number of values that could be
       * repeated in database to pass the validation.
       */
      if (options.max) {
        const rows = await DB.table(options.table)
          .select(options.column)
          .where(options.column, value)
          .count()

        if (rows > options.max) {
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

  /**
   * Register custom `string().unique()` validation.
   */
  public static registerExists() {
    const DB = ioc.safeUse('Athenna/Core/Database')

    Validate.extend().string('exists', async (value, options, field) => {
      /**
       * Don't validate non string values, let `string`
       * validation rule throw the error.
       */
      if (!Is.String(value)) {
        return
      }

      /**
       * Use custom column name, otherwise use the same
       * in the field name.
       */
      if (!options.column) {
        options.column = field.name as string
      }

      /**
       * Define a minimum number of values that needs to
       * exist in database to pass the validation.
       */
      if (options.min) {
        const rows = await DB.table(options.table)
          .select(options.column)
          .where(options.column, value)
          .count()

        if (rows < options.min) {
          field.report('The {{ field }} field does not exist', 'exists', field)
        }

        return
      }

      const existsRow = await DB.table(options.table)
        .select(options.column)
        .where(options.column, value)
        .exists()

      if (!existsRow) {
        field.report('The {{ field }} field does not exist', 'exists', field)
      }
    })
  }
}
