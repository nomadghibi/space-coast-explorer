export type AnalyticsEventName =
  | "health_check"
  | "visitor_experience.started"
  | "visitor_experience.completed"
  | "tour_stop.arrived"
  | "tour_stop.completed"
  | "pilot_feedback.submitted";

export type CompletionMethod = "gps" | "manual";

export type AnalyticsEventPayload = {
  completionMethod?: CompletionMethod;
  stopSlug?: string;
  rating?: number;
  notes?: string;
};

export type AnalyticsEvent = {
  destinationId: string;
  tourId?: string;
  visitorSessionId: string;
  eventName: AnalyticsEventName;
  occurredAt: string;
  payload: AnalyticsEventPayload;
};

export type PilotAnalyticsSummary = {
  destinationId: string;
  tourId?: string;
  completedVisitorExperiences: number;
  startedVisitorExperiences: number;
  manualCompletions: number;
  gpsCompletions: number;
  completionRate: number;
};

export function isCompletedVisitorExperience(event: AnalyticsEvent): boolean {
  return event.eventName === "visitor_experience.completed";
}
