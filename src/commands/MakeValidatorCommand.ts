/**
 * @athenna/validator
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Path } from '@athenna/common'
import { BaseCommand, Argument, Option } from '@athenna/artisan'

export class MakeValidatorCommand extends BaseCommand {
  @Argument({
    description: 'The validator name.'
  })
  public name: string

  @Option({
    default: true,
    signature: '-h, --http',
    description: 'Create a validator for a Http application.'
  })
  public isHttp: boolean

  @Option({
    default: false,
    signature: '-c, --console',
    description: 'Create a validator for a Console (CLI) application.'
  })
  public isConsole: boolean

  public static signature(): string {
    return 'make:validator'
  }

  public static description(): string {
    return 'Make a new validator file.'
  }

  public async handle(): Promise<void> {
    this.logger.simple('({bold,green} [ MAKING VALIDATOR ])\n')

    const destination = Config.get(
      'rc.commands.make:validator.destination',
      Path.validators()
    )

    const template = this.isConsole ? 'validator-console' : 'validator-http'

    const file = await this.generator
      .fileName(this.name)
      .destination(destination)
      .template(template)
      .setNameProperties(true)
      .make()

    this.logger.success(
      `Validator ({yellow} "${file.name}") successfully created.`
    )

    const importPath = this.generator.getImportPath()

    await this.rc.pushTo('validators', importPath).save()

    this.logger.success(
      `Athenna RC updated: ({dim,yellow} [ validators += "${importPath}" ])`
    )
  }
}
