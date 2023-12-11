import jose from 'node-jose'
import ConsoleLog from './ConsoleLog'

export type BankInfo = {
  publicKey: string,
  salt: string,
  inactivity?: string,
  alertOne?: string,
  alertTwo?: string,
  profile: string,
  ewpba: string,
  ewpa: string,
  serviceClassId: string
}

export type InfoJWT = {
  sessionId: string,
  todo1AccessToken: string
  tenant: string,
  bankParameters: BankInfo
}

const ParseJWT = (token: string): InfoJWT => {
  try {
    const jwtInfo: Buffer = jose.util.base64url.decode(token.split('.')[1])
    const jwtDecoded: InfoJWT = JSON.parse(Buffer.from(jwtInfo).toString('utf8'))

    ConsoleLog.debug('PARSEJWT::DECODED', jwtDecoded)

    return {
      sessionId: jwtDecoded.sessionId,
      todo1AccessToken: jwtDecoded.todo1AccessToken,
      tenant: jwtDecoded.tenant,
      bankParameters: jwtDecoded.bankParameters
    }
  } catch (err: any) {
    ConsoleLog.error('PARSEJWT::DECODED', err)

    return err
  }
}

export default ParseJWT
