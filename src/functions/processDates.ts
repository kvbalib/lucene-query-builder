import { DateParams } from '../types'

/**
 * Check if a string is a valid ISO date format.
 *
 * @param {string} date - The string to check.
 * @returns {boolean} - Returns true if valid ISO date, else false.
 */
const isValidISODate = (date: string): boolean => !isNaN(Date.parse(date))

/**
 * Checks if the date is a valid ISO date format and converts Date objects to ISO strings.
 * @param date
 */
const toISOString = (date: Date | string | null): string | null => {
  if (date === null) return null
  if (date instanceof Date) return date.toISOString()
  if (isValidISODate(date)) {
    if (!date.endsWith('Z')) {
      console.warn(`Date is not in Zulu format: ${date}, consider using UTC date instead.`)
    }

    return date
  } else {
    console.error(`Date is not in ISO format: ${date}`)
  }

  return null
}

/**
 * Process an object containing dates and returns a Lucene query string.
 * It accepts Date objects, valid ISO Zulu date strings, and tuples.
 * In case of a tuple, the first value is considered as the start date and the second as the end date.
 * It throws an error if the provided values are not in the expected format.
 *
 * @param {DateParams} dates - The object containing dates.
 * @param strict - Indicates whether the resulting query should be strict (bonded with 'AND') or not (bonded with 'OR').
 * @returns {string} - Returns a Lucene query string.
 * @throws {Error} - Throws an error if the provided values are not in the expected format.
 */
export const processDates = (dates: DateParams, strict?: boolean): string => {
  const queryParts: string[] = [];
  const bond = strict ? ' AND ' : ' OR ';

  for (let key in dates) {
    const value = dates[key];

    if (Array.isArray(value)) {
      const [start, end] = value;
      const startString = start ? toISOString(start) : '*';
      const endString = end ? toISOString(end) : '*';

      queryParts.push(`${key}:[${startString} TO ${endString}]`);
    } else {
      const dateString = toISOString(value);

      if (dateString) {
        queryParts.push(`${key}:[${dateString} TO *]`);
      }
    }
  }

  return queryParts.length ? `AND (${queryParts.join(bond)}) ` : '';
}

