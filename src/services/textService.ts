import type { Language, Difficulty } from '../types'
import { QUOTES, getRandomQuote } from '../data/quotes'
import { getRandomWords } from '../data/wordLists'

const TEXT_BANK: Record<Exclude<Language, 'custom'>, string[]> = {
  english: [
    "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the English alphabet, making it a classic for typing practice.",
    "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles.",
    "All human beings are born free and equal in dignity and rights. They are endowed with reason and conscience and should act towards one another in a spirit of brotherhood.",
    "In the beginning the Universe was created. This has made a lot of people very angry and been widely regarded as a bad move.",
    "The only people for me are the mad ones, the ones who are mad to live, mad to talk, mad to be saved, desirous of everything at the same time.",
    "The future belongs to those who continuously learn and adapt. Technology changes rapidly, and the ability to acquire new skills has become one of the most valuable assets in the modern workplace.",

"Success is rarely achieved overnight. It is the result of consistent effort, disciplined habits, and the willingness to overcome challenges that appear along the journey.",

"Reading books expands knowledge, improves vocabulary, and encourages critical thinking. Even a few pages a day can create a lasting impact on personal growth and development.",

"Effective communication is one of the most important skills in both personal and professional life. Listening carefully and expressing ideas clearly helps build trust and strong relationships.",

"The internet has transformed the way people access information, communicate with others, and conduct business. It has connected the world in ways that were once unimaginable.",

"A healthy lifestyle involves regular exercise, balanced nutrition, sufficient sleep, and stress management. Small daily habits often produce greater results than drastic short-term changes.",

"Software development requires creativity, logical thinking, and attention to detail. Developers solve complex problems by breaking them into smaller, manageable tasks and implementing practical solutions.",

"Teamwork allows individuals with different skills and experiences to achieve common goals. Collaboration encourages innovation and often leads to better outcomes than working alone.",

"Artificial intelligence is changing industries across the globe. From healthcare and education to transportation and finance, AI technologies continue to create new opportunities and challenges.",

"Traveling provides opportunities to experience different cultures, meet new people, and gain fresh perspectives. Every journey offers lessons that cannot be learned from books alone.",

"Customer satisfaction is the foundation of a successful business. Companies that consistently deliver value and excellent service are more likely to earn loyalty and long-term growth.",

"Time management is the practice of organizing tasks and priorities effectively. By focusing on important activities and minimizing distractions, people can achieve more in less time.",

"Cloud computing enables businesses to access powerful computing resources without maintaining expensive infrastructure. This flexibility has accelerated digital transformation worldwide.",

"Learning a new language opens doors to different cultures and opportunities. It improves cognitive abilities and helps people connect with others from diverse backgrounds.",

"Cybersecurity has become increasingly important as more personal and business activities move online. Protecting sensitive information requires awareness, strong security practices, and modern technologies."
  ],
  khmer: [
    "ប្រទេសកម្ពុជាមានប្រវត្តិសាស្ត្រដ៏យូរអង្វែង និងសម្បូរបែបវប្បធម៌។",
    "អង្គរវត្តគឺជាប្រាសាទបុរាណដ៏ល្បីល្បាញនៅកម្ពុជា ដែលទាក់ទាញភ្ញៀវទេសចរមកពីទូទាំងពិភពលោក។",
    "ភាសាខ្មែរជាភាសាផ្លូវការរបស់កម្ពុជា មានអក្ខរក្រមផ្ទាល់ខ្លួនប្លែកពីគេ។",
    "ការអប់រំគឺជាគន្លឹះសម្រាប់ការអភិវឌ្ឍន៍បុគ្គល និងសង្គម។ ការសិក្សាជាបន្តបន្ទាប់ជួយឱ្យមនុស្សទទួលបានចំណេះដឹងថ្មី និងឱកាសកាន់តែច្រើន។",

"បច្ចេកវិទ្យាបានផ្លាស់ប្តូររបៀបរស់នៅ និងការងាររបស់មនុស្សជាច្រើន។ ការប្រើប្រាស់ឧបករណ៍ឌីជីថលបានធ្វើឱ្យការទំនាក់ទំនង និងការចែករំលែកព័ត៌មានកាន់តែងាយស្រួល។",

"ការគ្រប់គ្រងពេលវេលាបានល្អអាចជួយបង្កើនផលិតភាព និងកាត់បន្ថយសម្ពាធការងារ។ ការកំណត់អាទិភាពគឺជាជំហានសំខាន់មួយក្នុងការសម្រេចគោលដៅ។",

"សុខភាពល្អកើតចេញពីការហាត់ប្រាណទៀងទាត់ ការទទួលទានអាហារដែលមានតុល្យភាព និងការសម្រាកគ្រប់គ្រាន់។ ទម្លាប់ល្អប្រចាំថ្ងៃអាចផ្តល់អត្ថប្រយោជន៍រយៈពេលវែង។",

"ប្រទេសកម្ពុជាមានធនធានវប្បធម៌ និងប្រវត្តិសាស្ត្រដ៏សម្បូរបែប។ ប្រាសាទបុរាណ និងទំនៀមទម្លាប់ជាច្រើនបានទាក់ទាញភ្ញៀវទេសចរពីជុំវិញពិភពលោក។",

"ការធ្វើការជាក្រុមជួយឱ្យសមាជិកអាចចែករំលែកចំណេះដឹង និងបទពិសោធន៍។ ការសហការល្អអាចនាំឱ្យមានការច្នៃប្រឌិត និងលទ្ធផលកាន់តែប្រសើរ។",

"អាជីវកម្មដែលផ្តោតលើការពេញចិត្តរបស់អតិថិជនមានឱកាសជោគជ័យខ្ពស់ជាង។ សេវាកម្មល្អ និងផលិតផលមានគុណភាពជួយបង្កើតភាពស្មោះត្រង់របស់អតិថិជន។",

"ការអានសៀវភៅជាប្រចាំអាចជួយពង្រីកចំណេះដឹង និងបង្កើនសមត្ថភាពគិតវិភាគ។ វាក៏ជួយបង្កើនវាក្យសព្ទ និងការយល់ដឹងអំពីពិភពលោកផងដែរ។",

"ការអភិវឌ្ឍកម្មវិធីកុំព្យូទ័រតម្រូវឱ្យមានការគិតឡូជីខល និងការដោះស្រាយបញ្ហាប្រកបដោយប្រសិទ្ធភាព។ អ្នកអភិវឌ្ឍន៍ត្រូវរៀនបច្ចេកវិទ្យាថ្មីៗជានិច្ច។",

"បញ្ញាសិប្បនិម្មិតកំពុងក្លាយជាផ្នែកសំខាន់មួយនៃជីវិតប្រចាំថ្ងៃ។ វាត្រូវបានប្រើប្រាស់ក្នុងវិស័យជាច្រើនដើម្បីបង្កើនប្រសិទ្ធភាព និងភាពងាយស្រួល។"
  ]
}

export const getRandomText = (lang: Exclude<Language, 'custom'>): string => {
  const texts = TEXT_BANK[lang]
  return texts[Math.floor(Math.random() * texts.length)]
}

export const generateZenText = (difficulty: Difficulty): string => {
  const words = getRandomWords(difficulty, 200)
  return words.join(' ').slice(0, 1000)
}

export const validateCustomText = (text: string): {
  valid: boolean
  wordCount: number
  characterCount: number
  hasPunctuation: boolean
  hasNumbers: boolean
  hasSpecialChars: boolean
  issues: string[]
} => {
  const trimmed = text.trim()
  const issues: string[] = []

  if (trimmed.length < 10) {
    issues.push('Text must be at least 10 characters long')
  }

  const wordCount = trimmed.split(/\s+/).length
  if (wordCount < 3) {
    issues.push('Text must contain at least 3 words')
  }

  const hasPunctuation = /[.,!?;:]/.test(trimmed)
  const hasNumbers = /\d/.test(trimmed)
  const hasSpecialChars = /[^a-zA-Z0-9\s.,!?;:]/.test(trimmed)

  return {
    valid: issues.length === 0,
    wordCount,
    characterCount: trimmed.length,
    hasPunctuation,
    hasNumbers,
    hasSpecialChars,
    issues
  }
}

export const getQuoteText = (id?: string): { text: string; author: string; source: string } => {
  if (id) {
    const quote = QUOTES.find(q => q.id === id)
    if (quote) {
      return { text: quote.text, author: quote.author, source: quote.source }
    }
  }
  const quote = getRandomQuote()
  return { text: quote.text, author: quote.author, source: quote.source }
}

export const getAllQuotes = () => QUOTES