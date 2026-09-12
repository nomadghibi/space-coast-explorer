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
      "Start with a relaxed downtown route, then leave room for a meal, a shop visit, or a riverfront pause."
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
      "Use these pages to compare areas and plan a simple day; always check current beach conditions and posted guidance locally."
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
      "Cruise travelers can browse nearby ideas, then verify boarding requirements and timing directly with their cruise line."
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
    description: "Follow a self-guided downtown route with easy pacing, scenic pauses, and flexible time for shops, food, and the riverfront.",
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
    safetyNotes: ["Use marked crossings where available.", "Check sidewalk, curb, weather, and traffic conditions before starting."],
    staticRouteSummary: "A downtown walking loop preview with compact stops and flexible pacing.",
    routeGeometry: {
      type: "LineString",
      coordinates: [
        { latitude: 28.35532, longitude: -80.72606 },
        { latitude: 28.3552, longitude: -80.72555 },
        { latitude: 28.35493, longitude: -80.72384 },
        { latitude: 28.35455, longitude: -80.7242 },
        { latitude: 28.35425, longitude: -80.72502 },
        { latitude: 28.35413, longitude: -80.72592 },
        { latitude: 28.35441, longitude: -80.72728 },
        { latitude: 28.3549, longitude: -80.7272 },
        { latitude: 28.35512, longitude: -80.72665 },
        { latitude: 28.35532, longitude: -80.72606 }
      ]
    },
    stops: [
      { sequence: 1, slug: "village-welcome", title: "Village Welcome", summary: "Start near the Historic Cocoa Village Playhouse and get oriented.", visitorStory: "Take a minute to get oriented before you walk. This route is designed for a comfortable pace with short blocks, visible storefronts, and easy places to pause.", location: { latitude: 28.35532, longitude: -80.72606 }, triggerRadiusMeters: 35, exitRadiusMeters: 60 },
      { sequence: 2, slug: "storefront-row", title: "Storefront Row", summary: "Notice the street rhythm, window details, and small-business energy.", visitorStory: "Look across the block before moving on. The storefronts give the village much of its texture: signs, awnings, shaded entries, and the steady mix of visitors and locals.", internalEditorialState: "needs_fact_check", location: { latitude: 28.3552, longitude: -80.72555 }, triggerRadiusMeters: 35, exitRadiusMeters: 60 },
      { sequence: 3, slug: "civic-corner", title: "Civic Corner", summary: "Pause for a practical downtown orientation point.", visitorStory: "Use this stop to reset your sense of direction and decide how quickly you want to move. The best self-guided walks leave space for detours.", internalEditorialState: "needs_fact_check", location: { latitude: 28.35493, longitude: -80.72384 }, triggerRadiusMeters: 35, exitRadiusMeters: 60 },
      { sequence: 4, slug: "dining-lane", title: "Dining Lane", summary: "Spot options for a snack, meal, or post-tour return.", visitorStory: "If a menu or patio catches your eye, mark it for later. The route is short enough that you can finish first and circle back without losing the thread of the walk.", location: { latitude: 28.35455, longitude: -80.7242 }, triggerRadiusMeters: 35, exitRadiusMeters: 60 },
      { sequence: 5, slug: "arts-block", title: "Arts Block", summary: "Look for the district's creative side in galleries, windows, and event spaces.", visitorStory: "This stop is about atmosphere more than a single landmark. Watch for color, posted events, handmade details, and the places where local culture shows up at street level.", internalEditorialState: "needs_fact_check", location: { latitude: 28.35425, longitude: -80.72502 }, triggerRadiusMeters: 35, exitRadiusMeters: 60 },
      { sequence: 6, slug: "river-approach", title: "River Approach", summary: "Move toward the waterfront edge and slow the pace.", visitorStory: "As the route opens toward the water, listen for the change in the street. Traffic, shade, breeze, and views all shift as downtown gives way to the riverfront.", location: { latitude: 28.35413, longitude: -80.72592 }, triggerRadiusMeters: 35, exitRadiusMeters: 60 },
      { sequence: 7, slug: "riverfront-view", title: "Riverfront View", summary: "A scenic stop with space for reflection and photos.", visitorStory: "Pause here longer than you think you need to. The riverfront is the natural breathing room of the walk and a good place to check in with your group.", location: { latitude: 28.35441, longitude: -80.72728 }, triggerRadiusMeters: 35, exitRadiusMeters: 60 },
      { sequence: 8, slug: "neighborhood-connector", title: "Neighborhood Connector", summary: "Connect the waterfront back to the downtown core.", visitorStory: "This leg brings you back from open water toward the tighter village streets. Keep an eye on crossings and choose the most comfortable sidewalk path.", location: { latitude: 28.3549, longitude: -80.7272 }, triggerRadiusMeters: 35, exitRadiusMeters: 60 },
      { sequence: 9, slug: "local-stories", title: "Local Stories", summary: "Make room for the people, routines, and everyday details that shape the village.", visitorStory: "Instead of rushing through, notice what feels lived-in: regulars greeting each other, event flyers, benches, and the small cues that make a downtown feel personal.", internalEditorialState: "needs_fact_check", location: { latitude: 28.35512, longitude: -80.72665 }, triggerRadiusMeters: 35, exitRadiusMeters: 60 },
      { sequence: 10, slug: "finish-in-the-village", title: "Finish in the Village", summary: "End near dining, shopping, and optional next stops.", visitorStory: "You are back in easy reach of the places you may have bookmarked along the way. Finish here, or turn the walk into a meal, dessert stop, or slow browse.", location: { latitude: 28.35532, longitude: -80.72606 }, triggerRadiusMeters: 35, exitRadiusMeters: 60 }
    ]
  },
  {
    slug: "cocoa-beach-surf-space-sand",
    title: "Cocoa Beach: Surf, Space & Sand",
    destinationSlug: "cocoa-beach",
    destinationName: "Cocoa Beach",
    summary: "A beach-town discovery route connecting surf culture, casual food, coastal views, and Space Coast atmosphere.",
    description: "A mixed-mode beach-town route for visitors planning a Cocoa Beach day with flexible stops for food, views, and family pacing.",
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
    staticRouteSummary: "A beach-area route preview designed for short walks and simple drives between stops.",
    stops: [
      { sequence: 1, slug: "beach-day-start", title: "Beach Day Start", summary: "Orient around the central beach area.", visitorStory: "Start by checking posted beach guidance, parking rules, and the comfort level of your group before you spread out for the day." },
      { sequence: 2, slug: "surf-culture", title: "Surf Culture Stop", summary: "A friendly introduction to Cocoa Beach's surf-town feel.", visitorStory: "Look for the shops, boards, beachwear, and easygoing rhythm that make Cocoa Beach feel different from a generic shoreline stop.", internalEditorialState: "needs_fact_check" },
      { sequence: 3, slug: "coastal-food-break", title: "Coastal Food Break", summary: "Plan an optional local food pause.", visitorStory: "Use this as a natural break point. A beach day is better when the route leaves time for shade, water, snacks, and unhurried choices." },
      { sequence: 4, slug: "space-coast-viewpoint", title: "Space Coast Viewpoint", summary: "Connect beach atmosphere to the wider Space Coast story.", visitorStory: "This stop is a reminder that the coast carries more than beach energy. Keep the wider region in mind as you look toward the horizon." },
      { sequence: 5, slug: "family-stop", title: "Family Stop", summary: "A slower-paced stop for groups with kids.", visitorStory: "Slow the route down here. Check shade, restrooms, water, and whether everyone is still enjoying the plan before continuing." },
      { sequence: 6, slug: "sunset-option", title: "Sunset Option", summary: "A flexible finish depending on time of day.", visitorStory: "End with the option that fits your day: one more beach view, a meal, or an easy return before everyone gets tired." }
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
    staticRouteSummary: "A port-area route preview for visitors comparing nearby waterfront stops.",
    stops: [
      { sequence: 1, slug: "port-orientation", title: "Port Orientation", summary: "Start with the waterfront area and your available time.", visitorStory: "Before you choose a stop, be honest about your schedule. Port days work best when you protect return time and keep the plan simple." },
      { sequence: 2, slug: "restaurant-row", title: "Restaurant Row", summary: "Browse casual waterfront dining options.", visitorStory: "Look for the kind of stop your group actually wants: quick snack, sit-down meal, waterfront view, or a place to linger." },
      { sequence: 3, slug: "launch-view-context", title: "Launch View Context", summary: "Consider how launch watching may fit into the day.", visitorStory: "If a launch is part of your visit, confirm current launch information from official sources and leave extra time for crowds and traffic.", internalEditorialState: "needs_fact_check" },
      { sequence: 4, slug: "nearby-beach-link", title: "Nearby Beach Link", summary: "Consider a nearby coastal extension if time allows.", visitorStory: "A short beach detour can be a good add-on when your schedule is loose. Keep the plan conservative if you have a ship, reservation, or timed pickup." },
      { sequence: 5, slug: "return-buffer", title: "Return Buffer Reminder", summary: "End with a clear reminder to protect boarding or pickup time.", visitorStory: "Finish with more buffer than you think you need. Traffic, parking, payment, and group logistics can all take longer near the port." }
    ]
  }
];

export function getDestination(slug: string) {
  return destinations.find((destination) => destination.slug === slug);
}

export function getTour(slug: string) {
  return tours.find((tour) => tour.slug === slug);
}

export function getTourStop(tourSlug: string, stopSlug: string) {
  const tour = getTour(tourSlug);

  if (!tour) {
    return undefined;
  }

  return tour.stops.find((stop) => stop.slug === stopSlug);
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
