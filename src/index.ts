/**
 * @athenna/validator
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import vine, {
  Vine,
  VineAny,
  VineDate,
  VineEnum,
  VineTuple,
  VineArray,
  VineString,
  VineRecord,
  VineObject,
  VineNumber,
  VineLiteral,
  VineBoolean,
  VineAccepted,
  SimpleErrorReporter,
  SimpleMessagesProvider
} from '@vinejs/vine'

export * from '#src/types'
export * from '#src/facades/Validate'
export * from '#src/annotations/Validator'
export * from '#src/validator/BaseValidator'
export * from '#src/validator/ValidatorImpl'
export * from '#src/providers/ValidatorProvider'
export * from '#src/exceptions/ValidationException'

const v = vine

export {
  v,
  vine,
  Vine,
  VineAny,
  VineDate,
  VineEnum,
  VineTuple,
  VineArray,
  VineString,
  VineRecord,
  VineObject,
  VineNumber,
  VineLiteral,
  VineBoolean,
  VineAccepted,
  SimpleErrorReporter,
  SimpleMessagesProvider
}
