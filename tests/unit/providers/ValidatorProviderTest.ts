/**
 * @athenna/validator
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Path } from '@athenna/common'
import { Validate, ValidatorProvider } from '#src'
import { Test, Mock, AfterEach, type Context, BeforeEach } from '@athenna/test'

export class ValidatorProviderTest {
  @BeforeEach()
  public async beforeEach() {
    await Config.loadAll(Path.fixtures('config'))
  }

  @AfterEach()
  public async afterEach() {
    Mock.restoreAll()
    ioc.reconstruct()
    Config.clear()
  }

  @Test()
  public async shouldBeAbleToRegisterValidatorImplementationInTheContainer({ assert }: Context) {
    await new ValidatorProvider().register()

    assert.isTrue(ioc.has('Athenna/Core/Validator'))
  }

  @Test()
  public async shouldBeAbleToUseValidatorImplementationFromFacade({ assert }: Context) {
    await new ValidatorProvider().register()

    assert.isDefined(Validate.schema)
  }

  @Test()
  public async shouldBeAbleToRegisterAllValidatorsFromAthennaRc({ assert }: Context) {
    await new ValidatorProvider().register()

    assert.isTrue(ioc.has('annotatedValidator'))
    assert.isTrue(ioc.has('App/Validators/HelloValidator'))
    assert.isTrue(ioc.has('App/Validators/ProductValidator'))
  }

  @Test()
  public async shouldBeAbleToRegisterNamedValidatorsDefinedInValidatorsOfAthennaRc({ assert }: Context) {
    await new ValidatorProvider().register()

    assert.isTrue(ioc.has('App/Validators/Names/annotated'))
    assert.isTrue(ioc.has('App/Validators/Names/productValidator'))
  }

  @Test()
  public async shouldBeAbleToRegisterNamedValidatorsDefinedInAthennaRc({ assert }: Context) {
    await new ValidatorProvider().register()

    assert.isTrue(ioc.has('App/Validators/Names/hello'))
  }

  @Test()
  public async shouldRegisterCustomUniqueValidation({ assert }: Context) {
    ioc.singleton('Athenna/Core/Database', {})

    const provider = new ValidatorProvider()

    await provider.register()
    await provider.boot()

    assert.isDefined(Validate.schema.string().unique)
  }

  @Test()
  public async shouldRegisterCustomExistsValidation({ assert }: Context) {
    ioc.singleton('Athenna/Core/Database', {})

    const provider = new ValidatorProvider()

    await provider.register()
    await provider.boot()

    assert.isDefined(Validate.schema.string().exists)
  }
}
