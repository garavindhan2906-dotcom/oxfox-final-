import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SocialFloatingButtons from '@/components/layout/SocialFloatingButtons';
import PageTransition from '@/components/motion/PageTransition';
import { apiFetch } from '@/lib/api';
import type { Category } from '@/types';

async function getCategories(): Promise<Category[]> {
  try {
    const { categories } = await apiFetch<{ categories: Category[] }>('/api/categories');
    return categories;
  } catch {
    return [];
  }
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();

  return (
    <>
      <Header categories={categories} />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <SocialFloatingButtons />
    </>
  );
}
