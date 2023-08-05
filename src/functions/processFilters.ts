import { Filter } from '../types'

/**
 * Processes an array of filters to produce a Lucene-style filter query string.
 *
 * @param {Filter[]} filters - An array of filter objects.
 * @returns {string | undefined} - A Lucene-style filter query string or undefined if there are no valid filters.
 *
 * @example
 * const filterQuery = processFilters([{ type: ['artist', 'rundate'] }]);
 * // Returns: "(and (or (term field=type 'artist') (term field=type 'rundate')))"
 */
export function processFilters(filters: Filter[]): string {
  if (!filters || !filters?.length) return ''

  let fq: string[] = []

  for (let filter of filters) {
    for (let key in filter) {
      let value = filter[key]

      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          let orTerms = value.map((v) => `(term field=${key} '${v}')`)
          fq.push(`(or ${orTerms.join(' ')})`)
        } else {
          fq.push(`(term field=${key} '${value}')`)
        }
      }
    }
  }

  return fq.length ? `(and ${fq.join(' ')})` : ''
}
