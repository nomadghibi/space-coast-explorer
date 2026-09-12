import type {
  Destination,
  TourCategory,
  TourDetail,
  TourSummary,
  TransportMode
} from "@space-coast-explorer/types";

export const categories = [
  "Space & Rocket",
  "Beach",
  "History",
  "Food & Drink",
  "Nature",
  "Arts & Culture",
  "Family",
  "Cruise Day",
  "Quick Adventures"
] as const;

export const destinations: Destination[] = [
  {
    slug: "space-coast",
    name: "Florida's Space Coast",
    eyebrow: "Beaches, launches, villages, and cruise days",
    summary: "Discover self-guided experiences across Cocoa Village, Cocoa Beach, and Port Canaveral.",
    introduction: [
      "Space Coast Explorer brings local stories, coastal stops, launch-day energy, and neighborhood discovery into one mobile-first guide.",
      "This first public experience focuses on the places visitors can explore before a beach day, after a cruise, or during a relaxed downtown walk."
    ],
    highlights: ["Space history", "Beach culture", "Historic districts", "Cruise-friendly discovery", "Local food and shops"],
    quickInfo: {
      bestFor: "First-time visitors, families, cruise travelers, and curious locals",
      typicalVisitLength: "One hour to a half day depending on destination",
      walkingFriendliness: "Varies by area; tour pages identify the expected mode",
      familySuitability: "Family-friendly routes are labeled in tour details",
      parkingSummary: "Parking varies by area; verify posted signs before leaving your vehicle"
    },
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Atlantic shoreline with bright coastal water"
  },
  {
    slug: "cocoa-village",
    name: "Cocoa Village",
    eyebrow: "Historic downtown exploring",
    summary: "Walk a compact downtown district with architecture, shops, restaurants, riverfront moments, and layered local stories.",
    introduction: [
      "Cocoa Village is the pilot district for Space Coast Explorer because it is compact, walkable, and story-rich.",
      "M1 presents the public discovery layer. Historical notes that need editorial review remain clearly marked before production publication."
    ],
    highlights: ["Historic architecture", "Shopping", "Restaurants", "Riverfront", "Local culture"],
    quickInfo: {
      bestFor: "History, dining, shopping, and relaxed walking",
      typicalVisitLength: "45 to 90 minutes",
      walkingFriendliness: "Compact downtown walking area",
      familySuitability: "Good for families comfortable with sidewalk walking",
      parkingSummary: "Use posted public parking guidance and verify time limits"
    },
    imageUrl: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Sunny walkable coastal town street"
  },
  {
    slug: "cocoa-beach",
    name: "Cocoa Beach",
    eyebrow: "Surf, sand, and space culture",
    summary: "Explore beach culture, surf history, food stops, family attractions, and the coastal side of the Space Coast.",
    introduction: [
      "Cocoa Beach anchors the classic Space Coast beach day with surf culture, casual dining, and easy access to coastal views.",
      "M1 keeps this as discovery content only; live beach conditions and time-sensitive details require later verified integrations."
    ],
    highlights: ["Beach", "Surfing", "Food", "Space culture", "Family attractions"],
    quickInfo: {
      bestFor: "Beach days, families, food, and surf culture",
      typicalVisitLength: "Two hours to a full day",
      walkingFriendliness: "Best explored by short walks plus driving between areas",
      familySuitability: "Strong family appeal; verify beach safety conditions locally",
      parkingSummary: "Beach parking rules and prices can change; verify posted information"
    },
    imageUrl: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Ocean waves rolling toward a sandy beach"
  },
  {
    slug: "port-canaveral",
    name: "Port Canaveral",
    eyebrow: "Cruise gateway and waterfront discovery",
    summary: "Find waterfront restaurants, launch-view energy, cruise-day stops, and nearby coastal experiences.",
    introduction: [
      "Port Canaveral is built for visitors with a clock in mind: cruise travelers, launch watchers, and waterfront explorers.",
      "M1 introduces curated discovery without automatic itinerary timing. Cruise travelers should always verify boarding requirements directly with their cruise line."
    ],
    highlights: ["Cruise travel", "Waterfront", "Restaurants", "Launch viewpoints", "Nearby beaches"],
    quickInfo: {
      bestFor: "Cruise travelers, waterfront dining, and launch-view planning",
      typicalVisitLength: "One to three hours",
      walkingFriendliness: "Best as a driving or mixed-mode area",
      familySuitability: "Good for families when time and transportation are planned",
      parkingSummary: "Verify posted parking and cruise terminal rules before arrival"
    },
    imageUrl: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Cruise ship docked near bright coastal water"
  }
];

export const tours: TourDetail[] = [
  {
    slug: "cocoa-village-historic-explorer",
    title: "Cocoa Village Historic Explorer",
    destinationSlug: "cocoa-village",
    destinationName: "Cocoa Village",
    summary: "A compact walking introduction to Cocoa Village's streets, storefronts, civic spaces, and riverfront edges.",
    description: "Follow a self-guided downtown route built for the first Space Coast Explorer pilot. Several story notes are intentionally marked for editorial review before production launch.",
    categories: ["History", "Food", "Arts & Culture", "Family"],
    transportMode: "Walking",
    durationMinutes: 60,
    distanceMiles: 1.2,
    stopCount: 10,
    priceLabel: "Free",
    difficulty: "Easy",
    startLocation: "Cocoa Village downtown core",
    accessibilitySummary: "Sidewalk-focused route; curb cuts, construction, and surface conditions must be verified before pilot publication.",
    imageUrl: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Historic street with warm storefront lighting",
    highlights: ["Pilot experience", "Historic downtown", "Local shops", "Short walking loop"],
    safetyNotes: ["Verify crossings and sidewalk conditions before starting.", "FACT_CHECK_REQUIRED: final stop narratives need source review."],
    staticRouteSummary: "Static preview of a downtown walking loop. Live GPS guidance begins in M2.",
    stops: [
      { sequence: 1, title: "Village Welcome", summary: "Start with the downtown layout and how to move through the route." },
      { sequence: 2, title: "Historic Storefront Row", summary: "Observe architectural details and storefront rhythm.", note: "FACT_CHECK_REQUIRED" },
      { sequence: 3, title: "Civic Corner", summary: "A stop for public-space context and orientation.", note: "FACT_CHECK_REQUIRED" },
      { sequence: 4, title: "Dining Lane", summary: "A food-and-local-business discovery moment." },
      { sequence: 5, title: "Arts Block", summary: "A short look at the district's creative side.", note: "FACT_CHECK_REQUIRED" },
      { sequence: 6, title: "River Approach", summary: "Move toward the waterfront edge and pause for context." },
      { sequence: 7, title: "Riverfront View", summary: "A scenic stop with space for reflection and photos." },
      { sequence: 8, title: "Neighborhood Connector", summary: "Connect the waterfront back to the downtown core." },
      { sequence: 9, title: "Local Stories Stop", summary: "A placeholder for sourced resident and archival stories.", note: "FACT_CHECK_REQUIRED" },
      { sequence: 10, title: "Finish in the Village", summary: "End near dining, shopping, and optional next stops." }
    ]
  },
  {
    slug: "cocoa-beach-surf-space-sand",
    title: "Cocoa Beach: Surf, Space & Sand",
    destinationSlug: "cocoa-beach",
    destinationName: "Cocoa Beach",
    summary: "A beach-town discovery route connecting surf culture, casual food, coastal views, and Space Coast atmosphere.",
    description: "A mixed-mode public preview for visitors planning a Cocoa Beach day. Live conditions and route navigation are deferred to later milestones.",
    categories: ["Beach", "Space", "Food", "Family"],
    transportMode: "Mixed",
    durationMinutes: 95,
    distanceMiles: 4.8,
    stopCount: 6,
    priceLabel: "Free",
    difficulty: "Easy",
    startLocation: "Central Cocoa Beach",
    accessibilitySummary: "Beach access and parking conditions vary; verify local access points and posted guidance.",
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "People walking near a sunny beach shoreline",
    highlights: ["Surf culture", "Beach views", "Food stops", "Family-friendly pacing"],
    safetyNotes: ["Check beach warnings and weather locally.", "Do not rely on this preview for live parking or access conditions."],
    staticRouteSummary: "Static preview of beach-area discovery stops. Live routing begins in M2.",
    stops: [
      { sequence: 1, title: "Beach Day Start", summary: "Orient around the central beach area." },
      { sequence: 2, title: "Surf Culture Stop", summary: "A public-facing surf culture introduction.", note: "FACT_CHECK_REQUIRED" },
      { sequence: 3, title: "Coastal Food Break", summary: "Plan an optional local food pause." },
      { sequence: 4, title: "Space Coast Viewpoint", summary: "Connect beach atmosphere to the wider Space Coast story." },
      { sequence: 5, title: "Family Stop", summary: "A slower-paced stop for groups with kids." },
      { sequence: 6, title: "Sunset Option", summary: "A flexible finish depending on time of day." }
    ]
  },
  {
    slug: "port-canaveral-explorer",
    title: "Port Canaveral Explorer",
    destinationSlug: "port-canaveral",
    destinationName: "Port Canaveral",
    summary: "A cruise-friendly waterfront preview for visitors with limited time near the port.",
    description: "Discover restaurants, waterfront energy, and nearby coastal context without automatic itinerary promises. Cruise travelers must verify boarding rules directly.",
    categories: ["Cruise", "Food", "Space", "Family"],
    transportMode: "Driving",
    durationMinutes: 75,
    distanceMiles: 5.5,
    stopCount: 5,
    priceLabel: "Free",
    difficulty: "Easy",
    startLocation: "Port Canaveral waterfront area",
    accessibilitySummary: "Driving-oriented route; verify parking, terminal access, and walkway conditions.",
    imageUrl: "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Large ship near a coastal harbor",
    highlights: ["Cruise day option", "Waterfront dining", "Launch-view planning", "Short time window"],
    safetyNotes: ["Verify boarding requirements directly with your cruise line.", "Do not use this preview as a guarantee of return timing."],
    staticRouteSummary: "Static preview of port-area points of interest. Deadline-safe itinerary logic begins in M6.",
    stops: [
      { sequence: 1, title: "Port Orientation", summary: "Start with the waterfront area and time constraints." },
      { sequence: 2, title: "Restaurant Row", summary: "Browse casual waterfront dining options." },
      { sequence: 3, title: "Launch View Context", summary: "Understand where launch watching may fit.", note: "FACT_CHECK_REQUIRED" },
      { sequence: 4, title: "Nearby Beach Link", summary: "Consider a nearby coastal extension if time allows." },
      { sequence: 5, title: "Return Buffer Reminder", summary: "End with a clear reminder to protect boarding time." }
    ]
  }
];

export function getDestination(slug: string) {
  return destinations.find((destination) => destination.slug === slug);
}

export function getTour(slug: string) {
  return tours.find((tour) => tour.slug === slug);
}

export function destinationTours(slug: string): TourDetail[] {
  return tours.filter((tour) => tour.destinationSlug === slug);
}

export type TourFilters = {
  destination?: string | undefined;
  category?: string | undefined;
  duration?: string | undefined;
  mode?: string | undefined;
  price?: string | undefined;
};

export function filterTours(filters: TourFilters): TourSummary[] {
  return tours.filter((tour) => {
    const destinationMatch = !filters.destination || filters.destination === "all" || tour.destinationSlug === filters.destination;
    const categoryMatch = !filters.category || filters.category === "all" || tour.categories.includes(filters.category as TourCategory);
    const modeMatch = !filters.mode || filters.mode === "all" || tour.transportMode === (filters.mode as TransportMode);
    const priceMatch = !filters.price || filters.price === "all" || tour.priceLabel.toLowerCase() === filters.price;
    const durationMatch =
      !filters.duration ||
      filters.duration === "all" ||
      (filters.duration === "under-1-hour" && tour.durationMinutes < 60) ||
      (filters.duration === "1-2-hours" && tour.durationMinutes >= 60 && tour.durationMinutes <= 120) ||
      (filters.duration === "2-plus-hours" && tour.durationMinutes > 120);

    return destinationMatch && categoryMatch && modeMatch && priceMatch && durationMatch;
  });
}
