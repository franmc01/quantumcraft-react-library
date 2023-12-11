/**
 * 
 * @param str 
 * @returns 
 */
function base64ToBytesArr(str: string): any[] {
  const abc: any = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/']

  const result = []

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < str.length / 4; i++) {
    const chunk = [...str.slice(4 * i, 4 * i + 4)]
    const bin = chunk.map((x) => abc.indexOf(x).toString(2).padStart(6, 0)).join('')
    // eslint-disable-next-line prefer-template
    const bytes = bin.match(/.{1,8}/g).map((x) => +('0b' + x))

    // eslint-disable-next-line eqeqeq
    result.push(...bytes.slice(0, 3 - Number(str[4 * i + 2] == '=') - Number(str[4 * i + 3] == '=')))
  }

  return result
}

/**
 * 
 * @param arr 
 * @returns 
 */
export function bytesArrToBase64(arr: any): string {
  const abc: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  const bin = (n: any) => n.toString(2).padStart(8, 0)
  const l = arr.length

  let result = ''

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i <= (l - 1) / 3; i++) {
    const c1 = i * 3 + 1 >= l
    const c2 = i * 3 + 2 >= l
    const chunk = bin(arr[3 * i]) + bin(c1 ? 0 : arr[3 * i + 1]) + bin(c2 ? 0 : arr[3 * i + 2])

    // eslint-disable-next-line no-confusing-arrow, no-nested-ternary, prefer-template, eqeqeq
    const r = chunk.match(/.{1,6}/g).map((x: any, j: any) => j == 3 && c2 ? '=' : (j == 2 && c1 ? '=' : abc[+('0b' + x)]))

    result += r.join('')
  }

  return result
}

/**
 * 
 * @param array 
 * @returns 
 */
function Utf8ArrayToStr(array: []) {
  let out: any
  let i: any
  let len: any
  let c: any
  let char2: any
  let char3: any

  out = ''
  // eslint-disable-next-line prefer-const
  len = array.length
  i = 0

  while (i < len) {
    // eslint-disable-next-line no-plusplus
    c = array[i++]

    // eslint-disable-next-line default-case, no-bitwise
    switch (c >> 4) {
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
        out += String.fromCharCode(c)
        break
      case 12: case 13:
        // eslint-disable-next-line no-plusplus
        char2 = array[i++]
        // eslint-disable-next-line no-bitwise
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F))

        break
      case 14:
        // eslint-disable-next-line no-plusplus
        char2 = array[i++]
        // eslint-disable-next-line no-plusplus
        char3 = array[i++]
        // eslint-disable-next-line no-bitwise
        out += String.fromCharCode(((c & 0x0F) << 12)
          // eslint-disable-next-line no-bitwise
          | ((char2 & 0x3F) << 6)
          // eslint-disable-next-line no-bitwise
          | ((char3 & 0x3F) << 0))

        break
    }
  }

  return out
}

/*
 * Fetch the contents of the 'message' textbox, and encode it
 * in a form we can use for the encrypt operation.
 */
function getEncoded(message: string): Uint8Array {
  const enc: TextEncoder = new TextEncoder()

  return enc.encode(message)
}

/**
 * Devuelve el IV concatenado con el valor cifrado, codificado en base64
 */
export async function encryptMessage(key: CryptoKey, clearText: string): Promise<string> {
  const encoded: any = getEncoded(clearText)
  const iv: Uint8Array = window.crypto.getRandomValues(new Uint8Array(12))
  const ciphertext: ArrayBufferLike = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv
    },
    key,
    encoded
  )

  const buffer = new Uint8Array(ciphertext, 0, ciphertext.byteLength)
  const ivPlusEnc = new Uint8Array(buffer.byteLength + iv.byteLength)

  ivPlusEnc.set(iv as unknown as ArrayLike<any>, 0)
  ivPlusEnc.set(buffer, iv.byteLength)

  const base64Encrypted: string = bytesArrToBase64(ivPlusEnc)

  return base64Encrypted
}

/*
 * Fetch the ciphertext and decrypt it.
 * Write the decrypted message into the 'Decrypted' box.
 */
export async function decryptMessage(key: CryptoKey, base64Encrypted: string): Promise<string> {
  const ivPlusEnc: Array<any> = base64ToBytesArr(base64Encrypted)
  const iv: Uint8Array = new Uint8Array(ivPlusEnc.slice(0, 12))
  const enc: Uint8Array = new Uint8Array(ivPlusEnc.slice(12))

  const decrypted: ArrayBufferLike = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv
    },
    key,
    enc
  )

  const decryptedPlainText = Utf8ArrayToStr(new Uint8Array(
    decrypted,
    0,
    decrypted.byteLength
  ) as unknown as [])

  return decryptedPlainText
}

/**
 * 
 * @returns 
 */
export async function generateKey(): Promise<CryptoKey> {
  const key: CryptoKey = await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256
    },
    true,
    ['encrypt', 'decrypt']
  )

  return key
}

/**
 * 
 * @param key 
 * @returns 
 */
export async function exportKeyToBase64(key: CryptoKey): Promise<string> {
  const byteArrayKey: ArrayBuffer = await window.crypto.subtle.exportKey(
    'raw',
    key
  )

  const exportedKey: Uint8Array = new Uint8Array(byteArrayKey)
  const base64Key: string = bytesArrToBase64(exportedKey)

  return base64Key
}

/*
 * Export the given key and write it into the 'exported-key' space.
 */
export async function exportCryptoKey(key: CryptoKey): Promise<string> {
  const exported: ArrayBuffer = await window.crypto.subtle.exportKey(
    'raw',
    key
  )

  const exportedKeyBuffer: Int8Array = new Int8Array(exported)
  const base64: string = bytesArrToBase64(exportedKeyBuffer)

  return base64
}

/**
 * @param base64Key 
 * @returns 
 */
export async function importBase64Key(base64Key: string): Promise<CryptoKey> {
  const byteArrayKey: any = base64ToBytesArr(base64Key)
  const uintKey = new Int8Array(byteArrayKey, 0, byteArrayKey.byteLength)

  const key: CryptoKey = await window.crypto.subtle.importKey(
    'raw',
    uintKey,
    'AES-GCM',
    true,
    ['encrypt', 'decrypt']
  )

  return key
}

(window as any).aes = {
  importBase64Key,
  exportCryptoKey,
  exportKeyToBase64,
  generateKey,
  Utf8ArrayToStr,
  decryptMessage,
  encryptMessage,
  getEncoded
}
