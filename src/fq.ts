import { Filter } from './types'
import { processFilters } from './functions/processFilters'

/**
 * Constructs a filter query (fq) string based on the provided filters.
 * @param filters
 */
export const fq = (filters?: Filter[] | null) => {
  if (!filters || !filters.length) return ''

  return processFilters(filters)
}
