/* eslint no-unused-vars: "off" */
import Memory from '../Memory'

interface IConsoleLog {
  debug: (tag: string, data: any) => void
  error: (tag: string, data: any) => void
}

const debugEnable: boolean = process.env.REACT_APP_DEBUG === '1'
const colors: any = {
  debug: 'background: #222; color: #bada55',
  error: 'background: #ff5733; color: #fff'
}

/**
 * Function logger
 * 
 * @param tag  string
 * @param type debug | error
 * @param data any
 */
const logger = (
  tag: string,
  type: 'debug' | 'error',
  data: any
): void => {
  // @ts-ignore
  const logVariable: any = Memory.get('BECOMEADEBUGGER')

  if (logVariable === '7') {
    console.log(`%c ibp::${tag} `, colors[type], data)
  }
}

/**
 * Object that expose ConsoleLog
 */
const ConsoleLog: IConsoleLog = {
  debug(tag, data) {
    logger(tag, 'debug', data)
  },
  error(tag, data) {
    logger(tag, 'error', data)
  }
}

export default ConsoleLog
