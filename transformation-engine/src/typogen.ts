import sample from 'lodash.samplesize'
import { typos } from './utils/shit'

const CHANCE_OF_TYPO = 0.2

export const generateTypo = (inputChar: string) => {
  if (!(inputChar in typos)) return inputChar

  const buzzista = Math.random()
  if (buzzista <= 0.1 * CHANCE_OF_TYPO) {
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
    const returnableTypo = sample(
      [...new Set([...typos[inputChar]])],
      sample([1, 2], 1).pop()
    )
    return returnableTypo.join('')
  }
  return inputChar
}
