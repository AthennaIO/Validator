/**
 * @athenna/validator
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ValidatorImpl } from '#src'
import { Test, type Context } from '@athenna/test'

declare module '@vinejs/vine' {
  interface VineAccepted {
    test(options: any): this
  }
  interface VineDate {
    test(options: any): this
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  interface VineRecord {
    test(options: any): this
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  interface VineTuple {
    test(options: any): this
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  interface VineLiteral {
    test(options: any): this
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  interface VineArray {
    test(options: any): this
  }
  interface VineAny {
    test(options: any): this
  }
  interface VineString {
    test(options: any): this
  }
  interface VineNumber {
    test(options: any): this
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  interface VineEnum {
    test(options: any): this
  }
  interface VineBoolean {
    test(options: any): this
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  interface VineObject {
    test(options: any): this
  }
}

export class ValidatorImplTest {
  @Test()
  public async shouldBeAbleToCreateValidationSchemasUsingSchemaGetter({ assert }: Context) {
    const validator = new ValidatorImpl()

    const schema = validator.schema.object({
      name: validator.schema.string()
    })

    assert.isDefined(schema.getProperties().name)
  }

  @Test()
  public async shouldBeAbleToValidateDataUsingValidateMethod({ assert }: Context) {
    const validator = new ValidatorImpl()

    const schema = validator.schema.object({
      name: validator.schema.string()
    })

    const data = await validator.validate({ schema, data: { name: 'lenon' } })

    assert.deepEqual(data, { name: 'lenon' })
  }

  @Test()
  public async shouldBeAbleToExtendValidationMessages({ assert }: Context) {
    assert.plan(1)
    const validator = new ValidatorImpl()

    validator.extend().messages({
      required: 'The {{ field }} field is REQUIRED!'
    })

    const schema = validator.schema.object({
      test: validator.schema.string()
    })

    try {
      await validator.validate({ schema, data: { test: undefined } })
    } catch (err) {
      assert.deepEqual(err.details || err.messages, [
        { message: 'The test field is REQUIRED!', rule: 'required', field: 'test' }
      ])
    }
  }

  @Test()
  public async shouldBeAbleToExtendTheAcceptedValidationSchema({ assert }: Context) {
    assert.plan(3)

    const validator = new ValidatorImpl()

    validator.extend().accepted('test', (value, options, field) => {
      assert.deepEqual(value, 'on')
      assert.deepEqual(field.name, 'test')
      assert.deepEqual(options, { opt1: 'opt1' })
    })

    const schema = validator.schema.object({
      test: validator.schema.accepted().test({ opt1: 'opt1' })
    })

    await validator.validate({ schema, data: { test: 'on' } })
  }

  @Test()
  public async shouldBeAbleToExtendTheDateValidationSchema({ assert }: Context) {
    assert.plan(3)

    const validator = new ValidatorImpl()

    validator.extend().date('test', (value, options, field) => {
      assert.deepEqual(value, new Date('2024/12/09'))
      assert.deepEqual(field.name, 'test')
      assert.deepEqual(options, { opt1: 'opt1' })
    })

    const schema = validator.schema.object({
      test: validator.schema.date({ formats: ['YYYY/MM/DD'] }).test({ opt1: 'opt1' })
    })

    await validator.validate({ schema, data: { test: '2024/12/09' } })
  }

  @Test()
  public async shouldBeAbleToExtendTheRecordValidationSchema({ assert }: Context) {
    assert.plan(3)

    const validator = new ValidatorImpl()

    validator.extend().record('test', (value, options, field) => {
      assert.deepEqual(value, { hello: 'world' })
      assert.deepEqual(field.name, 'test')
      assert.deepEqual(options, { opt1: 'opt1' })
    })

    const schema = validator.schema.object({
      test: validator.schema.record(validator.schema.string()).test({ opt1: 'opt1' })
    })

    await validator.validate({ schema, data: { test: { hello: 'world' } } })
  }

  @Test()
  public async shouldBeAbleToExtendTheTupleValidationSchema({ assert }: Context) {
    assert.plan(3)

    const validator = new ValidatorImpl()

    validator.extend().tuple('test', (value, options, field) => {
      assert.deepEqual(value, [1, '2'])
      assert.deepEqual(field.name, 'test')
      assert.deepEqual(options, { opt1: 'opt1' })
    })

    const schema = validator.schema.object({
      test: validator.schema.tuple([validator.schema.number(), validator.schema.string()]).test({ opt1: 'opt1' })
    })

    await validator.validate({ schema, data: { test: [1, '2'] } })
  }

  @Test()
  public async shouldBeAbleToExtendTheLiteralValidationSchema({ assert }: Context) {
    assert.plan(3)

    const validator = new ValidatorImpl()

    validator.extend().literal('test', (value, options, field) => {
      assert.deepEqual(value, true)
      assert.deepEqual(field.name, 'test')
      assert.deepEqual(options, { opt1: 'opt1' })
    })

    const schema = validator.schema.object({
      test: validator.schema.literal(true).test({ opt1: 'opt1' })
    })

    await validator.validate({ schema, data: { test: true } })
  }

  @Test()
  public async shouldBeAbleToExtendTheArrayValidationSchema({ assert }: Context) {
    assert.plan(3)

    const validator = new ValidatorImpl()

    validator.extend().array('test', (value, options, field) => {
      assert.deepEqual(value, [1, 2, 3])
      assert.deepEqual(field.name, 'test')
      assert.deepEqual(options, { opt1: 'opt1' })
    })

    const schema = validator.schema.object({
      test: validator.schema.array(validator.schema.number()).test({ opt1: 'opt1' })
    })

    await validator.validate({ schema, data: { test: [1, 2, 3] } })
  }

  @Test()
  public async shouldBeAbleToExtendTheAnyValidationSchema({ assert }: Context) {
    assert.plan(3)

    const validator = new ValidatorImpl()

    validator.extend().any('test', (value, options, field) => {
      assert.deepEqual(value, [1, 2, 3])
      assert.deepEqual(field.name, 'test')
      assert.deepEqual(options, { opt1: 'opt1' })
    })

    const schema = validator.schema.object({
      test: validator.schema.any().test({ opt1: 'opt1' })
    })

    await validator.validate({ schema, data: { test: [1, 2, 3] } })
  }

  @Test()
  public async shouldBeAbleToExtendTheStringValidationSchema({ assert }: Context) {
    assert.plan(3)

    const validator = new ValidatorImpl()

    validator.extend().string('test', (value, options, field) => {
      assert.deepEqual(value, '1')
      assert.deepEqual(field.name, 'test')
      assert.deepEqual(options, { opt1: 'opt1' })
    })

    const schema = validator.schema.object({
      test: validator.schema.string().test({ opt1: 'opt1' })
    })

    await validator.validate({ schema, data: { test: '1' } })
  }

  @Test()
  public async shouldBeAbleToExtendTheNumberValidationSchema({ assert }: Context) {
    assert.plan(3)

    const validator = new ValidatorImpl()

    validator.extend().number('test', (value, options, field) => {
      assert.deepEqual(value, 1)
      assert.deepEqual(field.name, 'test')
      assert.deepEqual(options, { opt1: 'opt1' })
    })

    const schema = validator.schema.object({
      test: validator.schema.number().test({ opt1: 'opt1' })
    })

    await validator.validate({ schema, data: { test: 1 } })
  }

  @Test()
  public async shouldBeAbleToExtendTheEnumValidationSchema({ assert }: Context) {
    assert.plan(3)

    const validator = new ValidatorImpl()

    validator.extend().enum('test', (value, options, field) => {
      assert.deepEqual(value, 'admin')
      assert.deepEqual(field.name, 'test')
      assert.deepEqual(options, { opt1: 'opt1' })
    })

    const schema = validator.schema.object({
      test: validator.schema.enum(['admin', 'customer']).test({ opt1: 'opt1' })
    })

    await validator.validate({ schema, data: { test: 'admin' } })
  }

  @Test()
  public async shouldBeAbleToExtendTheBooleanValidationSchema({ assert }: Context) {
    assert.plan(3)

    const validator = new ValidatorImpl()

    validator.extend().boolean('test', (value, options, field) => {
      assert.deepEqual(value, true)
      assert.deepEqual(field.name, 'test')
      assert.deepEqual(options, { opt1: 'opt1' })
    })

    const schema = validator.schema.object({
      test: validator.schema.boolean().test({ opt1: 'opt1' })
    })

    await validator.validate({ schema, data: { test: true } })
  }

  @Test()
  public async shouldBeAbleToExtendTheObjectValidationSchema({ assert }: Context) {
    assert.plan(3)

    const validator = new ValidatorImpl()

    validator.extend().object('test', (value, options, field) => {
      assert.deepEqual(value, { hello: 'world' })
      assert.deepEqual(field.name, 'test')
      assert.deepEqual(options, { opt1: 'opt1' })
    })

    const schema = validator.schema.object({
      test: validator.schema.object({ hello: validator.schema.string() }).test({ opt1: 'opt1' })
    })

    await validator.validate({ schema, data: { test: { hello: 'world' } } })
  }
}
