import type {
  Destination,
  DestinationPoi,
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

export const destinationPois: DestinationPoi[] = [
  {
    slug: "porcher-house",
    destinationSlug: "cocoa-village",
    name: "Porcher House",
    category: "Historic Landmark",
    summary: "Official start of Cocoa Village's self-guided historic walking tour.",
    priority: "featured",
    address: "434 Delannoy Avenue, Cocoa, FL 32922",
    sourceUrl: "https://visitcocoavillage.com/discover/historic-walking-tour"
  },
  {
    slug: "parrish-grove-inn",
    destinationSlug: "cocoa-village",
    name: "The Parrish Grove Inn",
    category: "Historic Landmark",
    summary: "Historic restored lodging property on Delannoy Avenue.",
    priority: "featured",
    address: "536 Delannoy Avenue, Cocoa, FL 32922"
  },
  {
    slug: "sur-le-parc",
    destinationSlug: "cocoa-village",
    name: "Sur Le Parc",
    category: "Historic Landmark",
    summary: "One of the historic structures connected to the village walking-tour story.",
    priority: "standard"
  },
  {
    slug: "st-marks-episcopal-church",
    destinationSlug: "cocoa-village",
    name: "St. Mark's Episcopal Church",
    category: "Historic Landmark",
    summary: "Historic church and community landmark within the village district.",
    priority: "standard"
  },
  {
    slug: "hindle-building",
    destinationSlug: "cocoa-village",
    name: "Hindle Building",
    category: "Historic Landmark",
    summary: "Historic downtown commercial architecture along the walking-tour corridor.",
    priority: "standard"
  },
  {
    slug: "derby-street-chapel",
    destinationSlug: "cocoa-village",
    name: "Derby Street Chapel",
    category: "Historic Landmark",
    summary: "Preserved Craftsman chapel in the Derby Street historic area.",
    priority: "standard",
    address: "121 Derby Street, Cocoa, FL 32922"
  },
  {
    slug: "sf-travis-company",
    destinationSlug: "cocoa-village",
    name: "S.F. Travis Company",
    category: "Historic Landmark",
    summary: "Long-running local hardware business tied to Cocoa's commerce history.",
    priority: "featured",
    sourceUrl: "https://visitcocoavillage.com/discover/s-f-travis-company"
  },
  {
    slug: "village-tower-masonic-temple",
    destinationSlug: "cocoa-village",
    name: "Masonic Temple / Village Tower",
    category: "Historic Landmark",
    summary: "Three-story brick downtown landmark and strong visual history stop.",
    priority: "featured",
    address: "315 Brevard Avenue, Cocoa, FL 32922"
  },
  {
    slug: "blair-building",
    destinationSlug: "cocoa-village",
    name: "Blair Building",
    category: "Historic Landmark",
    summary: "Historic commercial building in the downtown walking-tour cluster.",
    priority: "standard"
  },
  {
    slug: "brevard-county-state-bank",
    destinationSlug: "cocoa-village",
    name: "Brevard County State Bank Building",
    category: "Historic Landmark",
    summary: "Historic bank building and commercial anchor near the village core.",
    priority: "featured"
  },
  {
    slug: "historic-cocoa-village-playhouse",
    destinationSlug: "cocoa-village",
    name: "Historic Cocoa Village Playhouse",
    category: "Entertainment",
    summary: "Major theatre anchor that opened as the Aladdin Theatre in 1924.",
    priority: "featured",
    address: "300 Brevard Avenue, Cocoa, FL 32922",
    sourceUrl: "https://cocoavillageplayhouse.com/about/history"
  },
  {
    slug: "cocoa-riverfront-park",
    destinationSlug: "cocoa-village",
    name: "Cocoa Riverfront Park",
    category: "Waterfront",
    summary: "Riverfront park with views, playground, pavilions, amphitheater, and walking areas.",
    priority: "featured",
    address: "401 Riveredge Boulevard, Cocoa, FL 32922",
    sourceUrl: "https://cocoafl.gov/Facilities/Facility/Details/4"
  },
  {
    slug: "taylor-park",
    destinationSlug: "cocoa-village",
    name: "Taylor Park",
    category: "Family",
    summary: "Shaded downtown park that works as a family-friendly rest point.",
    priority: "standard"
  },
  {
    slug: "lee-wenner-park",
    destinationSlug: "cocoa-village",
    name: "Lee Wenner Park",
    category: "Waterfront",
    summary: "Waterfront access point for boating-oriented visitors near the village.",
    priority: "standard"
  },
  {
    slug: "myrt-tharpe-square",
    destinationSlug: "cocoa-village",
    name: "Myrt Tharpe Square",
    category: "Events",
    summary: "Central gathering space used for markets and village programming.",
    priority: "featured"
  },
  {
    slug: "riverfront-amphitheater",
    destinationSlug: "cocoa-village",
    name: "Cocoa Riverfront Amphitheater",
    category: "Entertainment",
    summary: "Outdoor concert and community event venue facing the Indian River.",
    priority: "featured",
    sourceUrl: "https://cocoafl.gov/Facilities/Facility/Details/4"
  },
  {
    slug: "riverfront-boardwalk",
    destinationSlug: "cocoa-village",
    name: "Cocoa Riverfront Boardwalk",
    category: "Waterfront",
    summary: "Scenic walking and photo corridor along the Indian River.",
    priority: "featured"
  },
  {
    slug: "cocoa-civic-center",
    destinationSlug: "cocoa-village",
    name: "Cocoa Civic Center",
    category: "Events",
    summary: "Civic and event venue facing the riverfront park system.",
    priority: "standard",
    address: "430 Delannoy Avenue, Cocoa, FL 32922"
  },
  {
    slug: "library-of-florida-history",
    destinationSlug: "cocoa-village",
    name: "Library of Florida History",
    category: "Historic Landmark",
    summary: "Florida Historical Society research library in a historic former post office.",
    priority: "standard"
  },
  {
    slug: "antilles-trading-company",
    destinationSlug: "cocoa-village",
    name: "Antilles Trading Company Maritime Pirate Museum and Store",
    category: "Family",
    summary: "Small maritime and pirate-themed museum/store for family discovery.",
    priority: "dynamic"
  },
  {
    slug: "public-street-art",
    destinationSlug: "cocoa-village",
    name: "Cocoa Village Public Street Art",
    category: "Arts & Culture",
    summary: "Murals and public art including the Art Deco crosswalk near the Playhouse.",
    priority: "featured"
  },
  {
    slug: "past-and-presence-ghost-tours",
    destinationSlug: "cocoa-village",
    name: "Past and Presence Historic Ghost Tours",
    category: "Nightlife",
    summary: "Evening guided history and ghost-tour offering in the village.",
    priority: "dynamic"
  },
  {
    slug: "historic-walking-tour-route",
    destinationSlug: "cocoa-village",
    name: "Historic Walking Tour Route",
    category: "Historic Landmark",
    summary: "Official 11-landmark route, less than one mile, starting at Porcher House.",
    priority: "featured",
    sourceUrl: "https://visitcocoavillage.com/discover/historic-walking-tour"
  },
  {
    slug: "brevard-avenue",
    destinationSlug: "cocoa-village",
    name: "Brevard Avenue",
    category: "Shopping",
    summary: "Core pedestrian corridor for theatre, dining, shops, galleries, and historic facades.",
    priority: "featured"
  },
  {
    slug: "delannoy-avenue",
    destinationSlug: "cocoa-village",
    name: "Delannoy Avenue",
    category: "Historic Landmark",
    summary: "Historic street connecting Porcher House, civic spaces, and restored architecture.",
    priority: "featured"
  },
  {
    slug: "harrison-street-area",
    destinationSlug: "cocoa-village",
    name: "Harrison Street Area",
    category: "Food",
    summary: "Dining and historic-district connector between the commercial core and riverfront.",
    priority: "dynamic"
  },
  {
    slug: "derby-street-historic-area",
    destinationSlug: "cocoa-village",
    name: "Derby Street Historic Area",
    category: "Historic Landmark",
    summary: "Architecture and walking area around Derby Street Chapel.",
    priority: "standard"
  },
  {
    slug: "cocoa-village-marina",
    destinationSlug: "cocoa-village",
    name: "Cocoa Village Marina",
    category: "Waterfront",
    summary: "Boating and Indian River access connected to the village visit.",
    priority: "dynamic"
  },
  {
    slug: "historic-lawndale-museum",
    destinationSlug: "cocoa-village",
    name: "Historic Lawndale Museum - H.S. Williams Home",
    category: "Nearby Extension",
    summary: "Nearby historic home museum recommended as an extension south of the village.",
    priority: "standard",
    address: "1219 Rockledge Drive, Rockledge, FL 32955"
  },
  {
    slug: "indian-river-lagoon-viewpoint",
    destinationSlug: "cocoa-village",
    name: "Indian River Lagoon Viewpoint",
    category: "Waterfront",
    summary: "Scenic river view for sunrise, wildlife, boating, and quiet photo moments.",
    priority: "featured"
  }
];

export const tours: TourDetail[] = [
  {
    slug: "cocoa-village-historic-explorer",
    title: "Cocoa Village Historic Explorer",
    destinationSlug: "cocoa-village",
    destinationName: "Cocoa Village",
    summary: "A compact walking introduction to Cocoa Village's official historic-tour anchor, storefronts, civic spaces, art, and riverfront edges.",
    description: "Start at Porcher House, follow a short historic village loop, and leave room for shops, food, public art, and the Indian River waterfront.",
    categories: ["History", "Food", "Arts & Culture", "Family"],
    transportMode: "Walking",
    durationMinutes: 60,
    distanceMiles: 1.2,
    stopCount: 10,
    priceLabel: "Free",
    difficulty: "Easy",
    startLocation: "Porcher House, 434 Delannoy Avenue",
    accessibilitySummary: "Sidewalk-focused route; curb cuts, construction, and surface conditions must be verified before pilot publication.",
    imageUrl: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Historic street with warm storefront lighting",
    highlights: ["Official walking-tour anchor", "Historic downtown", "Local shops", "Riverfront finish"],
    safetyNotes: ["Use marked crossings where available.", "Check sidewalk, curb, weather, and traffic conditions before starting."],
    startPoint: {
      title: "Porcher House",
      address: "434 Delannoy Avenue, Cocoa, FL 32922",
      landmark: "Begin outside Porcher House, the official start of Cocoa Village's self-guided historic walking tour.",
      arrivalTips: [
        "Arrive with a charged phone and check weather before leaving your vehicle.",
        "Look for the historic walking-tour markers and follow each stop in order.",
        "If downtown streets are closed for an event, start from the nearest open public sidewalk and continue manually."
      ],
      parkingNotes: [
        "Public parking is available around downtown Cocoa Village.",
        "Paper maps and information are listed as available inside Porcher House on weekdays, excluding holidays.",
        "Allow extra time on event days because downtown streets and parking patterns may change."
      ],
      accessibilityNotes: [
        "This is a sidewalk-focused walking route with curb cuts and surfaces that still need field verification.",
        "Manual stop completion is always available if GPS signal is weak or the route needs an accessibility detour."
      ]
    },
    staticRouteSummary: "A compact historic village loop beginning at Porcher House and finishing near the Indian River waterfront.",
    routeGeometry: {
      type: "LineString",
      coordinates: [
        { latitude: 28.3625, longitude: -80.72556 },
        { latitude: 28.36314, longitude: -80.72555 },
        { latitude: 28.36282, longitude: -80.7244 },
        { latitude: 28.36214, longitude: -80.72414 },
        { latitude: 28.36143, longitude: -80.72472 },
        { latitude: 28.36072, longitude: -80.72483 },
        { latitude: 28.36013, longitude: -80.72543 },
        { latitude: 28.36003, longitude: -80.72631 },
        { latitude: 28.3606, longitude: -80.72725 },
        { latitude: 28.36145, longitude: -80.7272 }
      ]
    },
    stops: [
      { sequence: 1, slug: "porcher-house", title: "Porcher House", summary: "Start at the official historic walking-tour anchor on Delannoy Avenue.", visitorStory: "Take a minute to get oriented outside Porcher House. This is the right mental starting point for Cocoa Village: civic history, preserved architecture, and a compact walkable downtown all meeting in one place.", location: { latitude: 28.3625, longitude: -80.72556 }, triggerRadiusMeters: 35, exitRadiusMeters: 60 },
      { sequence: 2, slug: "parrish-grove-inn", title: "Parrish Grove Inn", summary: "Notice restored historic lodging and the village's residential scale.", visitorStory: "Look at how the quieter Delannoy Avenue fabric differs from the busier storefront streets. Cocoa Village works because it still has these smaller historic layers tucked into the walk.", internalEditorialState: "needs_fact_check", location: { latitude: 28.36314, longitude: -80.72555 }, triggerRadiusMeters: 35, exitRadiusMeters: 60 },
      { sequence: 3, slug: "sf-travis-company", title: "S.F. Travis Company", summary: "Pause near a long-running local business tied to Cocoa's commerce history.", visitorStory: "This stop connects the village to practical trade: hardware, supplies, repairs, and the everyday work that helped build a river town before the Space Coast boom.", internalEditorialState: "needs_fact_check", location: { latitude: 28.36282, longitude: -80.7244 }, triggerRadiusMeters: 35, exitRadiusMeters: 60 },
      { sequence: 4, slug: "historic-bank-corner", title: "Historic Bank Corner", summary: "Read the commercial core through older downtown architecture.", visitorStory: "Slow down and scan upper stories, brickwork, signs, and corner entries. Commercial buildings often tell the village story as clearly as plaques do.", internalEditorialState: "needs_fact_check", location: { latitude: 28.36214, longitude: -80.72414 }, triggerRadiusMeters: 35, exitRadiusMeters: 60 },
      { sequence: 5, slug: "village-tower", title: "Village Tower", summary: "Use the former Masonic Temple area as a visual history stop.", visitorStory: "This is a good place to look upward. A three-story brick landmark changes the scale of the street and gives the village one of its memorable historic silhouettes.", internalEditorialState: "needs_fact_check", location: { latitude: 28.36143, longitude: -80.72472 }, triggerRadiusMeters: 35, exitRadiusMeters: 60 },
      { sequence: 6, slug: "playhouse-and-street-art", title: "Playhouse and Street Art", summary: "Connect theatre history with Cocoa Village's public art layer.", visitorStory: "The Playhouse is one of the village's strongest anchors, and the nearby street art makes this a natural photo pause. Notice how old entertainment architecture and present-day public art share the same street.", location: { latitude: 28.36072, longitude: -80.72483 }, triggerRadiusMeters: 35, exitRadiusMeters: 60 },
      { sequence: 7, slug: "myrt-tharpe-square", title: "Myrt Tharpe Square", summary: "Step into a central gathering space for markets and events.", visitorStory: "This stop is about Cocoa Village as a living calendar, not a museum. Markets, concerts, fairs, and seasonal events can change the feel of the same blocks from week to week.", location: { latitude: 28.36013, longitude: -80.72543 }, triggerRadiusMeters: 35, exitRadiusMeters: 60 },
      { sequence: 8, slug: "brevard-avenue-storefronts", title: "Brevard Avenue Storefronts", summary: "Browse the main pedestrian corridor for shops, restaurants, and galleries.", visitorStory: "Let the storefronts do some of the guiding. Menus, gallery windows, shop displays, and sidewalk activity are part of the experience, and they are exactly why business data should stay dynamic.", location: { latitude: 28.36003, longitude: -80.72631 }, triggerRadiusMeters: 35, exitRadiusMeters: 60 },
      { sequence: 9, slug: "riverfront-park-and-boardwalk", title: "Riverfront Park and Boardwalk", summary: "Move toward Indian River views, amphitheater space, and waterfront air.", visitorStory: "The route opens up here. After the tight downtown blocks, the riverfront gives you space, breeze, playground energy, event lawns, and a stronger sense of why Cocoa grew along this edge.", location: { latitude: 28.3606, longitude: -80.72725 }, triggerRadiusMeters: 35, exitRadiusMeters: 60 },
      { sequence: 10, slug: "indian-river-finish", title: "Indian River Finish", summary: "End with a scenic pause and decide what to do next.", visitorStory: "Finish with the water in view. From here, the best next move might be lunch, a shop loop, an event, a museum extension, or simply a slower walk back through the village.", location: { latitude: 28.36145, longitude: -80.7272 }, triggerRadiusMeters: 35, exitRadiusMeters: 60 }
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

export function destinationPoiCluster(slug: string): DestinationPoi[] {
  return destinationPois.filter((poi) => poi.destinationSlug === slug);
}

export function featuredDestinationPois(slug: string): DestinationPoi[] {
  return destinationPoiCluster(slug).filter((poi) => poi.priority === "featured");
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
