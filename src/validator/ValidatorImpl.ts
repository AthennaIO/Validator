/**
 * @athenna/validator
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/* eslint-disable no-use-before-define */

import {
  v,
  Vine,
  VineAccepted,
  VineAny,
  VineArray,
  VineBoolean,
  VineDate,
  VineEnum,
  VineLiteral,
  VineNumber,
  VineObject,
  VineRecord,
  VineString,
  VineTuple
} from '#src'

import type {
  SchemaTypes,
  ExtendReturnType,
  ExtendHandlerType
} from '#src/types'
import { SimpleMessagesProvider } from '@vinejs/vine'
import type { Infer, ValidationOptions } from '@vinejs/vine/types'

export class ValidatorImpl {
  /**
   * This getter will return the vine instance to
   * build your validation schemas:
   *
   * ```ts
   * const schema = v.object({
   *   name: v.string(),
   *   email: v.string().email(),
   *   password: v.string().minLength(8).maxLength(32).confirmed()
   * })
   * ```
   */
  public get schema(): Vine {
    return v
  }

  /**
   * Validate data by passing a schema and data. Also
   * accepts other fields such as message provider
   * and error reporter.
   *
   * ```ts
   * const data = { name: 'Lenon' }
   * const schema = v.object({ name: v.string() })
   *
   * await v.validate({ schema, data })
   * ```
   */
  public async validate(
    options: { schema: SchemaTypes; data: any } & ValidationOptions<
      Record<string, any> | undefined
    >
  ): Promise<Infer<SchemaTypes>> {
    return v.validate(options)
  }

  /**
   * Extend vine validation schema by adding new
   * validation rules or add custom messages:
   *
   * ```ts
   * Validate.extend().string('lenon', (value, options, field) => {
   *   if (!Is.String(value)) {
   *     return
   *   }
   *
   *   if (value !== 'lenon') {
   *     field.report('The {{ field }} field value is not lenon', 'lenon', field)
   *   }
   * })
   * ```
   */
  public extend(): ExtendReturnType {
    const macro = (Vine: any, name: string, handler: any) => {
      Vine.macro(name, handler)
    }

    return {
      messages: (messages: Record<string, string>) => {
        v.messagesProvider = new SimpleMessagesProvider(messages)

        return this
      },
      accepted: (name: string, handler: ExtendHandlerType) => {
        macro(VineAccepted, name, function (this: VineAccepted, opt: any) {
          const rule = v.createRule(handler)
          return this.use(rule(opt))
        })

        return this
      },
      date: (name: string, handler: ExtendHandlerType) => {
        macro(VineDate, name, function (this: VineDate, opt: any) {
          const rule = v.createRule(handler)
          return this.use(rule(opt))
        })

        return this
      },
      record: (name: string, handler: ExtendHandlerType) => {
        macro(VineRecord, name, function (this: VineRecord<any>, opt: any) {
          const rule = v.createRule(handler)
          return this.use(rule(opt))
        })

        return this
      },
      tuple: (name: string, handler: ExtendHandlerType) => {
        macro(VineTuple, name, function (this: any, opt: any) {
          const rule = v.createRule(handler)
          return this.use(rule(opt))
        })

        return this
      },
      literal: (name: string, handler: ExtendHandlerType) => {
        macro(VineLiteral, name, function (this: VineLiteral<any>, opt: any) {
          const rule = v.createRule(handler)
          return this.use(rule(opt))
        })

        return this
      },
      array: (name: string, handler: ExtendHandlerType) => {
        macro(VineArray, name, function (this: VineArray<any>, opt: any) {
          const rule = v.createRule(handler)
          return this.use(rule(opt))
        })

        return this
      },
      any: (name: string, handler: ExtendHandlerType) => {
        macro(VineAny, name, function (this: VineAny, opt: any) {
          const rule = v.createRule(handler)
          return this.use(rule(opt))
        })

        return this
      },
      string: (name: string, handler: ExtendHandlerType) => {
        macro(VineString, name, function (this: VineString, opt: any) {
          const rule = v.createRule(handler)
          return this.use(rule(opt))
        })

        return this
      },
      number: (name: string, handler: ExtendHandlerType) => {
        macro(VineNumber, name, function (this: VineNumber, opt: any) {
          const rule = v.createRule(handler)
          return this.use(rule(opt))
        })

        return this
      },
      enum: (name: string, handler: ExtendHandlerType) => {
        macro(VineEnum, name, function (this: VineEnum<any>, opt: any) {
          const rule = v.createRule(handler)
          return this.use(rule(opt))
        })

        return this
      },
      boolean: (name: string, handler: ExtendHandlerType) => {
        macro(VineBoolean, name, function (this: VineBoolean, opt: any) {
          const rule = v.createRule(handler)
          return this.use(rule(opt))
        })

        return this
      },
      object: (name: string, handler: ExtendHandlerType) => {
        macro(VineObject, name, function (this: any, opt: any) {
          const rule = v.createRule(handler)
          return this.use(rule(opt))
        })

        return this
      }
    }
  }
}
