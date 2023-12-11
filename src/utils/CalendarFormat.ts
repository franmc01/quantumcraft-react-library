import Memory from './Memory'

export interface InitialBankInfo {
  overrideDateFormat: boolean,
  defaultLocale: string,
}

interface Formats {
  [key: string]: string
}

const REACT_DATEPICKER_FORMAT = {
  es: 'dd/MM/yyyy',
  en: 'MM/dd/yyyy',
  pt: 'dd-MM-yyyy',
  fr: 'dd/MM/yyyy'
}

const FORMAT_DATES = {
  en: 'mm/dd/yy',
  es: 'dd/mm/yy',
  pt: 'dd-mm-yy',
  fr: 'dd/mm/yy'
}

export type CalendarFormat = {
  (initialBankInfo: InitialBankInfo, isReactDatepicker?: boolean): string
}

/**
 * Get date format
 * @param {Formats} formats - An object containing locale-specific date format strings
 * @param {string} locale - The locale for which to retrieve the date format
 * @returns {string} The date format string for the specified locale
 */
const getDateFormat = (formats: Formats, locale: string): string => formats[locale] || formats.en

/**
 * Calendar Format Function
 * 
 * This function generates a date format string for calendar
 * dates based on the provided configuration.
 * 
 * @param {InitialBankInfo} initialBankInfo - The initial configuration for date formatting
 * @param {boolean} [isReactDatepicker=false] - A flag indicating whether the datepicker.
 * @returns {string} The date format string for the calendar
 * 
 * @example
 * // Example usage
 * const initialBankInfo = {
 *   overrideDateFormat: true,
 *   defaultLocale: 'en'
 * }
 * const dateFormat = calendarFormat(initialBankInfo, true) // Format for Calendar in English locale
 * console.log(dateFormat) // 'MM/dd/yyyy'
 */
const calendarFormat: CalendarFormat = (
  initialBankInfo: InitialBankInfo = { overrideDateFormat: false, defaultLocale: 'en' },
  isReactDatepicker: boolean = false
): string => {
  const { overrideDateFormat, defaultLocale } = initialBankInfo

  const language = Memory.get('LANGUAGE')?.toLowerCase() || 'en'
  const formats = isReactDatepicker ? REACT_DATEPICKER_FORMAT : FORMAT_DATES

  return overrideDateFormat 
    ? getDateFormat(formats, defaultLocale)
    : getDateFormat(formats, language)
}

export default calendarFormat
