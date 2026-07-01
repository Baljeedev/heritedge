// Heritage Site
export interface IHeritageSite {
  _id: string
  name: string
  location: string
  city?: string
  state?: string
  country: string
  image: string
  rating: number
  reviewCount: number
  era: string
  status: "Preserved" | "Under Restoration" | "At Risk" | "Ruins"
  annualVisitors?: number
  description: string
  historicalWriteup: string
  keyFacts: string[]
  coordinates: {
    latitude: number
    longitude: number
  }
  unescoWorldHeritage?: boolean
  yearOfConstruction?: string
  creator?: string
  architecturalStyle?: string
  materials?: string[]
  createdAt: string
  updatedAt: string
}

// Guide
export interface IGuide {
  _id: string
  clerkUserId: string
  name: string
  image?: string
  video?: string
  specialization: string
  sites: string[] | IHeritageSite[]
  cities: string[] | { _id: string; name: string; state: string }[]
  rating: number
  reviewCount: number
  pricePerDay: number
  languages: string[]
  experience: number
  bio: string
  certifications: {
    name: string
    issuingAuthority: string
    certificateNumber: string
    issueDate: string
    expiryDate?: string
    verified: boolean
    verificationDate?: string
  }[]
  isIntern: boolean
  age?: number
  internshipStatus?: "pending" | "approved" | "rejected" | "completed"
  internshipTestScore?: number
  email?: string
  whatsappNumber?: string
  leadCount?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Guide Testimonial
export interface IGuideTestimonial {
  _id: string
  guideId: string | IGuide
  quote: string
  isActive: boolean
  displayOrder: number
  createdAt: string
  updatedAt: string
}

// Experience
export interface IExperience {
  _id: string
  type: "guide" | "music" | "workshop"
  name: string
  image: string
  video?: string
  sites: string[] | IHeritageSite[]
  rating: number
  reviewCount: number
  price: number
  description: string
  guideId?: string | IGuide
  // Music-specific
  duration?: string
  venue?: string
  performers?: string[]
  genre?: string
  schedule?: string[]
  // Workshop-specific
  instructor?: string
  skillLevel?: "beginner" | "intermediate" | "advanced"
  materialsIncluded?: boolean
  maxParticipants?: number
  topics?: string[]
  email?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Hotel
export interface IHotel {
  _id: string
  name: string
  chain?: string
  location: string
  city: string
  state: string
  country: string
  coordinates: {
    latitude: number
    longitude: number
  }
  images: string[]
  rating: number
  reviewCount: number
  pricePerNight: {
    min: number
    max: number
    currency: string
  }
  description: string
  amenities: string[]
  roomTypes: {
    name: string
    description: string
    pricePerNight: number
    maxOccupancy: number
    isLivingHistory: boolean
    theme?: string
  }[]
  heritageFeatures: {
    hasLivingHistoryRooms: boolean
    hasHistoryLectures: boolean
    hasCulturalMeals: boolean
    hasStorytellingEvenings: boolean
    historicalTimelinePosters?: boolean
  }
  nearbySites: string[] | IHeritageSite[]
  partnershipType: "listing" | "referral" | "premium"
  listingFee?: number
  referralFee?: number
  discountPercentage: number
  email?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Trip
export interface IDayPlan {
  day: number
  title: string
  activities: {
    time: string
    activity: string
    location: string
    description?: string
  }[]
}

export interface ITrip {
  _id: string
  clerkUserId: string
  name: string
  location: string
  duration: string
  image?: string
  description: string
  highlights: string[]
  itinerary: IDayPlan[]
  budget: "Budget" | "Moderate" | "Luxury"
  bestTimeToVisit: string
  isFeatured: boolean
  selectedSites: string[] | IHeritageSite[]
  selectedHotels: {
    hotelId: string | IHotel
    checkIn: string
    checkOut: string
    roomType?: string
  }[]
  selectedGuides: {
    guideId: string | IGuide
    date: string
    siteId: string | IHeritageSite
  }[]
  selectedExperiences: {
    experienceId: string | IExperience
    date: string
    time?: string
  }[]
  isAIGenerated: boolean
  aiPrompt?: string
  status: "draft" | "planned" | "booked" | "completed" | "cancelled"
  startDate?: string
  endDate?: string
  createdAt: string
  updatedAt: string
}

// Review
export interface IReview {
  _id: string
  clerkUserId: string
  authorName?: string
  rating: number
  comment: string
  images?: string[]
  reviewType: "site" | "guide" | "hotel" | "experience"
  targetId: string
  visitDate?: string
  helpfulCount: number
  isVerified: boolean
  isVisible: boolean
  createdAt: string
  updatedAt: string
}
