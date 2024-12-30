import type { ExtendHandlerType } from '#src/types'
import type { ValidatorImpl } from '#src/validator/ValidatorImpl'

export type ExtendReturnType = {
  /**
   * Extend error messages of all your validations. This method
   * doesn't save past extends, which means that if you call
   * it twice, only the second one will be respected.
   *
   * ```ts
   * Validate.extend().messages({
   *   // Applicable for all fields
   *  'required': 'The {{ field }} field is required',
   *  'string': 'The value of {{ field }} field must be a string',
   *  'email': 'The value is not a valid email address',
   *
   *  // Error message only for the username field
   *  'username.required': 'Please choose a username for your account'
   * })
   * ```
   */
  messages: (messages: Record<string, string>) => ValidatorImpl
  accepted: (name: string, handler: ExtendHandlerType) => ValidatorImpl
  date: (name: string, handler: ExtendHandlerType) => ValidatorImpl
  record: (name: string, handler: ExtendHandlerType) => ValidatorImpl
  tuple: (name: string, handler: ExtendHandlerType) => ValidatorImpl
  literal: (name: string, handler: ExtendHandlerType) => ValidatorImpl
  array: (name: string, handler: ExtendHandlerType) => ValidatorImpl
  any: (name: string, handler: ExtendHandlerType) => ValidatorImpl
  string: (name: string, handler: ExtendHandlerType) => ValidatorImpl
  number: (name: string, handler: ExtendHandlerType) => ValidatorImpl
  enum: (name: string, handler: ExtendHandlerType) => ValidatorImpl
  boolean: (name: string, handler: ExtendHandlerType) => ValidatorImpl
  object: (name: string, handler: ExtendHandlerType) => ValidatorImpl
}
