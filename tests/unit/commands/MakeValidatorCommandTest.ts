/**
 * @athenna/validator
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Path, File } from '@athenna/common'
import { Test, type Context } from '@athenna/test'
import { BaseCommandTest } from '#tests/helpers/BaseCommandTest'

export default class MakeValidatorCommandTest extends BaseCommandTest {
  @Test()
  public async shouldBeAbleToCreateAValidatorFile({ assert, command }: Context) {
    const output = await command.run('make:validator TestValidator')

    output.assertSucceeded()
    output.assertLogged('[ MAKING VALIDATOR ]')
    output.assertLogged('[  success  ] Validator "TestValidator" successfully created.')
    output.assertLogged('[  success  ] Athenna RC updated: [ validators += "#app/validators/TestValidator" ]')

    const { athenna } = await new File(Path.pwd('package.json')).getContentAsJson()

    assert.isTrue(await File.exists(Path.validators('TestValidator.ts')))
    assert.containsSubset(athenna.validators, ['#app/validators/TestValidator'])
  }

  @Test()
  public async shouldBeAbleToCreateAValidatorFileWithADifferentDestPathAndImportPath({ assert, command }: Context) {
    const output = await command.run('make:validator TestValidator', {
      path: Path.fixtures('consoles/console-mock-dest-import.ts')
    })

    output.assertSucceeded()
    output.assertLogged('[ MAKING VALIDATOR ]')
    output.assertLogged('[  success  ] Validator "TestValidator" successfully created.')
    output.assertLogged(
      '[  success  ] Athenna RC updated: [ validators += "#tests/fixtures/storage/validators/TestValidator" ]'
    )

    const { athenna } = await new File(Path.pwd('package.json')).getContentAsJson()

    assert.isTrue(await File.exists(Path.fixtures('storage/validators/TestValidator.ts')))
    assert.containsSubset(athenna.validators, ['#tests/fixtures/storage/validators/TestValidator'])
  }

  @Test()
  public async shouldThrowAnExceptionWhenTheFileAlreadyExists({ command }: Context) {
    await command.run('make:validator TestValidator')
    const output = await command.run('make:validator TestValidator')

    output.assertFailed()
    output.assertLogged('[ MAKING VALIDATOR ]')
    output.assertLogged('The file')
    output.assertLogged('TestValidator.ts')
    output.assertLogged('already exists')
  }
}
