// generic implementation of bridging with a worker thread and a child process

import path from 'path'
import { promises as fs } from 'fs'
import childProcess from 'child_process'
import type { Worker } from 'worker_threads'

import { texts } from '..'

export interface Bridge {
  // new(entryPointJSPath: string, dataDir: string, env: Record<string, string>): this
  readonly initPromise?: Promise<void>

  onMessage: (handler: (msg: any) => void) => void
  postMessage: (msg: any) => void
  dispose: () => void
}

export class ChildProcessBridge implements Bridge {
  private cp: childProcess.ChildProcess | undefined

  private readonly lockFilePath = path.join(this.dataDirPath, 'cli-lock-pid')

  async ensureSingleton() {
    try {
      const pid = await fs.readFile(this.lockFilePath, 'utf-8')
      if (pid) {
        console.log('[bridge] killing existing cp with pid', pid)
        process.kill(+pid)
      }
    } catch (err) {
      texts.error(err)
    }
  }

  readonly initPromise: Promise<void>

  constructor(
    private readonly entryPointJSPath: string,
    private readonly env: Record<string, string>,
    private readonly dataDirPath: string,
  ) {
    this.initPromise = this.init()
  }

  private async init() {
    await this.ensureSingleton()
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

  onMessage(handler: (msg: any) => void) {
    this.cp!.on('message', handler)
  }

  postMessage(msg: any) {
    this.cp!.send(msg)
  }

  async dispose() {
    this.cp!.kill()
    await fs.unlink(this.lockFilePath).catch(() => { })
  }
}

export class WorkerBridge implements Bridge {
  private worker: Worker

  constructor(
    entryPointJSPath: string,
    env: Record<string, string>,
  ) {
    Object.assign(process.env, env)
    this.worker = texts.runWorker(entryPointJSPath, { noSentry: true })
  }

  onMessage(handler: (msg: any) => void) {
    this.worker.on('message', handler)
  }

  postMessage(msg: any) {
    this.worker.postMessage(msg)
  }

  dispose() {
    this.worker.terminate()
  }
}
