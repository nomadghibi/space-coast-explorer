export type ItineraryActivity = {
  id: string;
  title: string;
  durationMinutes: number;
  area: string;
};

export type ItineraryRequest = {
  availableMinutes: number;
  activities: ItineraryActivity[];
  cruiseReturnMinutes?: number;
};

export type ItineraryPlan = {
  activities: ItineraryActivity[];
  usedMinutes: number;
  remainingMinutes: number;
  returnBufferMinutes: number;
};

/** Greedy, explainable planner. Activities remain in editorial order. */
export function buildItinerary(request: ItineraryRequest): ItineraryPlan {
  const returnBufferMinutes = Math.max(0, request.cruiseReturnMinutes ?? 0);
  const budget = Math.max(0, request.availableMinutes - returnBufferMinutes);
  const activities: ItineraryActivity[] = [];
  let usedMinutes = 0;
  for (const activity of request.activities) {
    if (activity.durationMinutes > 0 && usedMinutes + activity.durationMinutes <= budget) {
      activities.push(activity);
      usedMinutes += activity.durationMinutes;
    }
  }
  return {
    activities,
    usedMinutes,
    remainingMinutes: request.availableMinutes - usedMinutes,
    returnBufferMinutes,
  };
}
