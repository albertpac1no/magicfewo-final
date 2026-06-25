'use client'

import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface BookingStepsProps {
  currentStep: 1 | 2
}

const stepKeys = ['details', 'payment'] as const

export function BookingSteps({ currentStep }: BookingStepsProps) {
  const t = useTranslations('booking')
  return (
    <div className="flex items-center justify-center mb-8">
      {stepKeys.map((key, index) => {
        const stepNum = (index + 1) as 1 | 2
        const isActive = stepNum === currentStep
        const isCompleted = stepNum < currentStep

        return (
          <div key={key} className="flex items-center">
            {index > 0 && (
              <div
                className={`w-12 h-0.5 mx-2 transition-colors ${
                  isCompleted || isActive ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            )}
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  isCompleted
                    ? 'bg-primary text-white'
                    : isActive
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
              </div>
              <span
                className={`text-sm font-medium transition-colors ${
                  isActive || isCompleted ? 'text-primary' : 'text-gray-500'
                }`}
              >
                {t(`steps.${key}`)}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
