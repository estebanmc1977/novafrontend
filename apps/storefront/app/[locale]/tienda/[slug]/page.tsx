// app/[locale]/tienda/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getOrderedMeta } from '@/lib/product-meta';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductDetail from '@/components/store/ProductDetail';

export async function generateStaticParams() {
  const products = getOrderedMeta();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}) {
  const { locale, slug } = await params;
  
  const allProducts = getOrderedMeta();
  const product = allProducts.find(p => p.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Navbar lightBg />
      <ProductDetail product={product} locale={locale} />
      <Footer />
    </>
  );
}

// SEO Dinámico
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getOrderedMeta().find(p => p.slug === slug);
  
  if (!product) return {};

  return {
    title: `${product.name} - Parches Transdérmicos | Novapatch`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Novapatch`,
      description: product.description,
      images: [{ url: product.imgSrc }],
    },
  };
}
