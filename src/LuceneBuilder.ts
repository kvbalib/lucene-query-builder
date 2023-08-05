import { processPhrase } from './functions/processPhrase'
import { processTerms } from './functions/processTerms'
import { Filter, Options, QueryParams } from './types'
import { processFilters } from './functions/processFilters'

/**
 * This class is used to build query strings for Lucene.
 */
export class LuceneBuilder {
  private readonly options: Options

  /**
   * Creates an instance of QueryBuilder.
   *
   * @param {Options} [options={}] - Optional options to configure the QueryBuilder.
   */
  constructor(options: Options = {}) {
    const defaultOptions: Options = {
      fuzzyLetters: 5,
      fuzzyLevel: 1,
      urlEncoded: false,
    }

    this.options = { ...defaultOptions, ...options }
  }

  /**
   * Builds a query string based on the provided parameters.
   *
   * @param {Object} params - The parameters to build the query string.
   * @param {string} params.phrase - The phrase to search for. Default is an empty string.
   * @param {QueryTerm[]} params.and - Array of terms to be included in the query. Each term is an object with the field names as keys and the corresponding values. Default is an empty array.
   * @param {QueryTerm[]} params.not - Array of terms to be excluded from the query. Each term is an object with the field names as keys and the corresponding values. Default is an empty array.
   * @return {string} The built query string.
   */
  query({ phrase = '', and = [], not = [] }: Omit<QueryParams, 'options'>) {
    const { fuzzyLetters, fuzzyLevel, urlEncoded } = this.options

    const phraseQuery = processPhrase(phrase, { fuzzyLetters, fuzzyLevel })
    const andQuery = processTerms(and, 'AND')
    const notQuery = processTerms(not, 'NOT')

    const result = [phraseQuery, andQuery, notQuery].filter(Boolean).join(' ')
    return urlEncoded ? encodeURIComponent(result) : result
  }

  /**
   * Constructs a filter query (fq) string based on the provided filters.
   * @param filters
   */
  fq(filters?: Filter[] | null) {
    if (!filters || !filters.length) return ''

    return processFilters(filters)
  }
}
