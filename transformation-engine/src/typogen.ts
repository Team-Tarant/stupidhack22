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
  1: 'qw§23',
  2: '1wqe34',
  3: '24wer',
  4: 'r34t5',
  5: 't4t54yt',
  6: 'tytu67y5t',
  7: 'uuiu678u',
  8: 'oiu700',
  9: 'oip80i0',
  0: 'p+0å+o',
  '+': 'åp¨åp0',
  ' ': ' ',
}
const CHANCE_OF_TYPO = 0.33

export const generateTypo = (inputChar: string) => {
  if (!(inputChar in typos)) return [inputChar]

  const buzzista = Math.random()
  if (buzzista <= CHANCE_OF_TYPO) {
    const returnableTypo = sample(
      [...new Set([...typos[inputChar]])],
      sample([1, 2], 1)
    )
    return returnableTypo
  }
  return [inputChar]
}
