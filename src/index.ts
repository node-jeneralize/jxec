import { type ChildProcess, spawn } from 'child_process'

export class Jxec {
  constructor(private readonly historyLimit: number = 50) {}
  private readonly history: ChildProcess[] = []

  async exec(command: string, options: string[]): Promise<number | undefined> {
    const child = spawn(command, options)
    child.stdout.on('data', (data) => {
      console.log(data.toString())
    })

    this.history.push(child)
    if (this.history.length > this.historyLimit) {
      this.history.shift()
    }

    return await new Promise((resolve, reject) => {
      child.on('error', (err: Error) => {
        reject(err)
      })
      child.on('close', (code: number | null) => {
        resolve(code ?? undefined)
      })
    })
  }

  getPIDs(): Array<number | undefined> {
    return this.history.map((p) => p.pid)
  }

  getLastPID(): number | undefined {
    if (this.history.length === 0) {
      return
    }
    return this.history[this.history.length - 1].pid
  }

  getAlivePIDs(): Array<number | undefined> {
    return this.history.filter((p) => p.exitCode === null).map((p) => p.pid)
  }

  getHistory(): ChildProcess[] {
    return this.history
  }
}
