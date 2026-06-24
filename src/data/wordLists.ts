import type { Difficulty } from '../types'

export const WORD_LISTS: Record<Difficulty, string[]> = {
  beginner: [
    'cat', 'dog', 'sun', 'run', 'big', 'red', 'hat', 'cup', 'pen', 'map',
    'book', 'fish', 'tree', 'star', 'moon', 'bird', 'frog', 'lion', 'bear', 'wolf',
    'apple', 'happy', 'smile', 'light', 'water', 'house', 'friend', 'love', 'hope', 'peace',
    'music', 'dance', 'dream', 'heart', 'mind', 'soul', 'beauty', 'grace', 'truth', 'kind'
  ],
  intermediate: [
    'beautiful', 'wonderful', 'amazing', 'exciting', 'powerful', 'creative', 'freedom',
    'courage', 'strength', 'wisdom', 'compassion', 'gratitude', 'serendipity',
    'community', 'belonging', 'authentic', 'vulnerable', 'resilience', 'curiosity',
    'discovery', 'adventure', 'exploration', 'imagination', 'inspiration',
    'communication', 'connection', 'understanding', 'perspective', 'expression',
    'appreciation', 'transformation', 'empowerment', 'mindfulness', 'connection'
  ],
  advanced: [
    'sophisticated', 'unprecedented', 'extraordinary', 'supercalifragilistic',
    'antidisestablishmentarianism', 'floccinaucinihilipilification',
    'pneumonoultramicroscopicsilicovolcanoconiosis',
    'hippopotomonstrosesquipedaliophobia',
    'supercalifragilisticexpialidocious',
    'psychoneuroendocrinology', 'radioimmunoelectrophoresis',
    'counterproductiveness', 'electroencephalograph', 'inconsequential',
    'internationalization', 'underwhelming', 'neuroplasticity',
    'interdisciplinary', 'multidimensional', 'anthropomorphism',
    'uncharacteristically', 'disproportionately', 'incomprehensible',
    'ultramicroscopic', 'psychopharmacology', 'environmentalist'
  ],
  expert: [
    'antidisestablishmentarianism', 'floccinaucinihilipilification',
    'pneumonoultramicroscopicsilicovolcanoconiosis',
    'supercalifragilisticexpialidocious', 'hippopotomonstrosesquipedaliophobia',
    'electroencephalographically', 'psychoneuroimmunology',
    'radiopharmaceutical', 'chemiluminescence', 'thermodynamics',
    'electromyography', 'neuroanatomy', 'immunohistochemistry',
    'chromatography', 'spectrophotometry', 'electrophoresis',
    'crystallography', 'polarography', 'amperometry', 'potentiometry'
  ]
}

export const getWordList = (difficulty: Difficulty): string[] => {
  return WORD_LISTS[difficulty]
}

export const getRandomWords = (difficulty: Difficulty, count: number): string[] => {
  const list = getWordList(difficulty)
  const shuffled = [...list].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export const getWordCountOptions = [10, 25, 50, 100] as const