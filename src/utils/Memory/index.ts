/* eslint-disable no-template-curly-in-string */
/* eslint no-unused-vars: "off" */

import {
  LOCALSTORAGE,
  SESSIONSTORAGE
} from './enums'

import ConsoleLog from '../ConsoleLog'

interface IMemory {
  set: (
    key: keyof typeof LOCALSTORAGE | keyof typeof SESSIONSTORAGE | `CONFIGURATIONS_${string}` | `LANGUAGELABELS_${string}`,
    value: any,
    stringify?: boolean
  ) => void
  get: (
    key: keyof typeof LOCALSTORAGE | keyof typeof SESSIONSTORAGE | `CONFIGURATIONS_${string}` | `LANGUAGELABELS_${string}`,
    parse?: boolean
  ) => any
  clear: (
    type: 'SESSION' | 'LOCAL',
    callbackOrArray?: string[] | any,
    callback?: () => void
  ) => void
}

const arrayFromSession: any[] = Object.values(SESSIONSTORAGE)
const arrayFromLocal: any[] = Object.values(LOCALSTORAGE)

/**
 * Function to compare regexps
 * 
 * @param regexps 
 * @param key 
 * @returns 
 */
const regexpMatcher = (regexps: any[], key: string): boolean => {
  let match: boolean = false

  regexps.forEach((regexp: string) => {
    const regexpLiteral = new RegExp(`^${regexp}$`)

    if (regexpLiteral.test(key)) {
      match = true
    }
  })

  return match
}

/**
 * Function that handle the save of values un SESSION or LOCAL storage
 */
const Memory: IMemory = {
  /**
   * Function that set in SESSION or LOCAL it depends on the key
   * 
   * @param key 
   * @param value 
   * @param stringify 
   */
  set(key, value, stringify) {
    let newValue: any = value

    if (stringify) {
      newValue = JSON.stringify(newValue)
    }

    if (
      arrayFromLocal.includes(key)
      || regexpMatcher(arrayFromLocal, key)
    ) {
      window.localStorage.setItem(key, newValue)
    } else if (
      arrayFromSession.includes(key)
      || regexpMatcher(arrayFromSession, key)
    ) {
      window.sessionStorage.setItem(key, newValue)
    } else {
      // @ts-ignore
      ConsoleLog.error('STORAGE::SET', `NOT KEY FOUND ${key}`)
    }
  },
  /**
   * Function that retrieve a value from SESSION or LOCAL it depends on the key
   * 
   * @param key 
   * @param parse 
   * @returns 
   */
  get(key, parse) {
    let newValue: any

    if (
      arrayFromLocal.includes(key as unknown as LOCALSTORAGE)
      || regexpMatcher(arrayFromLocal, key)
    ) {
      newValue = window.localStorage.getItem(key as string)
    } else if (
      arrayFromSession.includes(key as unknown as SESSIONSTORAGE)
      || regexpMatcher(arrayFromSession, key)
    ) {
      newValue = window.sessionStorage.getItem(key as string)
    } else {
      ConsoleLog.error('STORAGE::GET', `NOT KEY FOUND ${key}`)

      return null
    }

    if (parse) {
      newValue = JSON.parse(newValue)
    }

    return newValue
  },
  /**
   * clear all SESSION or LOCAL vars depends on type
   * 
   * @param type 
   * @param callbackOrArray 
   * @param callback 
   */
  clear(type, callbackOrArray, callback) {
    switch (type) {
      case 'LOCAL': {
        let localKeys: (string | LOCALSTORAGE)[] = Object.keys(window.localStorage)

        if (Array.isArray(callbackOrArray)) {
          localKeys = localKeys.filter((item: string) => !callbackOrArray.includes(item)
            || !regexpMatcher(localKeys, item))
        }

        localKeys.forEach((key: string) => {
          window.localStorage.removeItem(key)
        })

        break
      }

      case 'SESSION': {
        let sessionKeys: (string | SESSIONSTORAGE)[] = Object.keys(window.sessionStorage)

        if (Array.isArray(callbackOrArray)) {
          sessionKeys = sessionKeys.filter((item: string) => !callbackOrArray.includes(item)
            || !regexpMatcher(sessionKeys, item))
        }

        sessionKeys.forEach((key: string) => {
          window.sessionStorage.removeItem(key)
        })

        break
      }

      default:
        ConsoleLog.debug('CLEAR::NOTHING', '')
    }

    if (
      callbackOrArray
      && typeof callbackOrArray === 'function'
    ) {
      callbackOrArray()
    }

    if (
      callback
      && typeof callback === 'function'
    ) {
      callback()
    }
  }
}

export default Memory
