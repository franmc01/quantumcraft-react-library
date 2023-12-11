/* eslint-disable no-plusplus */

import { ConsoleLog } from "../../src/utils"


// from https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
function str2ab(str: string): ArrayBuffer {
  const buf: ArrayBuffer = new ArrayBuffer(str.length)
  const bufView: Uint8Array = new Uint8Array(buf)

  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i)
  }

  return buf
}

/*
 * Fetch the contents of the 'message' textbox, and encode it
 * in a form we can use for the encrypt operation.
 */
function getEncoded(message: string): Uint8Array {
  const enc = new TextEncoder()

  return enc.encode(message)
}

function bytesArrToBase64(arr: []): string {
  const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/' // base64 alphabet
  const bin = (n) => n.toString(2).padStart(8, 0) // convert num to 8-bit binary strings
  const l = arr.length

  let result = ''

  for (let i = 0; i <= (l - 1) / 3; i++) {
    const c1 = i * 3 + 1 >= l // case when '=' is on end
    const c2 = i * 3 + 2 >= l // case when '=' is on end
    const chunk = bin(arr[3 * i]) + bin(c1 ? 0 : arr[3 * i + 1]) + bin(c2 ? 0 : arr[3 * i + 2])
    // eslint-disable-next-line no-confusing-arrow, eqeqeq, no-nested-ternary, prefer-template
    const r = chunk.match(/.{1,6}/g).map((x, j) => j == 3 && c2 ? '=' : (j == 2 && c1 ? '=' : abc[+('0b' + x)]))

    result += r.join('')
  }

  return result
}

/**
 * Cifra clearText y lo devuelve codificado en base64
 */
export async function encryptMessage(key: CryptoKey, clearText: string): Promise<string> {
  const encoded = getEncoded(clearText)
  // The iv must never be reused with a given key.

  const ciphertext = await window.crypto.subtle.encrypt(
    {
      name: 'RSA-OAEP'
    },
    key,
    encoded
  )

  const buffer: ArrayBuffer = new Uint8Array(ciphertext, 0, ciphertext.byteLength)
  const base64Encrypted = bytesArrToBase64(buffer as unknown as any)

  return base64Encrypted
}

/**
 * Descifra clearText y lo devuelve codificado en base64
 */
export async function decryptMessage(key: CryptoKey, clearText: string): Promise<string> {
  const encoded = getEncoded(clearText)
  // The iv must never be reused with a given key.

  const ciphertext = await window.crypto.subtle.decrypt(
    {
      name: 'RSA-OAEP'
    },
    key,
    encoded
  )

  return Buffer.from(ciphertext).toString()
}

/**
 * @param pem 
 * @returns 
 */
export function importRsaKey(pem: string): any {
  const pemHeader: string = '-----BEGIN PUBLIC KEY-----'
  const pemFooter: string = '-----END PUBLIC KEY-----'

  pem = pem.trim()

  let pemContents = pem

  if (pem.indexOf(pemHeader) >= 0) {
    pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length)
  }

  const binaryDerString = window.atob(pemContents)
  // convert from a binary string to an ArrayBuffer
  const binaryDer = str2ab(binaryDerString)

  ConsoleLog.debug('BINARYDER', binaryDer)

  const key = window.crypto.subtle.importKey(
    'spki',
    binaryDer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256'
    },
    true,
    ['encrypt']
  )

  return key
}

(window as any).rsa = {
  decryptMessage,
  encryptMessage,
  getEncoded,
  importRsaKey
}
