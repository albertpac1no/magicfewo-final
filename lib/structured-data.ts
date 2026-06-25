import type { Settings } from './settings'
import type { Property } from './types'

const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL || 'https://magicfewo.de'

export function organizationJsonLd(settings: Settings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.platform_name || 'MagicFewo',
    url: siteUrl(),
    ...(settings.logo_light_url && { logo: settings.logo_light_url }),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: settings.company_phone || '',
      email: settings.company_email || '',
      contactType: 'customer service',
      availableLanguage: ['German', 'English'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.company_address || '',
      addressLocality: settings.company_city || '',
      postalCode: settings.company_postal_code || '',
      addressCountry: settings.company_country || 'DE',
    },
  }
}

export function webSiteJsonLd(settings: Settings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings.platform_name || 'MagicFewo',
    url: siteUrl(),
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl()}/properties?location={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function vacationRentalJsonLd(property: Property) {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'VacationRental',
    name: property.title,
    description: property.description,
    image: property.images ?? [],
    url: `${siteUrl()}/properties/${property.id}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.city,
      addressCountry: property.country,
    },
    numberOfBedrooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
    occupancy: {
      '@type': 'QuantitativeValue',
      maxValue: property.max_guests,
    },
    offers: {
      '@type': 'Offer',
      price: property.is_special_offer && property.special_offer_price
        ? property.special_offer_price
        : property.price_per_night,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      unitCode: 'DAY',
    },
  }

  if (property.review_overall_rating != null && property.review_count != null && property.review_count > 0) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: property.review_overall_rating,
      reviewCount: property.review_count,
      bestRating: 5,
      worstRating: 1,
    }
  }

  if (property.amenities && property.amenities.length > 0) {
    jsonLd.amenityFeature = property.amenities.map((amenity) => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity,
      value: true,
    }))
  }

  return jsonLd
}

export function faqPageJsonLd(faqs: Array<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  }
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteUrl()}${item.url}`,
    })),
  }
}
