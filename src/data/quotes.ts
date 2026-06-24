import type { Quote, Difficulty } from '../types'

export const QUOTES: Quote[] = [
  // Literature
  {
    id: 'q1',
    text: 'To be, or not to be, that is the question',
    author: 'William Shakespeare',
    source: 'Hamlet',
    length: 42,
    difficulty: 'intermediate',
    tags: ['literature', 'classic', 'shakespeare']
  },
  {
    id: 'q2',
    text: 'It was the best of times, it was the worst of times',
    author: 'Charles Dickens',
    source: 'A Tale of Two Cities',
    length: 53,
    difficulty: 'intermediate',
    tags: ['literature', 'classic', 'dickens']
  },
  {
    id: 'q3',
    text: 'All happy families are alike; each unhappy family is unhappy in its own way',
    author: 'Leo Tolstoy',
    source: 'Anna Karenina',
    length: 76,
    difficulty: 'advanced',
    tags: ['literature', 'classic', 'tolstoy']
  },
  {
    id: 'q4',
    text: 'The only way out of the labyrinth of suffering is to forgive',
    author: 'John Green',
    source: 'Looking for Alaska',
    length: 56,
    difficulty: 'intermediate',
    tags: ['literature', 'modern', 'young-adult']
  },
  {
    id: 'q5',
    text: 'So we beat on, boats against the current, borne back ceaselessly into the past',
    author: 'F. Scott Fitzgerald',
    source: 'The Great Gatsby',
    length: 64,
    difficulty: 'advanced',
    tags: ['literature', 'classic', 'fitzgerald']
  },

  // Philosophy
  {
    id: 'q6',
    text: 'I think, therefore I am',
    author: 'René Descartes',
    source: 'Discourse on Method',
    length: 25,
    difficulty: 'beginner',
    tags: ['philosophy', 'classic', 'descartes']
  },
  {
    id: 'q7',
    text: 'He who has a why to live can bear almost any how',
    author: 'Friedrich Nietzsche',
    source: 'Twilight of the Idols',
    length: 47,
    difficulty: 'intermediate',
    tags: ['philosophy', 'nietzsche']
  },
  {
    id: 'q8',
    text: 'The unexamined life is not worth living',
    author: 'Socrates',
    source: 'Apology',
    length: 36,
    difficulty: 'beginner',
    tags: ['philosophy', 'socrates']
  },
  {
    id: 'q9',
    text: 'Happiness is not something ready made. It comes from your own actions',
    author: 'Dalai Lama',
    source: 'The Art of Happiness',
    length: 70,
    difficulty: 'intermediate',
    tags: ['philosophy', 'buddhism', 'happiness']
  },
  {
    id: 'q10',
    text: 'The only true wisdom is in knowing you know nothing',
    author: 'Socrates',
    source: 'Apology',
    length: 46,
    difficulty: 'intermediate',
    tags: ['philosophy', 'socrates', 'wisdom']
  },

  // Science
  {
    id: 'q11',
    text: 'Imagination is more important than knowledge',
    author: 'Albert Einstein',
    source: 'Interview',
    length: 39,
    difficulty: 'beginner',
    tags: ['science', 'einstein', 'imagination']
  },
  {
    id: 'q12',
    text: 'The cosmos is within us. We are made of star-stuff',
    author: 'Carl Sagan',
    source: 'Cosmos',
    length: 45,
    difficulty: 'intermediate',
    tags: ['science', 'sagan', 'cosmos']
  },
  {
    id: 'q13',
    text: 'The universe is not required to be in perfect harmony with human ambition',
    author: 'Carl Sagan',
    source: 'Pale Blue Dot',
    length: 65,
    difficulty: 'advanced',
    tags: ['science', 'sagan', 'universe']
  },

  // Business & Leadership
  {
    id: 'q14',
    text: 'Innovation distinguishes between a leader and a follower',
    author: 'Steve Jobs',
    source: 'Interview',
    length: 46,
    difficulty: 'intermediate',
    tags: ['business', 'jobs', 'innovation']
  },
  {
    id: 'q15',
    text: 'Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work',
    author: 'Steve Jobs',
    source: 'Stanford Commencement',
    length: 105,
    difficulty: 'advanced',
    tags: ['business', 'jobs', 'leadership']
  },
  {
    id: 'q16',
    text: 'The way to get started is to quit talking and begin doing',
    author: 'Walt Disney',
    source: 'Interview',
    length: 45,
    difficulty: 'intermediate',
    tags: ['business', 'disney', 'action']
  },
  {
    id: 'q17',
    text: 'It is better to fail in originality than to succeed in imitation',
    author: 'Herman Melville',
    source: 'Pierre',
    length: 54,
    difficulty: 'advanced',
    tags: ['business', 'creativity']
  },

  // Motivational
  {
    id: 'q18',
    text: 'The only thing we have to fear is fear itself',
    author: 'Franklin D. Roosevelt',
    source: 'Inaugural Address',
    length: 35,
    difficulty: 'beginner',
    tags: ['motivational', 'roosevelt', 'courage']
  },
  {
    id: 'q19',
    text: 'Darkness cannot drive out darkness; only light can do that. Hate cannot drive out hate; only love can do that',
    author: 'Martin Luther King Jr.',
    source: 'A Testament of Hope',
    length: 86,
    difficulty: 'advanced',
    tags: ['motivational', 'mlk', 'love']
  },
  {
    id: 'q20',
    text: 'Be the change that you wish to see in the world',
    author: 'Mahatma Gandhi',
    source: 'Autobiography',
    length: 42,
    difficulty: 'intermediate',
    tags: ['motivational', 'gandhi', 'change']
  },

  // Add more quotes for 100+ total
  // ... (continuing with more categories)
]

// Categories
export const QUOTE_CATEGORIES = [
  'all',
  'literature',
  'philosophy',
  'science',
  'business',
  'motivational',
  'classic',
  'modern'
]

export const getQuotesByCategory = (category: string): Quote[] => {
  if (category === 'all') return QUOTES
  return QUOTES.filter(quote => quote.tags.includes(category))
}

export const getQuotesByDifficulty = (difficulty: Difficulty): Quote[] => {
  return QUOTES.filter(quote => quote.difficulty === difficulty)
}

export const getRandomQuote = (): Quote => {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)]
}

export const getQuoteById = (id: string): Quote | undefined => {
  return QUOTES.find(quote => quote.id === id)
}