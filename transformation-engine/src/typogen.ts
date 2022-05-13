import sample from 'lodash.samplesize'

const typos = {
  a: 'qwsz',
  b: 'vghn',
  c: 'xdfv',
  d: 'serfcx',
  e: 'wsdfr',
  f: 'dcvgtr',
  g: 'fvbhyt',
  h: 'gbnjuy',
  i: 'ujko',
  j: 'hnmkiu',
  k: 'jmloi',
  l: 'mkop',
  m: 'njkl',
  n: 'bhjm',
  o: 'iklp',
  p: 'ol',
  q: 'wa',
  r: 'edft',
  s: 'wazxde',
  t: 'rfgy',
  u: 'yhji',
  v: 'cfgb',
  w: 'qase',
  x: 'zsdc',
  y: 'tghu',
  z: 'asx',
  ' ': ' ',
}
const CHANCE_OF_TYPO = 0.33

export const generateTypo = (inputChar: string) => {
  if (!(inputChar in typos)) return [inputChar]

  const buzzista = Math.random()
  if (buzzista <= CHANCE_OF_TYPO) {
    const returnableTypo = sample([...typos[inputChar]], sample([1, 2], 1))
    return returnableTypo
  }
  return [inputChar]
}
