// import { TOUR_GUIDES } from "./tour-guides"

export type ExperienceType = "guide" | "music" | "workshop"

export interface BaseExperience {
  id: number
  type: ExperienceType
  name: string
  image: string
  sites: number[]
  rating: number
  reviews: number // TODO: should be a list of reviews
  price: number
  description: string
}

export interface GuideExperience extends BaseExperience {
  type: "guide"
  specialization: string
  languages: string[]
  experience: number
  bio: string
  certifications: string[]
  topReviews: Array<{ 
    author: string; 
    rating: number; 
    text: string; 
    date: string 
  }>
}

export interface MusicShowExperience extends BaseExperience {
  type: "music"
  duration: string
  venue: string
  performers: string[]
  genre: string
  schedule: string[]
}

export interface WorkshopExperience extends BaseExperience {
  type: "workshop"
  duration: string
  instructor: string
  skillLevel: "beginner" | "intermediate" | "advanced"
  materialsIncluded: boolean
  maxParticipants: number
  topics: string[]
}

export type Experience = GuideExperience | MusicShowExperience | WorkshopExperience

// // Convert guides to experiences
// const guideExperiences: GuideExperience[] = TOUR_GUIDES.map((guide) => ({
//   id: guide.id,
//   type: "guide" as const,
//   name: guide.name,
//   image: guide.image,
//   sites: guide.sites,
//   rating: guide.rating,
//   reviews: guide.reviews,
//   price: guide.pricePerDay,
//   description: guide.bio,
//   specialization: guide.specialization,
//   languages: guide.languages,
//   experience: guide.experience,
//   bio: guide.bio,
//   certifications: guide.certifications,
//   topReviews: guide.topReviews,
// }))

// // Music show experiences
// const musicShowExperiences: MusicShowExperience[] = [
//   {
//     id: 101,
//     type: "music",
//     name: "Classical Indian Music at Taj Mahal",
//     image: "/placeholder.svg?key=music1",
//     sites: [1],
//     rating: 4.8,
//     reviews: 142,
//     price: 45,
//     description:
//       "Experience the soul-stirring sounds of classical Indian music performed by renowned musicians in the shadow of the Taj Mahal. This evening performance features traditional ragas and instruments.",
//     duration: "90 minutes",
//     venue: "Taj Mahal Gardens",
//     performers: ["Rajesh Kumar (Sitar)", "Priya Devi (Tabla)", "Amit Sharma (Vocal)"],
//     genre: "Hindustani Classical",
//     schedule: ["Daily at 6:00 PM", "Special performances on weekends"],
//   },
//   {
//     id: 102,
//     type: "music",
//     name: "Incan Flute & Andean Music Experience",
//     image: "/placeholder.svg?key=music2",
//     sites: [2],
//     rating: 4.7,
//     reviews: 98,
//     price: 35,
//     description:
//       "Listen to authentic Andean music performed by local Quechua musicians. Experience traditional flutes, charangos, and panpipes in a setting overlooking the Sacred Valley.",
//     duration: "60 minutes",
//     venue: "Machu Picchu Visitor Center",
//     performers: ["Quechua Heritage Ensemble"],
//     genre: "Andean Folk",
//     schedule: ["Tuesday, Thursday, Saturday at 4:00 PM"],
//   },
//   {
//     id: 103,
//     type: "music",
//     name: "Roman Gladiator Music & Chanting",
//     image: "/placeholder.svg?key=music3",
//     sites: [3],
//     rating: 4.6,
//     reviews: 203,
//     price: 40,
//     description:
//       "Experience the sounds of ancient Rome with historical reenactments of gladiator chants, Roman military music, and classical performances in the Colosseum's underground chambers.",
//     duration: "75 minutes",
//     venue: "Colosseum Underground",
//     performers: ["Roma Antica Ensemble", "Historical Reenactment Group"],
//     genre: "Historical Classical",
//     schedule: ["Wednesday, Friday, Sunday at 7:00 PM"],
//   },
//   {
//     id: 104,
//     type: "music",
//     name: "Traditional Chinese Opera & Folk Music",
//     image: "/placeholder.svg?key=music4",
//     sites: [4],
//     rating: 4.5,
//     reviews: 156,
//     price: 50,
//     description:
//       "Enjoy traditional Chinese opera and folk music performances featuring ancient instruments like the erhu, pipa, and guzheng, performed at a historic watchtower along the Great Wall.",
//     duration: "90 minutes",
//     venue: "Great Wall Watchtower",
//     performers: ["Beijing Opera Troupe", "Folk Music Ensemble"],
//     genre: "Chinese Opera & Folk",
//     schedule: ["Daily at 5:30 PM during peak season"],
//   },
// ]

// // Workshop experiences
// const workshopExperiences: WorkshopExperience[] = [
//   {
//     id: 201,
//     type: "workshop",
//     name: "Marble Inlay Art Workshop",
//     image: "/placeholder.svg?key=workshop1",
//     sites: [1],
//     rating: 4.9,
//     reviews: 87,
//     price: 120,
//     description:
//       "Learn the ancient art of marble inlay (Pietra Dura) used in the Taj Mahal. Master craftspeople will teach you techniques for creating intricate patterns with semi-precious stones.",
//     duration: "4 hours",
//     instructor: "Master Craftsman Ahmed Khan",
//     skillLevel: "beginner",
//     materialsIncluded: true,
//     maxParticipants: 12,
//     topics: ["Stone cutting", "Pattern design", "Inlay techniques", "Finishing and polishing"],
//   },
//   {
//     id: 202,
//     type: "workshop",
//     name: "Traditional Textile Weaving",
//     image: "/placeholder.svg?key=workshop2",
//     sites: [2],
//     rating: 4.7,
//     reviews: 64,
//     price: 85,
//     description:
//       "Join local Quechua weavers to learn traditional Andean textile techniques. Create your own woven piece using ancient patterns and natural dyes from the region.",
//     duration: "3 hours",
//     instructor: "Master Weaver Maria Quispe",
//     skillLevel: "beginner",
//     materialsIncluded: true,
//     maxParticipants: 10,
//     topics: ["Loom setup", "Traditional patterns", "Natural dyeing", "Finishing techniques"],
//   },
//   {
//     id: 203,
//     type: "workshop",
//     name: "Roman Mosaic Making",
//     image: "/placeholder.svg?key=workshop3",
//     sites: [3],
//     rating: 4.8,
//     reviews: 112,
//     price: 95,
//     description:
//       "Create your own Roman-style mosaic using traditional techniques. Learn about ancient Roman art and craft a small mosaic piece to take home as a souvenir.",
//     duration: "3.5 hours",
//     instructor: "Archaeologist & Artist Dr. Elena Rossi",
//     skillLevel: "intermediate",
//     materialsIncluded: true,
//     maxParticipants: 15,
//     topics: ["Roman mosaic history", "Tile cutting", "Pattern design", "Grouting and finishing"],
//   },
//   {
//     id: 204,
//     type: "workshop",
//     name: "Chinese Calligraphy & Ink Painting",
//     image: "/placeholder.svg?key=workshop4",
//     sites: [4],
//     rating: 4.6,
//     reviews: 93,
//     price: 75,
//     description:
//       "Learn the ancient art of Chinese calligraphy and ink painting from a master artist. Discover the philosophy behind brush strokes and create your own artwork.",
//     duration: "2.5 hours",
//     instructor: "Master Calligrapher Li Wei",
//     skillLevel: "beginner",
//     materialsIncluded: true,
//     maxParticipants: 12,
//     topics: ["Brush techniques", "Character structure", "Ink painting basics", "Composition"],
//   },
//   {
//     id: 205,
//     type: "workshop",
//     name: "Traditional Pottery & Ceramics",
//     image: "/placeholder.svg?key=workshop5",
//     sites: [1],
//     rating: 4.7,
//     reviews: 71,
//     price: 90,
//     description:
//       "Experience the traditional pottery techniques used in Indian heritage sites. Learn wheel throwing, glazing, and firing methods from skilled artisans.",
//     duration: "4 hours",
//     instructor: "Master Potter Ramesh Kumar",
//     skillLevel: "beginner",
//     materialsIncluded: true,
//     maxParticipants: 10,
//     topics: ["Clay preparation", "Wheel throwing", "Glazing techniques", "Kiln firing"],
//   },
// ]

// export const EXPERIENCES: Experience[] = [...guideExperiences, ...musicShowExperiences, ...workshopExperiences]

// export const EXPERIENCES_BY_TYPE: Record<ExperienceType, Experience[]> = {
//   guide: guideExperiences,
//   music: musicShowExperiences,
//   workshop: workshopExperiences,
// }

