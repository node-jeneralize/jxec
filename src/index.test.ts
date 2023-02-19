import { Jxec } from './index'

describe('Jxec', () => {
  test('exec', async () => {
    const spyOnConsole = jest.spyOn(console, 'log').mockImplementation()
    const jxec = new Jxec()
    await jxec.exec('echo', ['jxec'])
    expect(spyOnConsole).toBeCalledWith('jxec\n')
  })
})
