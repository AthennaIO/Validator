/**
 * @athenna/validator
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Annotation } from '@athenna/ioc'
import { BaseTest } from '#tests/helpers/BaseTest'
import { Test, type Context, Cleanup } from '@athenna/test'

export default class ValidatorAnnotationTest extends BaseTest {
  @Test()
  public async shouldBeAbleToPreregisterValidatorsUsingValidatorAnnotation({ assert }: Context) {
    const ProductValidator = await this.import('#tests/fixtures/validators/ProductValidator')

    const metadata = Annotation.getMeta(ProductValidator)

    assert.isFalse(metadata.registered)
    assert.isUndefined(metadata.camelAlias)
    assert.equal(metadata.type, 'transient')
    assert.equal(metadata.alias, 'App/Validators/ProductValidator')
    assert.equal(metadata.name, 'App/Validators/Names/productValidator')
  }

  @Test()
  @Cleanup(() => ioc.reconstruct())
  public async shouldNotReRegisterTheValidatorAliasIfItIsAlreadyRegisteredInTheServiceContainer({ assert }: Context) {
    ioc.singleton('App/Validators/ProductValidator', () => {})

    const ProductValidator = await this.import('#tests/fixtures/validators/ProductValidator')

    assert.isFalse(Annotation.isAnnotated(ProductValidator))
  }

  @Test()
  @Cleanup(() => ioc.reconstruct())
  public async shouldNotReRegisterTheValidatorNamedAliasIfItIsAlreadyRegisteredInTheServiceContainer({
    assert
  }: Context) {
    ioc.singleton('App/Validators/Names/productValidator', () => {})

    const ProductValidator = await this.import('#tests/fixtures/validators/ProductValidator')

    assert.isFalse(Annotation.isAnnotated(ProductValidator))
  }
}
