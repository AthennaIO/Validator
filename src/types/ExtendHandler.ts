/**
 * @athenna/validator
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { FieldContext } from '#src/types'

export type ExtendHandlerType = (
  value: unknown,
  options: any,
  field: FieldContext
) => any | Promise<any>
