/**
 * @athenna/validator
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '@athenna/common'

export class ValidationException extends Exception {
  public constructor(errors: any[]) {
    const status = 422
    const message = 'Validation failure'
    const code = 'E_VALIDATION_ERROR'
    const details = errors

    super({ code, status, message, details })
  }
}
