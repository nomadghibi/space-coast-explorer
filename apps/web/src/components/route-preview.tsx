import type { TourDetail } from "@space-coast-explorer/types";

export function RoutePreview({ tour }: { tour: TourDetail }) {
  return (
    <div className="route-preview relative min-h-80 overflow-hidden rounded-lg border border-white/80 shadow-[0_18px_60px_rgba(15,23,42,0.12)]">
      <div className="absolute inset-x-[13%] top-[44%] h-1 rotate-6 rounded-full bg-teal-700/60 shadow-lg" />
      <div className="absolute left-[12%] top-[22%] grid size-8 place-items-center rounded-full bg-teal-700 text-xs font-black text-white">1</div>
      <div className="absolute left-[28%] top-[40%] grid size-8 place-items-center rounded-full bg-teal-700 text-xs font-black text-white">2</div>
      <div className="absolute left-[48%] top-[32%] grid size-8 place-items-center rounded-full bg-teal-700 text-xs font-black text-white">3</div>
      <div className="absolute left-[68%] top-[55%] grid size-8 place-items-center rounded-full bg-teal-700 text-xs font-black text-white">4</div>
      <div className="absolute left-[82%] top-[44%] grid size-8 place-items-center rounded-full bg-orange-500 text-xs font-black text-white">5</div>
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-5">
        <p className="font-semibold text-slate-950">Static Route Preview</p>
        <p className="mt-1 text-sm text-slate-700">{tour.staticRouteSummary}</p>
      </div>
    </div>
  );
}
