/**
 * @athenna/validator
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {
  vine,
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

import type { ExtendHandlerType } from '#src/types'

export class ValidatorImpl {
  /**
   * This getter will return the vine instance to
   * build your validation schemas:
   *
   * ```ts
   * const schema = Validate.schema.object({
   *   name: Validate.schema.string(),
   *   email: Validate.schema.string().email(),
   *   password: Validate.schema.string().minLength(8).maxLength(32).confirmed()
   * })
   * ```
   */
  public get schema() {
    return vine
  }

  /**
   * Extend vine validation schema by adding new
   * validation rules:
   *
   * ```ts
   * Validate.extend().string('unique', (value, options, field) => {
   *   if (!options.column) {
   *     options.column = field.name as string
   *   }
   *
   *   const existsRow = await Database.table(options.table)
   *     .select(options.column)
   *     .where(options.column, value)
   *     .exists()
   *
   *   if (existsRow) {
   *     field.report('The {{ field }} field is not unique', 'unique', field)
   *   }
   * })
   * ```
   */
  public extend() {
    const macro = (Vine: any, name: string, handler: any) => {
      Vine.macro(name, handler)
    }

    return {
      accepted: (name: string, handler: ExtendHandlerType) => {
        macro(VineAccepted, name, function (this: VineAccepted, opt: any) {
          const rule = vine.createRule(handler)
          return this.use(rule(opt))
        })

        return this
      },
      date: (name: string, handler: ExtendHandlerType) => {
        macro(VineDate, name, function (this: VineDate, opt: any) {
          const rule = vine.createRule(handler)
          return this.use(rule(opt))
        })

        return this
      },
      record: (name: string, handler: ExtendHandlerType) => {
        macro(VineRecord, name, function (this: VineRecord<any>, opt: any) {
          const rule = vine.createRule(handler)
          return this.use(rule(opt))
        })

        return this
      },
      tuple: (name: string, handler: ExtendHandlerType) => {
        macro(VineTuple, name, function (this: any, opt: any) {
          const rule = vine.createRule(handler)
          return this.use(rule(opt))
        })

        return this
      },
      literal: (name: string, handler: ExtendHandlerType) => {
        macro(VineLiteral, name, function (this: VineLiteral<any>, opt: any) {
          const rule = vine.createRule(handler)
          return this.use(rule(opt))
        })

        return this
      },
      array: (name: string, handler: ExtendHandlerType) => {
        macro(VineArray, name, function (this: VineArray<any>, opt: any) {
          const rule = vine.createRule(handler)
          return this.use(rule(opt))
        })

        return this
      },
      any: (name: string, handler: ExtendHandlerType) => {
        macro(VineAny, name, function (this: VineAny, opt: any) {
          const rule = vine.createRule(handler)
          return this.use(rule(opt))
        })

        return this
      },
      string: (name: string, handler: ExtendHandlerType) => {
        macro(VineString, name, function (this: VineString, opt: any) {
          const rule = vine.createRule(handler)
          return this.use(rule(opt))
        })

        return this
      },
      number: (name: string, handler: ExtendHandlerType) => {
        macro(VineNumber, name, function (this: VineNumber, opt: any) {
          const rule = vine.createRule(handler)
          return this.use(rule(opt))
        })

        return this
      },
      enum: (name: string, handler: ExtendHandlerType) => {
        macro(VineEnum, name, function (this: VineEnum<any>, opt: any) {
          const rule = vine.createRule(handler)
          return this.use(rule(opt))
        })

        return this
      },
      boolean: (name: string, handler: ExtendHandlerType) => {
        macro(VineBoolean, name, function (this: VineBoolean, opt: any) {
          const rule = vine.createRule(handler)
          return this.use(rule(opt))
        })

        return this
      },
      object: (name: string, handler: ExtendHandlerType) => {
        macro(VineObject, name, function (this: any, opt: any) {
          const rule = vine.createRule(handler)
          return this.use(rule(opt))
        })

        return this
      }
    }
  }
}
