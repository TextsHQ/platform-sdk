import path from 'path'
import childProcess from 'child_process'
import { promises as fs } from 'fs'
import { texts } from '..'
import type { Container, ContainerToMainMessage, MainToContainerMessage } from './types'

export default class ChildProcessContainer implements Container {
  private cp: childProcess.ChildProcess | undefined

  readonly initPromise: Promise<void>

  private readonly lockFilePath: string

  constructor(
    private readonly entryPointJSPath: string,
    private readonly env: Record<string, string>,
    dataDirPath: string,
  ) {
    this.lockFilePath = path.join(dataDirPath, 'cli-lock-pid')
    this.initPromise = this.init()
  }

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
    this.cp = texts.forkChildProcess(this.entryPointJSPath, {
      env: {
        ...process.env,
        ...this.env,
      },
    }, { noSentry: true })
    const fsPromise = fs.writeFile(this.lockFilePath, String(this.cp.pid))
    await Promise.all([
      fsPromise,
      new Promise<void>((resolve, reject) => {
        this.cp!
          .once('spawn', () => resolve())
          .on('close', code => texts.log(`child process close all stdio with code ${code}`))
          .on('exit', code => texts.log(`child process exited with code ${code}`))
          .once('error', err => {
            texts.log(`child process errored ${err}`)
            reject(err)
          })
          .on('error', err => {
            texts.log(`child process errored ${err}`)
            texts.Sentry.captureException(err)
          })
      }),
    ])
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
