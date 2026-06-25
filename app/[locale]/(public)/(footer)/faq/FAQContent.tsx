'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'

const faqs = [
  {
    category: 'Buchung',
    questions: [
      { q: 'Wie kann ich eine Reise buchen?', a: 'Sie können Ihre Reise einfach online über unsere Website buchen. Wählen Sie Ihr gewünschtes Reiseziel, prüfen Sie die Verfügbarkeit und folgen Sie dem Buchungsprozess.' },
      { q: 'Kann ich meine Buchung stornieren?', a: 'Ja, Buchungen können unter Berücksichtigung unserer Stornierungsbedingungen storniert werden. Die genauen Bedingungen finden Sie in Ihren Buchungsunterlagen.' },
    ],
  },
  {
    category: 'Zahlung',
    questions: [
      { q: 'Welche Zahlungsmethoden werden akzeptiert?', a: 'Wir akzeptieren Kreditkarten (Visa, Mastercard, American Express), PayPal und Banküberweisung.' },
      { q: 'Wann muss ich die Reise bezahlen?', a: 'Bei Buchung ist eine Anzahlung von 20% des Reisepreises fällig. Der Restbetrag muss spätestens 30 Tage vor Reiseantritt bezahlt werden.' },
    ],
  },
  {
    category: 'Reisedetails',
    questions: [
      { q: 'Was ist im Reisepreis enthalten?', a: 'Der genaue Leistungsumfang variiert je nach Angebot und ist in der jeweiligen Reisebeschreibung aufgeführt. Grundsätzlich sind Unterkunft und aufgeführte Aktivitäten inklusive.' },
      { q: 'Brauche ich eine Reiseversicherung?', a: 'Wir empfehlen den Abschluss einer Reiseversicherung. Diese kann optional bei der Buchung hinzugefügt werden.' },
    ],
  },
]

export function FAQContent() {
  const [activeCategory, setActiveCategory] = useState('Buchung')
  const [searchTerm, setSearchTerm] = useState('')
  const [openQuestions, setOpenQuestions] = useState<string[]>([])

  const toggleQuestion = (id: string) => {
    setOpenQuestions((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const filteredFaqs = faqs
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
        <h1 className="text-4xl font-bold text-secondary mb-4">Häufig gestellte Fragen</h1>
        <p className="text-gray-custom mb-8 max-w-2xl">
          Finden Sie schnell Antworten auf Ihre Fragen. Falls Sie weitere Unterstützung benötigen,
          kontaktieren Sie uns gerne.
        </p>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Suchen Sie nach Fragen..."
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="flex space-x-4 mb-8">
          {faqs.map((category) => (
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
          <h2 className="text-2xl font-bold text-secondary mb-4">Keine Antwort gefunden?</h2>
          <p className="text-gray-custom mb-6">
            Unser Kundenservice-Team steht Ihnen für weitere Fragen zur Verfügung.
          </p>
          <Link href="/kontakt" className="btn-primary">Kontakt aufnehmen</Link>
        </div>
      </div>
    </div>
  )
}
