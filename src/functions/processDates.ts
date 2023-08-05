import { regExp } from '../constants/regExp'
import { DateParams } from '../types'

/**
 * Check if a string is a valid ISO date format.
 *
 * @param {string} date - The string to check.
 * @returns {boolean} - Returns true if valid ISO date, else false.
 */
const isValidISODate = (date: string): boolean => !isNaN(Date.parse(date))

/**
 * Check if a string is a Zulu date format.
 *
 * @param {string} date - The string to check.
 * @returns {boolean} - Returns true if the date is in Zulu time, else false.
 */
const isZuluDate = (date: string): boolean => regExp.dateZuluISO.test(date)

/**
 * Process an object containing dates and returns a Lucene query string.
 * It accepts Date objects, valid ISO Zulu date strings, and tuples.
 * In case of a tuple, the first value is considered as the start date and the second as the end date.
 * It throws an error if the provided values are not in the expected format.
 *
 * @param {DateParams} dates - The object containing dates.
 * @returns {string} - Returns a Lucene query string.
 * @throws {Error} - Throws an error if the provided values are not in the expected format.
 */
export const processDates = (dates: DateParams): string => {
  if (Object.keys(dates).length > 2) {
    console.warn('Too many properties in dates object. Only up to 2 properties are allowed.')
  }

  const queryParts: string[] = []

  for (let key in dates) {
    const value = dates[key]

    if (value instanceof Date) {
      queryParts.push(`${key}:[${value.toISOString()} TO *]`)
    } else if (typeof value === 'string') {
      if (isValidISODate(value)) {
        if (isZuluDate(value)) {
          queryParts.push(`${key}:[${value} TO *]`)
        } else {
          throw new Error(
            "Date is in ISO format but not in Zulu time (ends with 'Z'). Please convert it to Zulu time.",
          )
        }
      } else {
        throw new Error('Invalid date format. Please provide a valid ISO date string.')
      }
    } else if (Array.isArray(value) && value.length === 2) {
      const [start, end] = value

      const startString =
        start instanceof Date ? start.toISOString() : start ? (start as string) : '*'
      const endString = end instanceof Date ? end.toISOString() : end ? (end as string) : '*'

      if (start && (!isValidISODate(startString) || !isZuluDate(startString))) {
        throw new Error("Start date is invalid or not in Zulu time (ends with 'Z').")
      }
      if (end && (!isValidISODate(endString) || !isZuluDate(endString))) {
        throw new Error("End date is invalid or not in Zulu time (ends with 'Z').")
      }

      queryParts.push(`${key}:[${startString} TO ${endString}]`)
    }
  }

  return queryParts.join(' OR ')
}
