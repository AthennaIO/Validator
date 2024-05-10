/**
 * @athenna/validator
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import 'reflect-metadata'

import { debug } from '#src/debug'
import { Annotation } from '@athenna/ioc'
import { Options, String } from '@athenna/common'
import type { ValidatorOptions } from '#src/types/validators/ValidatorOptions'

/**
 * Create a validator inside the service provider.
 */
export function Validator(options?: ValidatorOptions): ClassDecorator {
  return (target: any) => {
    options = Options.create(options, {
      name: String.toCamelCase(target.name),
      alias: `App/Validators/${target.name}`,
      type: 'transient'
    })

    options.name = `App/Validators/Names/${options.name}`

    debug('Registering validator metadata for the service container %o', {
      ...options,
      name: target.name,
      namedAlias: options.name
    })

    if (ioc.has(options.name)) {
      debug(
        'Skipping registration, named alias %s is already registered.',
        options.name
      )

      return
    }

    if (ioc.has(options.alias)) {
      debug(
        'Skipping registration, alias %s is already registered.',
        options.alias
      )

      return
    }

    Annotation.defineMeta(target, options)
  }
}
