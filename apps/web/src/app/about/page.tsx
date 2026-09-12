export const metadata = {
  title: "About | Space Coast Explorer",
  description: "About the Space Coast Explorer public destination experience."
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="text-4xl font-bold text-slate-950">About Space Coast Explorer</h1>
      <p className="mt-6 text-lg leading-8 text-slate-700">
        Space Coast Explorer is a mobile-first guide for self-guided destination experiences. It
        starts with Cocoa Village, Cocoa Beach, and Port Canaveral, while the architecture supports
        more destinations over time.
      </p>
      <p className="mt-4 leading-7 text-slate-700">
        This public release focuses on discovery, tour previews, and clear visitor information.
        GPS-guided tours, audio, AI guidance, itinerary planning, merchants, and billing are planned
        for later milestones.
      </p>
    </main>
  );
}
