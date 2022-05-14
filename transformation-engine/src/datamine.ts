import take from 'lodash.takeright'
import { readFileSync } from 'fs'
import { Trie } from '@datastructures-js/trie'
import { addMatching, getItem } from './context-store'

const firstNames = Trie.fromArray(
  JSON.parse(readFileSync('firstNames.json').toString('utf8'))
)
const lastNames = Trie.fromArray(
  JSON.parse(readFileSync('lastNames.json').toString('utf8'))
)

type DataMineResult = {
  type: 'firstName' | 'lastName' | 'email' | 'creditCard'
  value: string
}

export const datamine = (
  chars: string[],
  sessionId: string
): DataMineResult[] => {
  const stringistä = take(chars, 20).join('')

  let matchingLastnameValue = `${
    getItem(sessionId)['lastNameMatchingValue'] ?? ''
  }${chars.pop()}`
  let goldista = []
  const matchingLastname = lastNames.find(matchingLastnameValue)
  try {
    if (
      !matchingLastname &&
      lastNames
        .find(
          matchingLastnameValue.substring(0, matchingLastnameValue.length - 1)
        )
        .childrenCount() === 0
    ) {
      matchingLastnameValue = undefined
    }
  } catch (e) {
    matchingLastnameValue = undefined
  }
  if (matchingLastname?.isEndOfWord() && matchingLastnameValue.length > 3) {
    goldista.push({ type: 'lastName', value: matchingLastnameValue })
  }

  addMatching(sessionId, matchingLastnameValue)

  const email = stringistä.match(
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g
  )
  if (email && email.length > 0) {
    email.forEach(e => {
      goldista.push({ type: 'email', value: e })
    })
  }

  const cc = stringistä.match(
    /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/g
  )
  if (cc && cc[0].length === 16) {
    goldista.push({ type: 'creditCard', value: cc[0] })
  }

  return goldista
}
