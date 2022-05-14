import sample from 'lodash.samplesize'
import { typos } from './utils/shit'

const BASE_CHANCE_OF_TYPO = 0.02
let blursed = 1

export const generateTypo = (inputChar: string) => {
  if (!(inputChar in typos)) return inputChar

  const buzzista = Math.random()
  const CHANCE_OF_TYPO = BASE_CHANCE_OF_TYPO * blursed
  if (buzzista <= 0.1 * CHANCE_OF_TYPO) {
    blursed = 1
    return sample(
      [
        ' vittu ',
        ' saatana ',
        ' perkele ',
        ' kalja ',
        ' beeristä ',
        ' :D ',
        ' xd ',
        ' helvetti ',
      ],
      1
    ).pop()
  }
  if (buzzista <= CHANCE_OF_TYPO) {
    blursed = 1
    const returnableTypo = sample(
      [...new Set([...typos[inputChar]])],
      sample([1, 2], 1).pop()
    )
    return returnableTypo.join('')
  }
  blursed = blursed + 1
  return inputChar
}
