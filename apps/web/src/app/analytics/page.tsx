import { formatPercent, getPilotTotals, pilotTourMetrics } from "../../lib/pilot-analytics";

const readinessItems = [
  { label: "Web experience", status: "Live", tone: "bg-emerald-100 text-emerald-900" },
  { label: "Migrations", status: "Ready", tone: "bg-emerald-100 text-emerald-900" },
  { label: "API hosting", status: "Needed", tone: "bg-amber-100 text-amber-950" },
  { label: "Rate limits", status: "Needed", tone: "bg-amber-100 text-amber-950" },
  { label: "Content fact-check", status: "Needed", tone: "bg-amber-100 text-amber-950" }
];

export default function AnalyticsPage() {
  const totals = getPilotTotals();
  const completionMax = Math.max(
    ...pilotTourMetrics.map((metric) => metric.completedVisitorExperiences)
  );

  return (
    <main className="bg-[#f7fbfb]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <p className="text-sm font-black uppercase text-teal-800">Pilot analytics</p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black text-slate-950">Completed Visitor Experiences</h1>
              <p className="mt-3 max-w-2xl text-slate-700">
                A pilot dashboard for measuring tour starts, completions, GPS/manual completion
                split, and launch readiness across the first destination wedge.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-black uppercase text-slate-500">Data mode</p>
              <p className="mt-1 font-black text-slate-950">Demo metrics until API hosting is live</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-8">
        <div className="grid gap-4 md:grid-cols-4">
          <MetricTile
            label="Completed"
            value={totals.completedVisitorExperiences.toString()}
            detail="primary metric"
          />
          <MetricTile
            label="Started"
            value={totals.startedVisitorExperiences.toString()}
            detail="visitor sessions"
          />
          <MetricTile
            label="Completion rate"
            value={formatPercent(totals.completionRate)}
            detail="completed / started"
          />
          <MetricTile
            label="GPS share"
            value={formatPercent(
              totals.completedVisitorExperiences === 0
                ? 0
                : totals.gpsCompletions / totals.completedVisitorExperiences
            )}
            detail="automatic completions"
          />
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-5 pb-10 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-950">Tour Performance</h2>
              <p className="text-sm text-slate-600">Current pilot wedge by destination.</p>
            </div>
            <p className="text-sm font-bold text-slate-500">Last 30 days</p>
          </div>

          <div className="mt-6 space-y-5">
            {pilotTourMetrics.map((metric) => (
              <article className="border-t border-slate-100 pt-5" key={metric.tourId}>
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-black uppercase text-teal-800">
                      {metric.destinationName}
                    </p>
                    <h3 className="mt-1 text-lg font-black text-slate-950">{metric.tourTitle}</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-right">
                    <SmallStat label="Done" value={metric.completedVisitorExperiences} />
                    <SmallStat label="Rate" value={formatPercent(metric.completionRate)} />
                    <SmallStat label="Rating" value={metric.feedbackRating.toFixed(1)} />
                  </div>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-teal-700"
                    style={{
                      width: `${Math.round(
                        (metric.completedVisitorExperiences / completionMax) * 100
                      )}%`
                    }}
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-600">
                  <span>{metric.gpsCompletions} GPS completions</span>
                  <span>{metric.manualCompletions} manual completions</span>
                  <span>{metric.averageMinutes} min average</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">Completion Method</h2>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-teal-50 p-4">
                <p className="text-3xl font-black text-teal-900">{totals.gpsCompletions}</p>
                <p className="mt-1 text-sm font-bold text-teal-950">GPS</p>
              </div>
              <div className="rounded-lg bg-amber-50 p-4">
                <p className="text-3xl font-black text-amber-950">{totals.manualCompletions}</p>
                <p className="mt-1 text-sm font-bold text-amber-950">Manual</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Manual completion remains healthy for visitors with denied or weak location signals.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">Pilot Gate</h2>
            <div className="mt-4 space-y-3">
              {readinessItems.map((item) => (
                <div className="flex items-center justify-between gap-3" key={item.label}>
                  <span className="text-sm font-bold text-slate-700">{item.label}</span>
                  <span className={`rounded-md px-2 py-1 text-xs font-black ${item.tone}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

function MetricTile({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-black uppercase text-slate-500">{label}</p>
      <p className="mt-3 text-4xl font-black text-slate-950">{value}</p>
      <p className="mt-2 text-sm font-semibold text-slate-600">{detail}</p>
    </div>
  );
}

function SmallStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <p className="text-base font-black text-slate-950">{value}</p>
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
    </div>
  );
}
