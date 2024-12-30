/**
 * @athenna/validator
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Path } from '@athenna/common'
import { v, ValidatorProvider } from '#src'
import { Test, Mock, AfterEach, type Context, BeforeEach } from '@athenna/test'

export class CustomValidationsTest {
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
  public async shouldThrowUniqueValidationIfDataExistsInDatabase({ assert }: Context) {
    ioc.singleton('Athenna/Core/Database', {
      table: () => ({
        select: () => ({
          where: () => ({
            exists: () => true
          })
        })
      })
    })

    const provider = new ValidatorProvider()

    await provider.register()
    await provider.boot()

    const schema = v.object({
      name: v.string().unique({ table: 'users' })
    })

    await assert.rejects(() => v.validate({ schema, data: { name: 'lenon' } }))
  }

  @Test()
  public async shouldPassUniqueValidationIfDataDoesNotExistsInDatabase({ assert }: Context) {
    ioc.singleton('Athenna/Core/Database', {
      table: () => ({
        select: () => ({
          where: () => ({
            exists: () => false
          })
        })
      })
    })

    const provider = new ValidatorProvider()

    await provider.register()
    await provider.boot()

    const schema = v.object({
      name: v.string().unique({ table: 'users' })
    })

    await assert.doesNotReject(() => v.validate({ schema, data: { name: 'lenon' } }))
  }

  @Test()
  public async shouldThrowUniqueValidationIfDataCountExceedMaxLimitInDatabase({ assert }: Context) {
    ioc.singleton('Athenna/Core/Database', {
      table: () => ({
        select: () => ({
          where: () => ({
            count: () => 11
          })
        })
      })
    })

    const provider = new ValidatorProvider()

    await provider.register()
    await provider.boot()

    const schema = v.object({
      name: v.string().unique({ table: 'users', max: 10 })
    })

    await assert.rejects(() => v.validate({ schema, data: { name: 'lenon' } }))
  }

  @Test()
  public async shouldPassUniqueValidationIfDataCountDoesNotExceedMaxLimitInDatabase({ assert }: Context) {
    ioc.singleton('Athenna/Core/Database', {
      table: () => ({
        select: () => ({
          where: () => ({
            count: () => 10
          })
        })
      })
    })

    const provider = new ValidatorProvider()

    await provider.register()
    await provider.boot()

    const schema = v.object({
      name: v.string().unique({ table: 'users', max: 10 })
    })

    await assert.doesNotReject(() => v.validate({ schema, data: { name: 'lenon' } }))
  }

  @Test()
  public async shouldBeAbleToUseCustomColumnNamesInUniqueValidation({ assert }: Context) {
    ioc.singleton('Athenna/Core/Database', {
      table: () => ({
        select: () => ({
          where: () => ({
            exists: () => false
          })
        })
      })
    })

    const provider = new ValidatorProvider()

    await provider.register()
    await provider.boot()

    const schema = v.object({
      name: v.string().unique({ table: 'users', column: 'email' })
    })

    await assert.doesNotReject(() => v.validate({ schema, data: { name: 'lenon' } }))
  }

  @Test()
  public async shouldThrowExistsValidationIfDataDoesNotExistsInDatabase({ assert }: Context) {
    ioc.singleton('Athenna/Core/Database', {
      table: () => ({
        select: () => ({
          where: () => ({
            exists: () => false
          })
        })
      })
    })

    const provider = new ValidatorProvider()

    await provider.register()
    await provider.boot()

    const schema = v.object({
      name: v.string().exists({ table: 'users' })
    })

    await assert.rejects(() => v.validate({ schema, data: { name: 'lenon' } }))
  }

  @Test()
  public async shouldPassExistsValidationIfDataExistsInDatabase({ assert }: Context) {
    ioc.singleton('Athenna/Core/Database', {
      table: () => ({
        select: () => ({
          where: () => ({
            exists: () => true
          })
        })
      })
    })

    const provider = new ValidatorProvider()

    await provider.register()
    await provider.boot()

    const schema = v.object({
      name: v.string().exists({ table: 'users' })
    })

    await assert.doesNotReject(() => v.validate({ schema, data: { name: 'lenon' } }))
  }

  @Test()
  public async shouldThrowExistsValidationIfDataCountIsLowerThanMinLimitInDatabase({ assert }: Context) {
    ioc.singleton('Athenna/Core/Database', {
      table: () => ({
        select: () => ({
          where: () => ({
            count: () => 4
          })
        })
      })
    })

    const provider = new ValidatorProvider()

    await provider.register()
    await provider.boot()

    const schema = v.object({
      name: v.string().exists({ table: 'users', min: 5 })
    })

    await assert.rejects(() => v.validate({ schema, data: { name: 'lenon' } }))
  }

  @Test()
  public async shouldPassExistsValidationIfDataCountIsLowerThanMinLimitInDatabase({ assert }: Context) {
    ioc.singleton('Athenna/Core/Database', {
      table: () => ({
        select: () => ({
          where: () => ({
            count: () => 5
          })
        })
      })
    })

    const provider = new ValidatorProvider()

    await provider.register()
    await provider.boot()

    const schema = v.object({
      name: v.string().exists({ table: 'users', min: 5 })
    })

    await v.validate({ schema, data: { name: 'lenon' } })
    await assert.doesNotReject(() => v.validate({ schema, data: { name: 'lenon' } }))
  }

  @Test()
  public async shouldBeAbleToUseCustomColumnNamesInExistsValidation({ assert }: Context) {
    ioc.singleton('Athenna/Core/Database', {
      table: () => ({
        select: () => ({
          where: () => ({
            exists: () => true
          })
        })
      })
    })

    const provider = new ValidatorProvider()

    await provider.register()
    await provider.boot()

    const schema = v.object({
      name: v.string().exists({ table: 'users', column: 'email' })
    })

    await assert.doesNotReject(() => v.validate({ schema, data: { name: 'lenon' } }))
  }
}
