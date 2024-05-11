/**
 * @athenna/validator
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { AfterEach, BeforeEach, Test, type Context } from '@athenna/test'
import { BaseValidator, ValidationException, ValidatorProvider } from '#src'

export class BaseValidatorTest {
  @BeforeEach()
  public async beforeEach() {
    await new ValidatorProvider().register()
  }

  @AfterEach()
  public async afterEach() {
    ioc.reconstruct()
  }

  @Test()
  public async shouldBeAbleToDefineTheValidationSchema({ assert }: Context) {
    class UserValidator extends BaseValidator {
      public schema = this.validator.object({
        name: this.validator.string()
      })

      public async handle() {}
    }

    const properties = new UserValidator().schema.getProperties()

    assert.isDefined(properties.name)
  }

  @Test()
  public async shouldBeAbleToDefineTheValidationHandlerMethod({ assert }: Context) {
    class UserValidator extends BaseValidator {
      public schema = this.validator.object({
        name: this.validator.string()
      })

      public async handle(data: any) {
        await this.validator.validate({ schema: this.schema, data })
      }
    }

    assert.doesNotReject(() => new UserValidator().handle({ name: 'lenon' }))
  }

  @Test()
  public async shouldThrowValidationExceptionWhenValidationFails({ assert }: Context) {
    class UserValidator extends BaseValidator {
      public schema = this.validator.object({
        name: this.validator.string()
      })

      public async handle(data: any) {
        await this.validator.validate({ schema: this.schema, data })
      }
    }

    assert.rejects(() => new UserValidator().handle({ name: 10 }), ValidationException)
  }

  @Test()
  public async shouldBeAbleToUseValidateMethodToValidateData({ assert }: Context) {
    class UserValidator extends BaseValidator {
      public schema = this.validator.object({
        name: this.validator.string()
      })

      public async handle(data: any) {
        await this.validate(data)
      }
    }

    assert.doesNotReject(() => new UserValidator().handle({ name: 'lenon' }))
  }

  @Test()
  public async shouldThrowValidationExceptionWhenValidationFailsWhenUsingValidateMethod({ assert }: Context) {
    class UserValidator extends BaseValidator {
      public schema = this.validator.object({
        name: this.validator.string()
      })

      public async handle(data: any) {
        await this.validate(data)
      }
    }

    assert.rejects(() => new UserValidator().handle({ name: 10 }), ValidationException)
  }
}
