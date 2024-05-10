/**
 * @athenna/validator
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseConfigurer } from '@athenna/artisan'

export default class ValidatorConfigurer extends BaseConfigurer {
  public async configure() {
    const task = this.logger.task()

    task.addPromise('Update commands of .athennarc.json', () => {
      return this.rc
        .setTo(
          'commands',
          'make:validator',
          '@athenna/validator/commands/MakeValidatorCommand'
        )
        .save()
    })

    task.addPromise('Update templates of .athennarc.json', () => {
      return this.rc
        .setTo(
          'templates',
          'validator-http',
          'node_modules/@athenna/validator/templates/validator-http.edge'
        )
        .setTo(
          'templates',
          'validator-console',
          'node_modules/@athenna/validator/templates/validator-console.edge'
        )
        .save()
    })

    task.addPromise('Update providers of .athennarc.json', () => {
      return this.rc
        .pushTo('providers', '@athenna/validator/providers/ValidatorProvider')
        .save()
    })

    await task.run()

    console.log()
    this.logger.success(
      'Successfully configured ({dim,yellow} @athenna/validator) library'
    )
  }
}
