import take from 'lodash.takeright'
import { readFileSync } from 'fs'

const firstNamesJson = JSON.parse(
  readFileSync('src/utils/firstNames.json').toString('utf8')
)
const lastNamesJson = JSON.parse(
  readFileSync('src/utils/lastNames.json').toString('utf8')
)

export const datamine = (chars: string[]) => {
  const stringistä = take(chars, 20).join('')
  console.log('scraping', stringistä)
  let goldista = []
  const firstNames = Object.keys(firstNamesJson)
  const lastNames = Object.keys(lastNamesJson)

  firstNames.forEach(firstName => {
    if (stringistä.toLowerCase().includes(firstName.toLowerCase())) {
      goldista.push({ type: 'firstName', value: firstName })
    }
  })
  lastNames.forEach(lastName => {
    if (stringistä.toLowerCase().includes(lastName.toLowerCase())) {
      goldista.push({ type: 'lastNames', value: lastName })
    }
  })
  const email = stringistä.match(
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g
  )
  if (email) {
    email.forEach(e => {
      goldista.push({ type: 'email', value: e })
    })
  }

  const cc = stringistä.match(
    /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/g
  )
  if (cc) {
    cc.forEach(c => {
      goldista.push({ type: 'creditCard', value: c })
    })
  }

  return goldista
}
