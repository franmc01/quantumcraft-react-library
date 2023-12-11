/* eslint-env browser */
import axios from 'axios'
import ConsoleLog from '../ConsoleLog'
import Memory from '../Memory'

interface IConfigurations {
  APPID: string
  ENV: string | 'DEV' | 'SIT' | 'DEMO'
  CONFIGURATION_URL: string
}

export const Configurations = async ({
  APPID,
  ENV,
  CONFIGURATION_URL
}: IConfigurations): Promise<any> => {
  try {
    let configFromService: any

    const configFromStorage: any = Memory.get(`CONFIGURATIONS_${APPID}`, false) || Memory.get('CONFIGURATIONS', false)

    ConsoleLog.debug('CONFIGURATIONS::FROM::STORAGE', configFromStorage)

    if (!configFromStorage) {
      const serverPromise: Promise<any> = axios
        .get(`${CONFIGURATION_URL}/global/server?appId=${APPID}`, {
          headers: {
            ENV
          }
        })

      const globalPromise: Promise<any> = axios
        .get(`${CONFIGURATION_URL}/global?appId=${APPID}`, {
          headers: {
            ENV
          }
        })

      const initialBankInfoPromise: Promise<any> = axios
        .get(`${CONFIGURATION_URL}/initialBankInfo?appId=${APPID}`, {
          headers: {
            ENV
          }
        })

      configFromService = await Promise.all([serverPromise, globalPromise, initialBankInfoPromise])
    }

    ConsoleLog.debug('CONFIGURATIONS::FROM::SERVICE', configFromService)

    const [
      configFromServiceServer,
      configFromServiceGlobal,
      configFromServiceInitialBankInfo
    ] = configFromService || []

    return {
      server: configFromStorage?.serverEndpoint
        || configFromServiceServer?.data?.data,
      global: configFromStorage?.globalConfigurations
        || configFromServiceGlobal?.data?.data,
      initialBankInfo: configFromStorage?.initialBankInfo
        || configFromServiceInitialBankInfo?.data?.data
    }
  } catch (err: any) {
    ConsoleLog.error('CONFIGURATIONS::FROM::SERVICE', err)

    return null
  }
}

export default Configurations
