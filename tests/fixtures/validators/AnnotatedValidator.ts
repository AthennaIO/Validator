/**
 * @athenna/validator
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Validator } from '#src/annotations/Validator'
import { BaseValidator } from '#src/validator/BaseValidator'

@Validator({
  name: 'annotated',
  alias: 'annotatedValidator',
  type: 'singleton'
})
export class AnnotatedValidator extends BaseValidator {
  public schema = this.validator.object({
    name: this.validator.string()
  })

  public async handle(data: any) {
    await this.validate(data)
  }
}
