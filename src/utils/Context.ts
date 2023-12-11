import ConsoleLog from './ConsoleLog'
import environments from '../../core/configurations/context'

const Context = (position: number = 1): string => {
  const context: string = window.location.pathname.split('/')[position]

  ConsoleLog.debug('CONTEXT::PATHNAME', window.location.pathname)
  ConsoleLog.debug('CONTEXT::CONTEXT', context)

  return environments[context] || 'iuvibanking'
}

export default Context
