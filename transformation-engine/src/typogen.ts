import sample from 'lodash.samplesize'
import { typos } from './utils/shit'

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
