export const translations = {
  en: {
    // Header
    bookings: "Bookings",
    manageBookings: "Manage and view all your bookings",
    
    // Stats
    totalBookings: "Total Bookings",
    confirmed: "Confirmed",
    pending: "Pending",
    cancelled: "Cancelled",
    
    // Booking details
    bookingDate: "Booking Date",
    numberOfPeople: "Number of People",
    person: "person",
    people: "people",
    email: "Email",
    phone: "Phone",
    notes: "Notes",
    
    // Booking types
    guide: "Guide",
    music: "Music Show",
    workshop: "Workshop",
    
    // Status
    status: "Status",
    
    // Empty state
    noBookings: "No bookings found for your email address.",
    noBookingsHint: "Make sure your email is set in your guide, experience, or hotel profile.",
    
    // Loading
    loading: "Loading...",
    
    // Error
    error: "Error",
    
    // Language toggle
    changeLanguage: "Change language",
  },
  hi: {
    // Header
    bookings: "बुकिंग",
    manageBookings: "अपनी सभी बुकिंग देखें और प्रबंधित करें",
    
    // Stats
    totalBookings: "कुल बुकिंग",
    confirmed: "पुष्ट",
    pending: "लंबित",
    cancelled: "रद्द",
    
    // Booking details
    bookingDate: "बुकिंग की तारीख",
    numberOfPeople: "लोगों की संख्या",
    person: "व्यक्ति",
    people: "लोग",
    email: "ईमेल",
    phone: "फोन",
    notes: "नोट्स",
    
    // Booking types
    guide: "गाइड",
    music: "संगीत शो",
    workshop: "कार्यशाला",
    
    // Status
    status: "स्थिति",
    
    // Empty state
    noBookings: "आपके ईमेल पते के लिए कोई बुकिंग नहीं मिली।",
    noBookingsHint: "सुनिश्चित करें कि आपका ईमेल आपके गाइड, अनुभव या होटल प्रोफ़ाइल में सेट है।",
    
    // Loading
    loading: "लोड हो रहा है...",
    
    // Error
    error: "त्रुटि",
    
    // Language toggle
    changeLanguage: "भाषा बदलें",
  },
};

export type Language = "en" | "hi";
export type TranslationKey = keyof typeof translations.en;
