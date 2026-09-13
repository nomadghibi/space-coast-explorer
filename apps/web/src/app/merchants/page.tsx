import { merchantPipeline, statusLabel } from "../../lib/operations";

export const metadata = {
  title: "Merchant Portal | Space Coast Explorer",
  robots: {
    index: false,
    follow: false
  }
};

const claimTone: Record<string, string> = {
  claim_ready: "bg-emerald-100 text-emerald-900",
  unclaimed: "bg-slate-100 text-slate-800",
  review: "bg-amber-100 text-amber-950"
};

export default function MerchantsPage() {
  return (
    <main className="bg-[#f7fbfb]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <p className="text-sm font-black uppercase text-orange-700">Merchant portal</p>
          <h1 className="mt-3 text-4xl font-black text-slate-950">Local Business Console</h1>
          <p className="mt-3 max-w-2xl text-slate-700">
            Prepare business listings, claim review, and billing readiness for destination partners
            before merchant accounts are opened to the public.
          </p>
          <p className="mt-4 w-fit rounded-md bg-amber-100 px-3 py-2 text-sm font-black text-amber-950">
            Internal preview only. Production access requires merchant login and organization roles.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-8 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4">
          {merchantPipeline.map((merchant) => (
            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" key={merchant.business}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-black uppercase text-teal-800">{merchant.destination}</p>
                  <h2 className="mt-1 text-2xl font-black text-slate-950">{merchant.business}</h2>
                </div>
                <span className={`w-fit rounded-md px-2 py-1 text-xs font-black ${claimTone[merchant.status]}`}>
                  {statusLabel(merchant.status)}
                </span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <MiniPanel label="Plan" value={merchant.plan} />
                <MiniPanel label="Next action" value={merchant.action} />
                <MiniPanel label="Billing" value="Not charging" />
              </div>
            </article>
          ))}
        </div>

        <aside className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">Portal Status</h2>
            <div className="mt-4 space-y-3">
              <StatusRow label="Business records" value="Ready" />
              <StatusRow label="Claim workflow" value="Modeled" />
              <StatusRow label="Subscriptions" value="Modeled" />
              <StatusRow label="Payments" value="Not live" />
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">Before Public Access</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Merchant login, organization membership, claim verification, and payment provider
              webhooks need to be connected before real businesses manage listings.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}

function MiniPanel({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-xs font-black uppercase text-slate-500">{label}</p>
      <p className="mt-2 font-black text-slate-950">{value}</p>
    </div>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-sm">
      <span className="font-bold text-slate-700">{label}</span>
      <span className="font-black text-slate-950">{value}</span>
    </div>
  );
}
