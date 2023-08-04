import { PhraseOptions } from './functions/processPhrase'

/**
 * Term used in the query. The key is the field name,
 * and the value is the search value, which can be a string, number or an array of those.
 * @interface
 */
export interface QueryTerm {
  [key: string]: string | number | Array<string | number>
}

/**
 * Represents additional options for the query.
 * @interface
 */
export interface Options extends PhraseOptions {
  /** Indicates whether the resulting query should be URL-encoded */
  urlEncoded?: boolean
}

/**
 * Query options.
 * @interface
 */
export interface QueryParams {
  /** The phrase to search for */
  phrase?: string
  /** An array of terms to include in the query, combined using AND */
  and?: QueryTerm[]
  /** An array of terms to exclude from the query, combined using NOT */
  not?: QueryTerm[]
  /** Additional options for the query */
  options?: Partial<Options>
}
