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
    imageUrl: "/images/cocoa-village/landmarks/porcher-house.jpg",
    imageAlt: "Porcher House in Cocoa Village with palms and a front lawn"
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
    description: [
      "Porcher House gives the village route a strong beginning because it connects civic history, local citrus wealth, architecture, and preservation in one place.",
      "The house was completed in 1916 for Edward and Byrdie Porcher and is known for its coquina construction, classical revival character, and later public uses including City Hall. Today it works as both a landmark and an orientation point for the downtown walking-tour story."
    ],
    imageUrl: "/images/cocoa-village/landmarks/porcher-house.jpg",
    imageAlt: "Porcher House facade with columns, coquina walls, and palms",
    priority: "featured",
    address: "434 Delannoy Avenue, Cocoa, FL 32922",
    sourceUrl: "https://visitcocoavillage.com/discover/porcher-house"
  },
  {
    slug: "parrish-grove-inn",
    destinationSlug: "cocoa-village",
    name: "The Parrish Grove Inn",
    category: "Historic Landmark",
    summary: "Historic restored lodging property on Delannoy Avenue.",
    description: [
      "The Parrish Grove Inn helps visitors see Cocoa Village at a more residential scale. It sits close to the shops, restaurants, and riverfront, but its restored lodging character gives the route a quieter historic rhythm.",
      "Use this stop to notice porches, rooflines, garden edges, and how older homes near downtown can become part of the visitor economy without losing their sense of place."
    ],
    imageUrl: "/images/cocoa-village/landmarks/parrish-grove-inn.jpg",
    imageAlt: "Parrish Grove Inn and historic Pette House with wraparound porch and palm trees",
    priority: "featured",
    address: "536 Delannoy Avenue, Cocoa, FL 32922",
    sourceUrl: "https://www.theparrishgroveinn.com/our-story/"
  },
  {
    slug: "sur-le-parc",
    destinationSlug: "cocoa-village",
    name: "Sur Le Parc",
    category: "Historic Landmark",
    summary: "One of the historic structures connected to the village walking-tour story.",
    description: [
      "Sur Le Parc works as a small architectural pause in the historic walking-tour cluster. It is less about a single dramatic monument and more about reading the village as a collection of preserved buildings.",
      "This kind of stop helps the experience slow down: look for materials, proportions, entries, and the way historic structures frame the walking streets around them."
    ],
    imageUrl: "/images/cocoa-village/landmarks/sur-le-parc.jpg",
    imageAlt: "Historic black-and-white view of the Sur Le Parc building in Cocoa Village",
    priority: "standard"
  },
  {
    slug: "st-marks-episcopal-church",
    destinationSlug: "cocoa-village",
    name: "St. Mark's Episcopal Church",
    category: "Historic Landmark",
    summary: "Historic church and community landmark within the village district.",
    description: [
      "St. Mark's gives the route a community anchor. Churches in historic downtowns often tell a parallel story to storefronts: settlement, gathering, service, education, and continuity.",
      "As a visitor stop, it is a good place to notice how the village is not only commercial. Its older civic and faith buildings help explain why Cocoa Village still feels layered rather than newly manufactured."
    ],
    imageUrl: "/images/cocoa-village/landmarks/st-marks-episcopal-church.jpg",
    imageAlt: "St. Mark's Episcopal Church and Academy across a brick crosswalk",
    priority: "standard"
  },
  {
    slug: "hindle-building",
    destinationSlug: "cocoa-village",
    name: "Hindle Building",
    category: "Historic Landmark",
    summary: "Historic downtown commercial architecture along the walking-tour corridor.",
    description: [
      "The Hindle Building adds a useful commercial-history layer to the walk. Its early uses included an ice cream parlor, soda shop, and restaurant, followed by decades of pharmacy use.",
      "Pause here to read the building like a timeline: upper-story proportions, street-level storefront changes, and durable downtown construction all point to a village built for everyday business."
    ],
    priority: "standard",
    sourceUrl: "https://visitcocoavillage.com/discover/hindle-building"
  },
  {
    slug: "derby-street-chapel",
    destinationSlug: "cocoa-village",
    name: "Derby Street Chapel",
    category: "Historic Landmark",
    summary: "Preserved Craftsman chapel in the Derby Street historic area.",
    description: [
      "Derby Street Chapel brings a quieter neighborhood texture into the visitor route. Built between 1916 and 1920, it moved through several church chapters before becoming a small-event venue.",
      "The chapel is useful for visitors because it shows preservation at a human scale: modest, walkable, and closely tied to the surrounding street rather than isolated behind a large campus."
    ],
    imageUrl: "/images/cocoa-village/landmarks/derby-street-chapel.jpg",
    imageAlt: "Historic Derby Street Chapel with marker sign and shaded sidewalk",
    priority: "standard",
    address: "121 Derby Street, Cocoa, FL 32922",
    sourceUrl: "https://visitcocoavillage.com/discover/derby-street-chapel"
  },
  {
    slug: "sf-travis-company",
    destinationSlug: "cocoa-village",
    name: "S.F. Travis Company",
    category: "Historic Landmark",
    summary: "Long-running local hardware business tied to Cocoa's commerce history.",
    description: [
      "S.F. Travis Company is one of the strongest commerce stories in Cocoa Village. Founded in 1885, it is described locally as Cocoa's oldest continuously operating business and one of Florida's oldest hardware stores.",
      "The building connects early river trade, practical supplies, construction, and later Space Coast growth. For a visitor, it is a reminder that historic districts were working places before they became leisure destinations."
    ],
    imageUrl: "/images/cocoa-village/landmarks/sf-travis-company.jpg",
    imageAlt: "S.F. Travis Company storefront with historic brickwork and red awning",
    priority: "featured",
    sourceUrl: "https://visitcocoavillage.com/discover/s-f-travis-company"
  },
  {
    slug: "village-tower-masonic-temple",
    destinationSlug: "cocoa-village",
    name: "Masonic Temple / Village Tower",
    category: "Historic Landmark",
    summary: "Three-story brick downtown landmark and strong visual history stop.",
    description: [
      "The Village Tower gives the walking route vertical drama. In a mostly low-rise downtown, a three-story brick landmark changes the scale of the street and becomes an easy visual reference point.",
      "Use this stop to look upward and compare the building with nearby storefronts. The contrast helps visitors understand how civic, fraternal, and commercial buildings shaped the village skyline."
    ],
    imageUrl: "/images/cocoa-village/landmarks/village-tower-masonic-temple.jpg",
    imageAlt: "Village Tower and former Masonic Temple brick facade in Cocoa Village",
    priority: "featured",
    address: "315 Brevard Avenue, Cocoa, FL 32922"
  },
  {
    slug: "blair-building",
    destinationSlug: "cocoa-village",
    name: "Blair Building",
    category: "Historic Landmark",
    summary: "Historic commercial building in the downtown walking-tour cluster.",
    description: [
      "The Blair Building is part of the dense commercial fabric that makes Cocoa Village rewarding on foot. It sits best in the visitor story as one more storefront-era layer rather than as a standalone attraction.",
      "Look for facade rhythm, window placement, and how adjacent businesses reuse older buildings. This is the kind of landmark that teaches visitors to read the block, not only the sign."
    ],
    priority: "standard"
  },
  {
    slug: "brevard-county-state-bank",
    destinationSlug: "cocoa-village",
    name: "Brevard County State Bank Building",
    category: "Historic Landmark",
    summary: "Historic bank building and commercial anchor near the village core.",
    description: [
      "The Brevard County State Bank Building marks a major early finance story for Cocoa. Completed in 1893, the building housed a bank that helped fund growth across the young community.",
      "Even after banking activity ended, the structure stayed part of downtown life through shops, restaurants, and other uses. Visitors can still use the corner to understand how money, trade, and architecture clustered near the village core."
    ],
    imageUrl: "/images/cocoa-village/landmarks/brevard-county-state-bank.jpg",
    imageAlt: "Historic Brevard County State Bank entrance with columns and early automobiles",
    priority: "featured",
    sourceUrl: "https://visitcocoavillage.com/discover/brevard-county-state-bank"
  },
  {
    slug: "historic-cocoa-village-playhouse",
    destinationSlug: "cocoa-village",
    name: "Historic Cocoa Village Playhouse",
    category: "Entertainment",
    summary: "Major theatre anchor that opened as the Aladdin Theatre in 1924.",
    description: [
      "The Historic Cocoa Village Playhouse adds entertainment history to the route. It opened in 1924 as the Aladdin Theatre and later became a community theatre anchor known locally as Broadway on Brevard.",
      "For visitors, the building connects architecture, performing arts, youth programming, restoration, and downtown nightlife. It also pairs naturally with nearby street art and restaurant stops."
    ],
    imageUrl: "/images/cocoa-village/landmarks/historic-cocoa-village-playhouse.jpg",
    imageAlt: "Historic Cocoa Village Playhouse brick facade and painted crosswalk",
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
    description: [
      "Cocoa Riverfront Park opens the village walk toward the Indian River. After the compact downtown blocks, the promenade gives visitors water views, benches, open lawn, and a more relaxed pace.",
      "This is a useful pause point for families and first-time visitors because it connects the historic district to the waterfront setting that shaped Cocoa's early growth."
    ],
    imageUrl: "/images/cocoa-village/landmarks/cocoa-riverfront-park.jpg",
    imageAlt: "Cocoa Riverfront Park promenade beside the Indian River",
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
    description: [
      "Taylor Park is the kind of stop that makes a walking route easier to enjoy with kids or a mixed-age group. It gives the village route shade, benches, open space, and a natural place to slow down.",
      "For the visitor experience, this park matters because not every useful stop is a museum or historic facade. Rest points help people complete the walk comfortably."
    ],
    imageUrl: "/images/cocoa-village/landmarks/taylor-park.jpg",
    imageAlt: "Taylor Park entrance sign with benches, trees, and a walkway",
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
    description: [
      "Myrt Tharpe Square is one of the best places to feel Cocoa Village as a living downtown rather than only a historic district. The plaza gives the route shade, seating, music, markets, and an easy pause between landmark stops.",
      "Use this stop to read the present-day village: people gathering, storefronts around the square, event energy, and the way public space turns a walking route into a place to linger."
    ],
    imageUrl: "/images/cocoa-village/landmarks/myrt-tharpe-square.jpg",
    imageAlt: "Myrt Tharpe Square entrance arch with a shaded public gathering space",
    priority: "featured"
  },
  {
    slug: "riverfront-amphitheater",
    destinationSlug: "cocoa-village",
    name: "Cocoa Riverfront Amphitheater",
    category: "Entertainment",
    summary: "Outdoor concert and community event venue facing the Indian River.",
    description: [
      "Cocoa Riverfront Amphitheater gives the village route a performance anchor at the edge of the water. It connects the walk to concerts, festivals, civic events, and the wider riverfront park system.",
      "For visitors, this stop matters because it shows how Cocoa Village uses public space today: historic streets, waterfront views, and live programming all sit close enough to become one easy downtown experience."
    ],
    imageUrl: "/images/cocoa-village/landmarks/riverfront-amphitheater.jpg",
    imageAlt: "Cocoa Riverfront Amphitheater stage with palm trees and Indian River views",
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
    description: [
      "The Cocoa Civic Center helps explain the village as a civic gathering place. Its location near the riverfront park system makes it part of the same public-space cluster as the promenade, amphitheater, and downtown events.",
      "Use this stop to understand how Cocoa Village hosts everyday community life: meetings, performances, markets, and seasonal programming all sit close to the historic commercial core."
    ],
    imageUrl: "/images/cocoa-village/landmarks/cocoa-civic-center.jpg",
    imageAlt: "City of Cocoa Civic Center entrance from the street",
    priority: "standard",
    address: "430 Delannoy Avenue, Cocoa, FL 32922"
  },
  {
    slug: "library-of-florida-history",
    destinationSlug: "cocoa-village",
    name: "Library of Florida History",
    category: "Historic Landmark",
    summary: "Florida Historical Society research library in a historic former post office.",
    description: [
      "The Library of Florida History gives the village a research-and-memory layer. Instead of being only a pretty historic building, it points visitors toward archives, records, and the work of preserving Florida stories.",
      "Its presence also helps the platform explain a larger idea: local tourism gets stronger when landmarks are backed by evidence, public history, and careful interpretation."
    ],
    imageUrl: "/images/cocoa-village/landmarks/library-of-florida-history.jpg",
    imageAlt: "Library of Florida History building shaded by large trees",
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
    description: [
      "The official Historic Cocoa Village walking tour ties the landmark cluster together. It is designed as a self-guided route of 11 historic buildings within walking distance and begins at Porcher House.",
      "For Space Coast Explorer, this route is the pilot spine: a compact path that can combine map guidance, story cards, QR-style context, completion tracking, and later audio without forcing visitors into a rigid schedule."
    ],
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
    description: [
      "Delannoy Avenue is best understood as a connector landmark. It links Porcher House, civic spaces, lodging, commercial corners, and the route toward the heart of the village.",
      "Walking this street helps visitors feel how close the historic district really is: homes, public buildings, businesses, and riverfront access sit within a short downtown grid."
    ],
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
    description: [
      "The Derby Street Historic Area widens the story beyond the busiest retail blocks. It gives the route a calmer architectural moment around the preserved chapel and nearby older streetscape.",
      "This area is useful for pacing: visitors can step away from restaurant and shop energy, notice the neighborhood fabric, then return toward the main village core."
    ],
    priority: "standard"
  },
  {
    slug: "cocoa-village-marina",
    destinationSlug: "cocoa-village",
    name: "Cocoa Village Marina",
    category: "Waterfront",
    summary: "Boating and Indian River access connected to the village visit.",
    description: [
      "The Cocoa Village Marina gives the route a working waterfront edge. The docks make the Indian River feel close and practical, with boating activity sitting just a short walk from shops, parks, and historic streets.",
      "This is a strong photo and orientation stop because it shows why the village belongs on the river, not just near it."
    ],
    imageUrl: "/images/cocoa-village/landmarks/cocoa-village-marina.jpg",
    imageAlt: "Cocoa waterfront docks extending into the Indian River",
    priority: "dynamic"
  },
  {
    slug: "historic-lawndale-museum",
    destinationSlug: "cocoa-village",
    name: "Historic Lawndale Museum - H.S. Williams Home",
    category: "Nearby Extension",
    summary: "Nearby historic home museum recommended as an extension south of the village.",
    description: [
      "Historic Lawndale Museum works best as a nearby extension rather than a core village stop. The H.S. Williams Home adds a preserved house-museum layer for visitors who want more local history after the downtown walk.",
      "Because it sits outside the compact village loop, the app should treat it as an optional add-on with clear distance, timing, and transportation guidance before it becomes a formal route stop."
    ],
    imageUrl: "/images/cocoa-village/landmarks/historic-lawndale-museum.jpg",
    imageAlt: "Historic Lawndale Museum front porch and tower",
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
    imageUrl: "/images/cocoa-village/landmarks/porcher-house.jpg",
    imageAlt: "Porcher House, the Cocoa Village Historic Explorer start point",
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
