import type { Language, Difficulty } from '../types'
import { QUOTES, getRandomQuote } from '../data/quotes'
import { getRandomWords } from '../data/wordLists'

const TEXT_BANK: Record<Exclude<Language, 'custom'>, string[]> = {
  english: [
    "MISSION, We offer high-quality products and services that solve core infrastructure problems for our customers.",
    "VISION, To make permanent, compounding positive changes to the lives of the people where we operate our business.",
    "THE DREAM, A vibrant international enterprise combining exceptional talent across cultures creating infrastructure that permanently elevates human quality of life.",
    "To attract, develop, and retain talented people who drive our company’s growth and success.",
    "We serve with care, manage with system, and support with heart.",
    "To drive business growth through bold creativity, smart digital engagement, and marketing innovation that sets new benchmarks in our industry.",
    "To be the knowledge hub of the company by deeply understanding every product, educating our customers, and empowering our teams with the right insights to succeed.",
    "To be the final touchpoint that leaves a lasting impression, ensuring each delivery reflects our dedication to care, quality, and customer satisfaction.",
    "We listen first, solve fast, and offer products/services that solve clients problems.",
    "To manage and maintain inventory with accuracy, efficiency, and accountability.",
    "Our mission is to bring ideas to life with speed, style, and storytelling that inspires.",
    "To provide a seamless, personalized, and exceptional service experience that reflects the premium quality of our brand and exceeds the expectations of every valued customer.",
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

"Cybersecurity has become increasingly important as more personal and business activities move online. Protecting sensitive information requires awareness, strong security practices, and modern technologies.",

"Customer service is an important part of every successful company. Employees should communicate clearly, solve problems efficiently, and work together as a team. Good communication helps build trust with customers and creates a positive working environment. Every staff member should take responsibility for their tasks, respect company policies, and continuously improve their skills through learning and practice."
  ],
  khmer: [
    "ផ្នែកធនធានមនុស្ស៖ ដើម្បីទាក់ទាញ អភិវឌ្ឈ និងរក្សាទុកបុគ្គលិកដែលមានសមត្ថភាព ដើម្បីជំរុញភាពរីកចំរើន និងជោគជ័យរបស់ក្រុមហ៊ុន។ ",
    "ផ្នែករដ្ឋបាល៖ យើងបម្រើដោយការយកចិត្តទុកដាក់ គ្រប់គ្រងដោយប្រព័ន្ធ និងគាំទ្រដោយបេះដូង។",
    "ផ្នែកទីផ្សារ៖ ដើម្បីជំរុញអាជីវកម្មឲ្យរីកចម្រើន តាមរយៈសិល្បៈនៃការច្នៃប្រឌិតដ៏មានឥទ្ធិពល ជាមួយការចូលរួមក្នុងឌីជីជលដ៏ឆ្លាតវៃ និងការច្នៃប្រឌិតផ្នែកទីផ្សារ ដែលបង្កើតស្តង់ដាថ្មីក្នុងវិស័យការងាររបស់យើង។",
    "ជាបណ្តុំចំណេះដឹងរបស់ក្រុមហ៊ុន ដោយយល់ដឹងស៊ីជំរៅអំពីផលិតផលទាំងអស់ ផ្តល់កាណែនំាប្រឹក្សាដល់អតិថិជន និងបង្កើនសមត្ថភាពក្រុមការងាររបស់យើងជាមួយនឹងចំណេះដឹងត្រឹមត្រូវដើម្បីទទួលបានជោគជ័យ។",
    "ដើម្បីជាការបញ្ចប់ការងារ ដែលផ្ដល់អារម្មណ៍ល្អចំពោះអតិថិជន ដោយធានាថាការដឹកជញ្ជូននីមួយៗបង្ហាញពីការយកចិត្តទុកដាក់ ប្រុងប្រយ័ត្នពីគុណភាពលើផលិតផល និងការពេញចិត្តរបស់អតិថិជន។",
    "យើងស្តាប់ជាមុនសិន បន្ទាប់មកដោះស្រាយយ៉ាងរហ័ស និងផ្ដល់នូវផលិតផល/សេវាកម្មដែលដោះស្រាយបញ្ហារបស់អតិថិជន។",
    "ដើម្បីគ្រប់គ្រងនិងរក្សាសារពើភ័ណ្ឌ គឺគ្រប់គ្រងយ៉ាងសកម្ម និងទ្រទ្រង់បរិមាណត្រឹមត្រូវនៃស្ដុក(ផលិតផល និងសម្ភារៈ) ជាមួយនឹងភាពត្រឹមត្រូវ ប្រសិទ្ធភាព និង ការទទួលខុសត្រូវ។",
    "បេសកកម្មរបស់យើងគឺដើម្បីពាំនាំគំនិតឲ្យក្លាយទៅជាការពិត ដោយភាពរហ័ស មានបច្ចេកទេស និងរឿងរ៉ាវដែលបំផុសគំនិតល្អៗ។",
    "ផ្តល់ជូនបទពិសោធន៍សេវាកម្មដ៏រលូន ភាពផ្ទាល់ខ្លួន និងល្អឥតខ្ចោះដែលឆ្លុះបង្ហាញពីគុណភាពស្តង់ដារកម្រិតខ្ពស់នៃកេរ្តិ៍ឈ្មោះក្រុមហ៊ុនរបស់យើង និងលើសពីការរំពឹងទុករបស់អតិថិជនគ្រប់រូប។",
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

"បញ្ញាសិប្បនិម្មិតកំពុងក្លាយជាផ្នែកសំខាន់មួយនៃជីវិតប្រចាំថ្ងៃ។ វាត្រូវបានប្រើប្រាស់ក្នុងវិស័យជាច្រើនដើម្បីបង្កើនប្រសិទ្ធភាព និងភាពងាយស្រួល។",

"ការផ្តល់សេវាកម្មល្អគឺជាកត្តាសំខាន់សម្រាប់ភាពជោគជ័យរបស់ក្រុមហ៊ុន។ បុគ្គលិកគួរតែមានការទំនាក់ទំនងល្អ ដោះស្រាយបញ្ហាប្រកបដោយប្រសិទ្ធភាព និងសហការគ្នាជាក្រុម។ ការទទួលខុសត្រូវចំពោះការងារ ការគោរព វិន័យការងារ និងការបន្តអភិវឌ្ឍជំនាញរបស់ខ្លួន នឹងជួយបង្កើនគុណភាពការងារ និងលទ្ធផលរបស់អង្គភាព។"
  ],
  mixed: [
    "Customer service is an important part of every successful company. Employees should communicate clearly, solve problems efficiently, and work together as a team. Good communication helps build trust with customers and creates a positive working environment. Every staff member should take responsibility for their tasks, respect company policies, and continuously improve their skills through learning and practice. ការផ្តល់សេវាកម្មល្អគឺជាកត្តាសំខាន់សម្រាប់ភាពជោគជ័យរបស់ក្រុមហ៊ុន។ បុគ្គលិកគួរតែមានការទំនាក់ទំនងល្អ ដោះស្រាយបញ្ហាប្រកបដោយប្រសិទ្ធភាព និងសហការគ្នាជាក្រុម។ ការទទួលខុសត្រូវចំពោះការងារ ការគោរព វិន័យការងារ និងការបន្តអភិវឌ្ឍជំនាញរបស់ខ្លួន នឹងជួយបង្កើនគុណភាពការងារ និងលទ្ធផលរបស់អង្គភាព។",
    "Success is rarely achieved overnight. It is the result of consistent effort. ការអប់រំគឺជាគន្លឹះសម្រាប់ការអភិវឌ្ឍន៍បុគ្គល និងសង្គម។ ការសិក្សាជាបន្តបន្ទាប់ជួយឱ្យមនុស្សទទួលបានចំណេះដឹងថ្មី។",
    "The future belongs to those who continuously learn and adapt. បច្ចេកវិទ្យាបានផ្លាស់ប្តូររបៀបរស់នៅ និងការងាររបស់មនុស្សជាច្រើន។ ការប្រើប្រាស់ឧបករណ៍ឌីជីថលបានធ្វើឱ្យការទំនាក់ទំនងកាន់តែងាយស្រួល។",
    "Reading books expands knowledge, improves vocabulary, and encourages critical thinking. ការអានសៀវភៅជាប្រចាំអាចជួយពង្រីកចំណេះដឹង និងបង្កើនសមត្ថភាពគិតវិភាគ។",
    "Effective communication is one of the most important skills in both personal and professional life. ការធ្វើការជាក្រុមជួយឱ្យសមាជិកអាចចែករំលែកចំណេះដឹង និងបទពិសោធន៍។",
    "Software development requires creativity, logical thinking, and attention to detail. ការអភិវឌ្ឍកម្មវិធីកុំព្យូទ័រតម្រូវឱ្យមានការគិតឡូជីខល និងការដោះស្រាយបញ្ហាប្រកបដោយប្រសិទ្ធភាព។",
    "Traveling provides opportunities to experience different cultures, meet new people, and gain fresh perspectives. ប្រទេសកម្ពុជាមានធនធានវប្បធម៌ និងប្រវត្តិសាស្ត្រដ៏សម្បូរបែប។"
  ]
}

export const getRandomText = (lang: Exclude<Language, 'custom'>): string => {
  const texts = TEXT_BANK[lang]
  return texts[Math.floor(Math.random() * texts.length)]
}

/** Returns all practice paragraphs for the given language. */
export const getPracticeTexts = (lang: 'english' | 'khmer' | 'mixed'): string[] => {
  return TEXT_BANK[lang]
}

/** Returns a single paragraph by index (safely clamped). */
export const getPracticeText = (lang: 'english' | 'khmer' | 'mixed', index: number): string => {
  const texts = TEXT_BANK[lang]
  const clamped = Math.max(0, Math.min(index, texts.length - 1))
  return texts[clamped]
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