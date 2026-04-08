// apps/storefront/app/[locale]/terminos/page.tsx
import { readFile } from 'fs/promises'
import path from 'path'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getTranslations } from 'next-intl/server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { MARKETS } from '@/lib/markets'
import type { Locale } from '@/i18n/routing'

export default async function TerminosPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('legal')
  const market = MARKETS[locale as Locale]

  let source: string
  try {
    const filePath = path.join(process.cwd(), 'content/legal', locale, 'terminos.mdx')
    source = await readFile(filePath, 'utf-8')
  } catch {
    notFound()
  }

  return (
    <>
      <Navbar lightBg />
      <main>
        <section className="pt-32 pb-16 px-6 text-center" style={{ background: '#FEF7ED' }}>
          <div className="max-w-2xl mx-auto">
            <p className="text-[#3CBFAB] font-semibold text-sm uppercase tracking-widest mb-4">
              {t('badge')}
            </p>
            <h1 className="text-5xl lg:text-6xl font-bold text-[#005088] mb-4">
              {t('terms.title')}
            </h1>
            <p className="text-[#6B7280] text-sm">{t('lastUpdated')}</p>
          </div>
        </section>

        <section className="py-16 px-6 bg-[#FAF7F2]">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg prose-headings:text-[#005088] prose-p:text-[#6B7280] prose-li:text-[#6B7280] max-w-none">
              <MDXRemote source={source} />
            </div>

            <div className="mt-12 bg-[#F8EDEB] rounded-3xl p-8 border border-[#005088]/15">
              <h3 className="text-lg font-bold text-[#005088] mb-2">{t('contactTitle')}</h3>
              <p className="text-[#6B7280] mb-4">{t('contactSubtitle')}</p>
              <a
                href={`mailto:${market.supportEmail}`}
                className="text-[#3CBFAB] font-semibold hover:underline"
              >
                {market.supportEmail}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
