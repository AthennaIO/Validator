/**
 * @athenna/validator
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export type UniqueOptions = {
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
