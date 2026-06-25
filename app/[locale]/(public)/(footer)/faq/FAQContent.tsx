'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface Question {
  q: string
  a: string
}

interface Category {
  category: string
  questions: Question[]
}

interface FAQContentProps {
  categories: Category[]
}

export function FAQContent({ categories }: FAQContentProps) {
  const t = useTranslations('pages')
  const [activeCategory, setActiveCategory] = useState(categories[0]?.category ?? '')
  const [searchTerm, setSearchTerm] = useState('')
  const [openQuestions, setOpenQuestions] = useState<string[]>([])

  const toggleQuestion = (id: string) => {
    setOpenQuestions((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const filteredFaqs = categories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.a.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0)

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-secondary mb-4">{t('faq.title')}</h1>
        <p className="text-gray-custom mb-8 max-w-2xl">{t('faq.subtitle')}</p>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t('faq.searchPlaceholder')}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="flex space-x-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.category}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category.category
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setActiveCategory(category.category)}
            >
              {category.category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs
            .filter((category) => !activeCategory || category.category === activeCategory)
            .map((category) => (
              <div key={category.category}>
                {category.questions.map((faq, index) => {
                  const id = `${category.category}-${index}`
                  return (
                    <div key={id} className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
                      <button
                        className="w-full px-6 py-4 text-left flex items-center justify-between"
                        onClick={() => toggleQuestion(id)}
                      >
                        <span className="font-medium text-secondary">{faq.q}</span>
                        {openQuestions.includes(id) ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      {openQuestions.includes(id) && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                          <p className="text-gray-600">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-primary/5 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-secondary mb-4">{t('faq.noAnswerTitle')}</h2>
          <p className="text-gray-custom mb-6">{t('faq.noAnswerText')}</p>
          <Link href="/kontakt" className="btn-primary">{t('faq.contactCta')}</Link>
        </div>
      </div>
    </div>
  )
}
