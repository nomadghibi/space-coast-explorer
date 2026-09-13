import type { TourDetail } from "@space-coast-explorer/types";

type PreviewPoint = {
  latitude: number;
  longitude: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function projectPoint(
  point: PreviewPoint,
  bounds: { minLatitude: number; maxLatitude: number; minLongitude: number; maxLongitude: number }
) {
  const longitudeRange = bounds.maxLongitude - bounds.minLongitude || 1;
  const latitudeRange = bounds.maxLatitude - bounds.minLatitude || 1;
  const x = ((point.longitude - bounds.minLongitude) / longitudeRange) * 84 + 8;
  const y = (1 - (point.latitude - bounds.minLatitude) / latitudeRange) * 76 + 12;

  return {
    x: clamp(x, 8, 92),
    y: clamp(y, 12, 88)
  };
}

export function RoutePreview({ tour }: { tour: TourDetail }) {
  const mappedStops = tour.stops.filter((stop) => Boolean(stop.location));
  const routeCoordinates = tour.routeGeometry?.coordinates ?? mappedStops.flatMap((stop) => (stop.location ? [stop.location] : []));
  const allPoints = [...routeCoordinates, ...mappedStops.flatMap((stop) => (stop.location ? [stop.location] : []))];
  const bounds = allPoints.length
    ? {
        minLatitude: Math.min(...allPoints.map((point) => point.latitude)),
        maxLatitude: Math.max(...allPoints.map((point) => point.latitude)),
        minLongitude: Math.min(...allPoints.map((point) => point.longitude)),
        maxLongitude: Math.max(...allPoints.map((point) => point.longitude))
      }
    : {
        minLatitude: 0,
        maxLatitude: 1,
        minLongitude: 0,
        maxLongitude: 1
      };
  const routeLine = routeCoordinates.map((point) => projectPoint(point, bounds)).map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div className="route-preview overflow-hidden rounded-lg border border-white/80 shadow-[0_18px_60px_rgba(15,23,42,0.12)]">
      <div className="relative h-72">
        {routeLine ? (
          <svg aria-hidden="true" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <polyline fill="none" points={routeLine} stroke="#0f766e" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.78" strokeWidth="2.7" />
          </svg>
        ) : null}
        {mappedStops.map((stop) => {
          const point = stop.location ? projectPoint(stop.location, bounds) : { x: 50, y: 50 };
          return (
            <div
              aria-label={`Stop ${stop.sequence}: ${stop.title}`}
              className="absolute grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-teal-700 text-xs font-black text-white shadow-lg"
              key={stop.slug}
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
              title={`Stop ${stop.sequence}: ${stop.title}`}
            >
              {stop.sequence}
            </div>
          );
        })}
      </div>
      <div className="border-t border-slate-200 bg-white/95 p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-teal-700">Mapped Route Preview</p>
            <p className="mt-1 font-semibold text-slate-950">
              {mappedStops.length} {tour.destinationName} locations
            </p>
          </div>
          <p className="text-sm font-bold text-slate-600">{tour.durationMinutes} min</p>
        </div>
        <p className="mt-1 text-sm text-slate-700">{tour.staticRouteSummary}</p>
        <ol className="mt-4 grid gap-2 sm:grid-cols-2">
          {mappedStops.map((stop) => (
            <li className="flex items-center gap-2 text-sm font-bold text-slate-800" key={stop.slug}>
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-teal-700 text-[11px] font-black text-white">
                {stop.sequence}
              </span>
              <span>{stop.title}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
