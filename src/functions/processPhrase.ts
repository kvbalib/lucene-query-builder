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

  const words = phrase.trim().split(/\s+/).map((word, index) => {
    return word.length >= fuzzyLetters ? `${word}~` : word
  })

  return `"${words.join(' ')}"~${proximity}`
}
