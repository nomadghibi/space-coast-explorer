import { editorialTours, statusLabel } from "../../lib/operations";

export const metadata = {
  title: "Admin CMS | Space Coast Explorer",
  robots: {
    index: false,
    follow: false
  }
};

const statusTone: Record<string, string> = {
  draft: "bg-slate-100 text-slate-800",
  in_review: "bg-amber-100 text-amber-950",
  published: "bg-emerald-100 text-emerald-900",
  archived: "bg-zinc-100 text-zinc-700"
};

export default function AdminPage() {
  const reviewCount = editorialTours.filter((tour) => tour.status === "in_review").length;
  const draftCount = editorialTours.filter((tour) => tour.status === "draft").length;

  return (
    <main className="bg-[#f7fbfb]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <p className="text-sm font-black uppercase text-teal-800">Admin CMS</p>
          <h1 className="mt-3 text-4xl font-black text-slate-950">Editorial Dashboard</h1>
          <p className="mt-3 max-w-2xl text-slate-700">
            Manage destination content readiness, publication state, and pilot fact-check work
            before tours move into a production CMS workflow.
          </p>
          <p className="mt-4 w-fit rounded-md bg-amber-100 px-3 py-2 text-sm font-black text-amber-950">
            Internal preview only. Production access requires auth and RBAC.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-5 py-8 md:grid-cols-3">
        <SummaryCard label="Tours in CMS" value={editorialTours.length.toString()} detail="pilot content records" />
        <SummaryCard label="In review" value={reviewCount.toString()} detail="waiting on editorial approval" />
        <SummaryCard label="Draft" value={draftCount.toString()} detail="not ready to publish" />
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-5 pb-10 lg:grid-cols-[1fr_340px]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">Content Queue</h2>
          <div className="mt-5 overflow-hidden rounded-lg border border-slate-200">
            <div className="grid grid-cols-[1.2fr_0.8fr_0.7fr_0.7fr] bg-slate-50 px-4 py-3 text-xs font-black uppercase text-slate-500">
              <span>Tour</span>
              <span>Destination</span>
              <span>Status</span>
              <span>Owner</span>
            </div>
            {editorialTours.map((tour) => (
              <article
                className="grid gap-3 border-t border-slate-200 px-4 py-4 text-sm md:grid-cols-[1.2fr_0.8fr_0.7fr_0.7fr]"
                key={tour.title}
              >
                <div>
                  <h3 className="font-black text-slate-950">{tour.title}</h3>
                  <p className="mt-1 text-slate-600">{tour.notes}</p>
                </div>
                <p className="font-bold text-slate-700">{tour.destination}</p>
                <p>
                  <span className={`rounded-md px-2 py-1 text-xs font-black ${statusTone[tour.status]}`}>
                    {statusLabel(tour.status)}
                  </span>
                </p>
                <p className="font-bold text-slate-700">{tour.owner}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">CMS Launch Gate</h2>
          <div className="mt-4 space-y-3 text-sm">
            {[
              "Replace local CMS token with user auth and RBAC.",
              "Move public content reads from static seed data to published records.",
              "Add audit log entries for publish and archive actions.",
              "Finish Cocoa Village fact-check before field pilot."
            ].map((item) => (
              <p className="rounded-lg bg-slate-50 p-3 font-semibold text-slate-700" key={item}>
                {item}
              </p>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}

function SummaryCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-black uppercase text-slate-500">{label}</p>
      <p className="mt-3 text-4xl font-black text-slate-950">{value}</p>
      <p className="mt-2 text-sm font-semibold text-slate-600">{detail}</p>
    </div>
  );
}
