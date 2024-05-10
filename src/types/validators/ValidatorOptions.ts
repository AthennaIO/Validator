/**
 * @athenna/validator
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export type ValidatorOptions = {
  /**
   * The alias that will be used to register the validator inside
   * the service container.
   *
   * @default App/Validators/YourValidatorClassName
   */
  alias?: string

  /**
   * The camel alias that will be used as an alias of the real
   * validator alias. Camel alias is important when you want to
   * work with constructor injection. By default, Athenna doesn't
   * create camel alias for validators.
   *
   * @default undefined
   */
  camelAlias?: string

  /**
   * The registration type that will be used to register your validator
   * inside the service container.
   *
   * @default 'transient'
   */
  type?: 'fake' | 'scoped' | 'singleton' | 'transient'

  /**
   * Set the name of your validator to be used inside routes. Athenna
   * will always set the default name of your validator as the validator
   * class name in camel case format.
   *
   * @default 'yourValidatorClassName'
   */
  name?: string
}
