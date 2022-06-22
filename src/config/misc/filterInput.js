/**
 * Filter all user input.
 *
 * @author Daniel Martinez Lara
 * @version 1.0.0
 */

/**
 * Method to filter possible bad input.
 *
 * @param {string} sentence - The sentence to filter.
 * @returns {string} - The filtered input.
 */
export const filter = (sentence) => {
  let filteredSentence
  if (checkBadWords(sentence)) {
    filteredSentence = replaceString(sentence)
  } else {
    filteredSentence = undefined
  }
  return filteredSentence
}

/**
 * Method to replcae possible bad input.
 *
 * @param {string} string - the string to replace characters from.
 * @returns {string} - The replaced string.
 */
const replaceString = (string) => {
  return string.replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * Method to check the input for bad words.
 *
 * @param {string} sentece - the string to replace characters from.
 * @returns {string} - The replaced string.
 */
const checkBadWords = (sentece) => {
  let valid = true
  const bannedWord = ['<script>', '</script>']
  bannedWord.forEach((badWord) => {
    if (sentece.includes(badWord)) {
      valid = false
    }
  })
  return valid
}
