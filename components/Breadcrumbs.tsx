import { Link } from '@/i18n/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { breadcrumbJsonLd } from '@/lib/structured-data'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export async function Breadcrumbs({ items }: BreadcrumbsProps) {
  const t = await getTranslations('common')
  const allItems = [{ label: t('home'), href: '/' }, ...items]
  const jsonLdItems = allItems.map((item) => ({ name: item.label, url: item.href }))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(jsonLdItems)) }}
      />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center flex-wrap gap-1 text-sm text-gray-500">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1
            return (
              <li key={item.href} className="flex items-center gap-1">
                {index === 0 && <Home className="w-3.5 h-3.5 flex-shrink-0" />}
                {isLast ? (
                  <span className="text-secondary font-medium" aria-current="page">{item.label}</span>
                ) : (
                  <>
                    <Link href={item.href} className="hover:text-primary transition-colors">
                      {item.label}
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                  </>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
