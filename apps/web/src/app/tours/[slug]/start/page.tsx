import { notFound } from "next/navigation";
import { ActiveTour } from "../../../../components/active-tour";
import { getTour, tours } from "../../../../lib/content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return tours.map((tour) => ({ slug: tour.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const tour = getTour(slug);

  return {
    title: tour ? `Start ${tour.title} | Space Coast Explorer` : "Start Tour",
    description: tour?.summary ?? "Start a self-guided Space Coast tour."
  };
}

export default async function TourStartPage({ params }: PageProps) {
  const { slug } = await params;
  const tour = getTour(slug);

  if (!tour) {
    notFound();
  }

  return <ActiveTour tour={tour} />;
}
