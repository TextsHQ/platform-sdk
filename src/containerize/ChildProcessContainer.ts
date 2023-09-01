import path from 'path'
import childProcess from 'child_process'
import { promises as fs } from 'fs'
import { Container, ContainerToMainMessage, MainToContainerMessage } from './types'
import { texts } from '..'

export default class ChildProcessContainer implements Container {
  private cp: childProcess.ChildProcess | undefined

  readonly initPromise: Promise<void>

  constructor(
    private readonly entryPointJSPath: string,
    private readonly env: Record<string, string>,
    private readonly dataDirPath: string,
  ) {
    this.initPromise = this.init()
  }

  private readonly lockFilePath = path.join(this.dataDirPath, 'cli-lock-pid')

  async ensureSingleton() {
    try {
      const pid = await fs.readFile(this.lockFilePath, 'utf-8')
      if (pid) {
        console.log('[cp container] killing existing cp with pid', pid)
        process.kill(+pid)
      }
    } catch (err) {
      texts.error(err)
      texts.Sentry.captureException(err)
    }
  }

  private async init() {
    await this.ensureSingleton()
    texts.log('[cp container] init', this.entryPointJSPath)
    this.cp = childProcess.fork(this.entryPointJSPath, {
      serialization: 'advanced',
      stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
      env: {
        ...process.env,
        ...this.env,
      },
    })
    await fs.writeFile(this.lockFilePath, String(this.cp.pid))
    this.cp
      .on('close', code => texts.log(`child process close all stdio with code ${code}`))
      .on('exit', code => texts.log(`child process exited with code ${code}`))
      .on('error', code => texts.log(`child process errored with code ${code}`))
  }

  onMessage(handler: (msg: ContainerToMainMessage) => void) {
    this.cp!.on('message', handler)
  }

  postMessage(msg: MainToContainerMessage) {
    this.cp!.send(msg)
  }

  async dispose() {
    this.cp!.kill()
    await fs.unlink(this.lockFilePath).catch(() => { })
  }
}
