import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Calendar, Hotel, Utensils, MapPin, Plane, Clock, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/core/components/navigation";
import { useFeaturedTrips, type Trip } from "@/lib/api";

const TripPlanner = () => {
  const [showCustomPlanner, setShowCustomPlanner] = useState(false);
  const [selectedMonuments, setSelectedMonuments] = useState<string[]>([]);

  // Fetch featured trips from API
  const { data: featuredTripsData, isLoading, error } = useFeaturedTrips();

  const monuments = [
    { id: "taj-mahal", name: "Taj Mahal", location: "Agra" },
    { id: "red-fort", name: "Red Fort", location: "Delhi" },
    { id: "qutub-minar", name: "Qutub Minar", location: "Delhi" },
    { id: "humayuns-tomb", name: "Humayun's Tomb", location: "Delhi" },
    { id: "lotus-temple", name: "Lotus Temple", location: "Delhi" },
  ];

  const toggleMonument = (id: string) => {
    setSelectedMonuments(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  if (!showCustomPlanner) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />

        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Trip Planner
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Choose from our curated heritage trips or create your own personalized itinerary
            </p>
          </div>

          {/* Premade Trips Grid */}
          <div className="mb-12">
            <h2 className="text-2xl  font-bold text-foreground mb-6">Featured Heritage Trips</h2>

            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading featured trips...</span>
              </div>
            )}

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
                <p className="text-destructive">Error loading trips: {error.message}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Please make sure the backend API is running and accessible.
                </p>
              </div>
            )}

            {!isLoading && !error && featuredTripsData && (
              <>
                {featuredTripsData.trips.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No featured trips available. Run the seed script to add trips.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {featuredTripsData.trips.map((trip: Trip) => (
                      <Link key={trip._id} to={`/trip-planner/${trip._id}`}>
                        <Card className="h-full hover:shadow-lg transition-all cursor-pointer group">
                          <div className="relative h-48 overflow-hidden rounded-t-lg">
                            <img
                              src={trip.image || "/placeholder.jpg"}
                              alt={trip.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <Badge className="absolute top-3 right-3 bg-primary/90 text-primary-foreground">
                              {trip.budget}
                            </Badge>
                          </div>
                          <CardContent className="p-4">
                            <h3 className=" font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                              {trip.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">{trip.location}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {trip.duration}
                              </div>
                            </div>
                            <p className="text-sm text-foreground line-clamp-2 mb-3">{trip.description}</p>
                            <div className="flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
                              View Itinerary
                              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* CTA to Create Custom Trip */}
          <Card className="from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl  font-bold text-foreground mb-2">
                Want Something Different?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Create your own personalized heritage itinerary with our AI-powered trip planner.
                Select monuments, choose preferences, and get a custom day-by-day plan tailored to your interests.
              </p>
              <Button
                size="lg"
                onClick={() => setShowCustomPlanner(true)}
                className="bg-primary hover:bg-primary/90 px-8"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Create Your Own Trip
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                AI Trip Planner
              </h1>
            </div>
            <Button variant="outline" onClick={() => setShowCustomPlanner(false)}>
              View Premade Trips
            </Button>
          </div>
          <p className="text-lg text-muted-foreground">
            Let our AI create the perfect heritage itinerary with monuments, hotels, restaurants, and local experiences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Monument Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Select Heritage Sites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3">
                  {monuments.map((monument) => (
                    <button
                      key={monument.id}
                      onClick={() => toggleMonument(monument.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${selectedMonuments.includes(monument.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                        }`}
                    >
                      <p className="font-semibold text-foreground">{monument.name}</p>
                      <p className="text-sm text-muted-foreground">{monument.location}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trip Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Your Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Duration</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["2 Days", "3 Days", "5 Days"].map((duration) => (
                      <Button key={duration} variant="outline" className="w-full">
                        {duration}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Budget Range</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Budget", "Moderate", "Luxury"].map((budget) => (
                      <Button key={budget} variant="outline" className="w-full">
                        {budget}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Interests</label>
                  <div className="flex flex-wrap gap-2">
                    {["Architecture", "History", "Photography", "Culture", "Food"].map((interest) => (
                      <Badge key={interest} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button size="lg" className="w-full h-14 text-lg bg-primary hover:bg-primary/90">
              <Sparkles className="mr-2 h-5 w-5" />
              Generate Personalized Itinerary
            </Button>
          </div>

          {/* Features Sidebar */}
          <div className="space-y-4">
            <Card className="from-heritage-terracotta/10 to-heritage-gold/10 border-primary/20">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 text-foreground">What's Included</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Hotel className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Heritage Hotels</p>
                      <p className="text-xs text-muted-foreground">Curated stays near monuments</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Utensils className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Local Cuisine</p>
                      <p className="text-xs text-muted-foreground">Authentic dining experiences</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Cultural Events</p>
                      <p className="text-xs text-muted-foreground">Traditional performances & crafts</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Optimized Schedule</p>
                      <p className="text-xs text-muted-foreground">Smart timing for best experience</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Plane className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Travel Arrangements</p>
                      <p className="text-xs text-muted-foreground">Flight & transport suggestions</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-sm mb-2">Bundled Experiences</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Save time with curated packages combining monument visits, cultural events, and traditional meals
                </p>
                <Badge variant="secondary" className="text-xs">
                  Coming Soon
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripPlanner;