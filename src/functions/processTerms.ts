import { Bond, QueryTerm } from '../types'

/**
 * Returns AND joined terms for a Lucene query.
 *
 * @param {QueryTerm[]} terms - Terms to include in the query.
 * @param bond - Bond to join terms with.
 * @returns {string} - AND joined terms.
 */
export const processTerms = (terms: QueryTerm[], bond: Bond): string => {
  if (!terms?.length) return ''

  return (
    `${bond} ` +
    terms
      .map((term: QueryTerm) => {
        const entries = Object.entries(term)

        if (entries.length === 0) return ''

        const [key, value] = entries[0]
        const values = Array.isArray(value) ? value : [value]

        return `(${values.map((val) => `${key}:${val}`).join(' OR ')})`
      })
      .filter(Boolean)
      .join(` ${bond} `)
  )
}
