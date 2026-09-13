export const editorialTours = [
  {
    title: "Cocoa Village Historic Explorer",
    destination: "Cocoa Village",
    status: "in_review",
    owner: "Editorial",
    updated: "Today",
    notes: "Pilot route needs final local fact-check."
  },
  {
    title: "Cocoa Beach: Surf, Space & Sand",
    destination: "Cocoa Beach",
    status: "draft",
    owner: "Content",
    updated: "This week",
    notes: "Preview copy is live; media and stop details pending."
  },
  {
    title: "Port Canaveral Explorer",
    destination: "Port Canaveral",
    status: "draft",
    owner: "Operations",
    updated: "This week",
    notes: "Cruise timing guidance requires partner review."
  }
];

export const merchantPipeline = [
  {
    business: "Historic Village Cafe",
    destination: "Cocoa Village",
    status: "claim_ready",
    plan: "Starter",
    action: "Invite owner"
  },
  {
    business: "Beach Gear Rental",
    destination: "Cocoa Beach",
    status: "unclaimed",
    plan: "Starter",
    action: "Verify listing"
  },
  {
    business: "Portside Bites",
    destination: "Port Canaveral",
    status: "review",
    plan: "Merchant Plus",
    action: "Review documents"
  }
];

export function statusLabel(status: string) {
  return status.replaceAll("_", " ");
}
