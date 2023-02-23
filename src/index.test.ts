import { ChildProcess } from 'child_process'
import { Jxec } from './index'

describe('Jxec', () => {
  const spyOnConsole = jest.spyOn(console, 'log').mockImplementation()
  let jxec: Jxec
  beforeEach(() => {
    spyOnConsole.mockClear()
    jxec = new Jxec()
  })

  test('exec', async () => {
    await jxec.exec('echo', ['jxec'])
    expect(spyOnConsole).toBeCalledWith('jxec\n')
  })

  test('get last pid', async () => {
    await jxec.exec('echo', ['jxec'])
    const echoPID = jxec.getLastPID()
    expect(echoPID).toBeGreaterThan(1)
  })

  test('miss last pid', () => {
    const miss = jxec.getLastPID()
    expect(miss).toBeUndefined()
  })

  test('get PIDs', async () => {
    const estimateLength = 10
    for (let i = 0; i < estimateLength; i++) {
      await jxec.exec('echo', ['jxec'])
    }
    const PIDs = jxec.getPIDs()
    expect(PIDs).toHaveLength(estimateLength)
  })

  test('max PID histories length is 50 as default', async () => {
    const times = 60
    for (let i = 0; i < times; i++) {
      await jxec.exec('echo', ['jxec'])
    }
    const PIDs = jxec.getPIDs()
    expect(PIDs).toHaveLength(50)
  })

  test('max PID histories can give on constructor', async () => {
    const newLimit = 10
    const jxec = new Jxec(newLimit)
    const times = 11
    for (let i = 0; i < times; i++) {
      await jxec.exec('echo', ['jxec'])
    }
    const PIDs = jxec.getPIDs()
    expect(PIDs).toHaveLength(newLimit)
  })

  test('not exited process', () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    jxec.exec('sleep', ['3'])
    const alive = jxec.getAlivePIDs()
    expect(alive).toHaveLength(1)
  })

  test('get row history', async () => {
    const times = 10
    for (let i = 0; i < times; i++) {
      await jxec.exec('echo', ['jxec'])
    }
    const histories = jxec.getHistory()
    expect(histories).toHaveLength(times)
    expect(histories.every((h) => h instanceof ChildProcess)).toBeTruthy()
  })
})
