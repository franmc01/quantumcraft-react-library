import { AxiosInstance, AxiosStatic } from 'axios'
import ConsoleLog from './ConsoleLog'
import ParseJWT, { InfoJWT } from './ParseJWT'

interface IMeParams {
  (
    // eslint-disable-next-line no-unused-vars
    axios: AxiosInstance | AxiosStatic | any,
    // eslint-disable-next-line no-unused-vars
    context: string,
    // eslint-disable-next-line no-unused-vars
    baseDomainUrl: string,
  ): Promise<any>
}

const Me: IMeParams = async (axios, context, baseDomainUrl): Promise<any> => {
  try {
    ConsoleLog.debug('ME::AXIOS', axios)

    const userAccessToken = (window as any).userAccessToken || ''
    
    ConsoleLog.debug('ME::USERACCESSTOKEN', userAccessToken)

    let requestConfiguration: any = {}

    if (userAccessToken) {
      requestConfiguration = {
        headers: {
          Authorization: `Bearer ${userAccessToken}`
        }
      }
    }
        
    const { data } = await axios.get(`${baseDomainUrl}/api/customers/realms/${context}/me`, requestConfiguration)

    ConsoleLog.debug('ME::RESPONSEME::DATA', data)

    const parsedJWT: InfoJWT = ParseJWT(data.delegated_token?.access_token)

    ConsoleLog.debug('ME::RESPONSEME::JWT', parsedJWT)

    return {
      ...parsedJWT,
      data
    }
  } catch (err: any) {
    ConsoleLog.error('ME::ERROR', err)

    return {}
  }
}

export default Me
