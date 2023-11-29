import { PhraseOptions } from '../types'
import { defaultValues } from '../constants/defaultValues'

/**
 * Returns formatted CloudSearch phrase with fuzzy matching. Matches all documents if phrase is empty.
 *
 * @param {string} phrase - Phrase to search for
 * @param {PhraseOptions} options - Phrase options with default values
 * @returns {string} - Formatted phrase for CloudSearch
 */
export const processPhrase = (
  phrase?: string,
  {
    fuzzyLetters = defaultValues.fuzzyLetters,
    fuzzyLevel = defaultValues.fuzzyLevel,
    proximity = defaultValues.proximity,
  }: PhraseOptions = {},
): string => {
  if (!phrase) return '*:*'

  phrase = phrase.trim()
  let words = phrase.split(/\s+/)

  // Single word - apply fuzzy search or append wildcard
  if (words.length === 1) return `"${words[0]}"*`

  // Multiple words - apply fuzzy and proximity search
  words = words.map((word) => {
    return word.length >= fuzzyLetters ? `${word}~${fuzzyLevel}` : word
  })

  return `"${words.join(' ')}"~${proximity}`
}
