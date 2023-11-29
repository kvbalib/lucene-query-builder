/**
 * Bond used to combine terms in the query.
 */
export type Bond = 'AND' | 'NOT'

/**
 * Term used in the query. The key is the field name,
 * and the value is the search value, which can be a string, number or an array of those.
 * @interface
 */
export interface QueryTerm {
  [key: string]: string | number | Array<string | number>
}

/**
 * Filter used in the query. The key is the field name.
 */
export interface Filter {
  [key: string]: string | number | Array<string | number> | null | undefined
}

/**
 * Date parameters used in the query. The key is the field name. The value can be a Date object,
 * a UTC (Zulu) ISO-8601 string, a tuple of two Date objects or UTC (Zulu) ISO-8601 strings.
 * If a tuple [date, date] is passed, a range query will be created, using 'TO' to bond the two dates.
 * Two properties can be passed - start date field and end date field - to create a range query.
 */
export interface DateParams {
  [key: string]: Date | string | [Date | string | null, Date | string | null] | null
}

export interface PhraseOptions {
  /** Number of letters in a word to start fuzzy matching. */
  fuzzyLetters?: number
  /** Fuzzy matching level. */
  fuzzyLevel?: number
  /** Proximity distance. */
  proximity?: number
}

/**
 * Represents additional options for the query.
 * @interface
 */
export interface Options extends PhraseOptions {
  /** Indicates whether the resulting query should be URL-encoded */
  urlEncoded?: boolean
  /** Indicates whether the resulting date query should be strict (bonded with 'AND') or not (bonded with 'OR'). */
  strictDateRanges?: boolean
}

/**
 * Query options.
 * @interface
 */
export interface Query {
  phrase?: string
  and?: QueryTerm[]
  not?: QueryTerm[]
  dates?: DateParams
  options?: Partial<Options>
}
