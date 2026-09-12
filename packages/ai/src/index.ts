export type AiProviderName = "not_configured" | "openai";

export type EvidenceRecord = {
  id: string;
  title: string;
  canonicalUrl: string;
  sourceType: "official" | "editorial" | "community";
  capturedAt: string;
  contentHash: string;
  confidence: "high" | "medium" | "low";
};

export type RetrievedEvidence = EvidenceRecord & { excerpt: string; score: number };
export type GuideAnswer = {
  answer: string;
  evidenceIds: string[];
  confidence: "high" | "medium" | "low";
  shouldDecline: boolean;
};
export type GuideProvider = {
  readonly name: AiProviderName;
  answer(question: string, evidence: RetrievedEvidence[]): Promise<GuideAnswer>;
};

const injectionPatterns = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /reveal\s+(the\s+)?system\s+prompt/i,
  /disregard\s+(your\s+)?rules/i,
  /you are now\s+(a|an)\s+/i,
];

export function containsPromptInjection(input: string): boolean {
  return injectionPatterns.some((pattern) => pattern.test(input));
}

export function canAnswerWithEvidence(evidence: RetrievedEvidence[]): boolean {
  return evidence.length > 0 && evidence.every((item) => item.id && item.canonicalUrl);
}
