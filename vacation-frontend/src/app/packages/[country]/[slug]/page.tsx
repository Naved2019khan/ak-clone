import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PackageDetailClient from "./PackageDetailClient";

const API_URL = "http://localhost:5000/api";

type Props = {
  params: Promise<{ country: string; slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const res = await fetch(`${API_URL}/packages/slug/${slug}`, { cache: "no-store" });
    const data = await res.json();
    if (data.success && data.data) {
      return {
        title: `${data.data.title} — VoyageArc`,
        description: data.data.description || "Travel package details",
      };
    }
  } catch {}
  return { title: "Package — VoyageArc" };
}

export default async function PackageSlugPage({ params }: Props) {
  const { country, slug } = await params;

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-gray-50">
        <PackageDetailClient slug={slug} country={country} />
      </main>
      <Footer />
    </>
  );
}
