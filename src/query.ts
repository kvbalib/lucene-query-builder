import { processPhrase } from './functions/processPhrase'
import { processTerms } from './functions/processTerms'
import { QueryParams } from './types'
import { processDates } from './functions/processDates'

/**
 * Constructs a query string based on the provided options.
 */
export const query = ({
  phrase = '',
  and = [],
  not = [],
  dates,
  options = {},
}: Partial<QueryParams> = {}) => {
  const { fuzzyLetters, fuzzyLevel, urlEncoded } = options

  const phraseQuery = processPhrase(phrase, { fuzzyLetters, fuzzyLevel })
  const andQuery = processTerms(and, 'AND')
  const notQuery = processTerms(not, 'NOT')
  const dateQuery = dates ? processDates(dates) : ''

  const result = [phraseQuery, andQuery, notQuery, dateQuery].filter(Boolean).join(' ')
  return urlEncoded ? encodeURIComponent(result) : result
}
