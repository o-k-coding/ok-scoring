import { ExecutorContext } from '@nrwl/devkit';
import { execSync } from 'child_process';

export interface ServeExecutorSchema {
  main: string,
}

export default async function goServeExecutor(
  options: ServeExecutorSchema,
  context: ExecutorContext
) {
  const projectName = context?.projectName;
  const sourceRoot = context?.workspace?.projects[projectName]?.sourceRoot;

  console.log('source root', sourceRoot);

  const mainFile = options.main || 'main.go';

  const command = `go run ${mainFile}`;
  try {
    console.log(`Executing command: ${command}`)
    execSync(command, { cwd: sourceRoot, stdio: [0, 1, 2] })
    return { success: true }
  } catch (e) {
    console.error(`Failed to execute command: ${command}`, e)
    return { success: false }
  }
}
