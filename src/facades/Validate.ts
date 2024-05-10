/**
 * @athenna/validator
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Facade } from '@athenna/ioc'
import type { ValidatorImpl } from '#src/validator/ValidatorImpl'

export const Validate = Facade.createFor<ValidatorImpl>(
  'Athenna/Core/Validator'
)
