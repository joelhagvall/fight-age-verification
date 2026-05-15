import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { Analytics } from '@vercel/analytics/react'
import { dictionaries, defaultLocale } from '#/i18n'

import appCss from '../styles.css?url'

const THEME_INIT_SCRIPT = `(function(){try{var params=new URLSearchParams(window.location.search);var query=params.get('theme');var stored=window.localStorage.getItem('fight-age-verification:theme:v1')||window.localStorage.getItem('theme');if(stored==='light'||stored==='dark'){window.localStorage.setItem('fight-age-verification:theme:v1',stored);window.localStorage.removeItem('theme')}var resolved=query==='light'||query==='dark'?query:stored==='light'||stored==='dark'?stored:'light';var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);root.setAttribute('data-theme',resolved);root.style.colorScheme=resolved;}catch(e){}})();`
const siteUrl = 'https://fightageverification.com'
const metaTitle = dictionaries[defaultLocale].meta.title
const metaDescription = dictionaries[defaultLocale].meta.description
const metaKeywords = dictionaries[defaultLocale].meta.keywords
const ogImageUrl = `${siteUrl}/og-image.png`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        name: 'theme-color',
        content: '#0a0a0a',
        media: '(prefers-color-scheme: dark)',
      },
      {
        name: 'theme-color',
        content: '#ffffff',
        media: '(prefers-color-scheme: light)',
      },
      {
        name: 'color-scheme',
        content: 'dark light',
      },
      {
        title: metaTitle,
      },
      {
        name: 'description',
        content: metaDescription,
      },
      {
        name: 'keywords',
        content: metaKeywords,
      },
      {
        name: 'robots',
        content: 'index, follow',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:url',
        content: siteUrl,
      },
      {
        property: 'og:site_name',
        content: metaTitle,
      },
      {
        property: 'og:title',
        content: metaTitle,
      },
      {
        property: 'og:description',
        content: metaDescription,
      },
      {
        property: 'og:image',
        content: ogImageUrl,
      },
      {
        property: 'og:image:width',
        content: '1200',
      },
      {
        property: 'og:image:height',
        content: '630',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: metaTitle,
      },
      {
        name: 'twitter:description',
        content: metaDescription,
      },
      {
        name: 'twitter:image',
        content: ogImageUrl,
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        href: '/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
      {
        rel: 'preload',
        href: '/logo-eu-proposal-288.webp',
        as: 'image',
        type: 'image/webp',
      },
      {
        rel: 'canonical',
        href: siteUrl,
      },
      {
        rel: 'alternate',
        hrefLang: 'en',
        href: `${siteUrl}/?lang=en`,
      },
      {
        rel: 'alternate',
        hrefLang: 'sv',
        href: `${siteUrl}/?lang=sv`,
      },
      {
        rel: 'alternate',
        hrefLang: 'x-default',
        href: siteUrl,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang={defaultLocale} className="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Analytics />
        <Scripts />
      </body>
    </html>
  )
}
