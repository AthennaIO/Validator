/**
 * @athenna/validator
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { SchemaTypes } from '#src/types'
import { Validate } from '#src/facades/Validate'

export abstract class BaseValidator {
  public validator = Validate.schema

  public abstract schema: SchemaTypes
  public abstract handle(data: any): Promise<void>

  public validate(data: any) {
    return this.validator.validate({ schema: this.schema, data })
  }
}
