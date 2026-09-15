export type AnalyticsEventName =
  | "health_check"
  | "tour_started"
  | "stop_viewed"
  | "stop_completed"
  | "tour_completed"
  | "visitor_experience.started"
  | "visitor_experience.completed"
  | "tour_stop.arrived"
  | "tour_stop.completed"
  | "pilot_feedback.submitted"
  | "premium_feature_viewed"
  | "premium_gate_opened"
  | "premium_gate_dismissed"
  | "premium_upgrade_clicked"
  | "checkout_started"
  | "purchase_completed"
  | "purchase_failed"
  | "explorer_pass_activated"
  | "explorer_pass_expired"
  | "full_story_opened"
  | "audio_guide_opened"
  | "then_and_now_opened"
  | "bonus_stop_opened"
  | "ai_guide_opened";

export type CompletionMethod = "gps" | "manual";

export type AnalyticsEventPayload = {
  completionMethod?: CompletionMethod;
  stopSlug?: string;
  completedStops?: number;
  totalStops?: number;
  feature?: string;
  plan?: "free" | "explorer_pass";
  source?: string;
  upgradeTrigger?: string;
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
