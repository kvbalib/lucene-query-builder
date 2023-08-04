import { processPhrase } from './functions/processPhrase'
import { processTerms } from './functions/processTerms'
import { QueryParams } from './types'

/**
 * Constructs a query string based on the provided options.
 *
 * @param {QueryParams} param0 - The query options.
 * @returns {string} - The constructed query string.
 */
export const query = ({
  phrase = '',
  and = [],
  not = [],
  options = {},
}: Partial<QueryParams> = {}) => {
  const { fuzzyLetters, fuzzyLevel, urlEncoded } = options

  const phraseQuery = processPhrase(phrase, { fuzzyLetters, fuzzyLevel })
  const andQuery = processTerms(and, 'AND')
  const notQuery = processTerms(not, 'NOT')

  const result = [phraseQuery, andQuery, notQuery].filter(Boolean).join(' ')
  return urlEncoded ? encodeURIComponent(result) : result
}
