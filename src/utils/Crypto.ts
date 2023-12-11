/* eslint-disable no-undef */
import { hex2b64 } from '../../core/externalLibraries/base64'
import { RSAKey } from '../../core/externalLibraries/rsa'
import { encryptMessage, importRsaKey } from '../../core/externalLibraries/rsa-oaep'
import ConsoleLog from './ConsoleLog'

/**
 * 
 * @param passwordPlainText 
 * @param publicKey 
 * @param salt 
 * @returns 
 */
const EncryptorV1 = (
  passwordPlainText: string,
  publicKey: string,
  salt: string
): string => {
  const rsa = new RSAKey()

  rsa.setPublic(publicKey, '10001')

  const res = rsa.encrypt(`${salt}|${passwordPlainText}`)

  return hex2b64(res)
}

/**
 * 
 * @param passwordPlainText 
 * @param publicKey 
 * @returns 
 */
const EncryptorV2 = async (
  passwordPlainText: string | CryptoKey,
  publicKey: string,
  salt: string
): Promise<any> => {
  ConsoleLog.debug('EncryptorV2::PK', publicKey)

  const importedKey = await importRsaKey(publicKey)

  return encryptMessage(importedKey, `${salt}|${passwordPlainText}`)
}

/**
 * @param passwordPlainText 
 * @param publicKey 
 * @param salt 
 * @returns 
 */
const Encryptor = async (
  passwordPlainText: string,
  publicKey: string,
  salt: string,
  ewpa?: boolean
): Promise<string> => {
  if (ewpa) {
    return EncryptorV2(passwordPlainText, publicKey, salt)
  }

  return EncryptorV1(passwordPlainText, publicKey, salt)
}

const Crypto = {
  Encryptor,
  EncryptorV1,
  EncryptorV2
}

export default Crypto
