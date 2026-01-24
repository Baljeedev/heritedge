import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Calendar, Utensils, MapPin, Plane, Clock, ArrowRight, Loader2, AlertCircle, Star, Check, Hotel } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navigation } from "@/core/components/navigation";
import { useFeaturedTrips, type Trip, useHeritageSites, tripsApi, useTrips, useHotels } from "@/lib/api";
import { useAuth } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/core/components/ui/alert";

const TripPlanner = () => {
  const [showCustomPlanner, setShowCustomPlanner] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<"Budget" | "Moderate" | "Luxury" | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedHotelIds, setSelectedHotelIds] = useState<string[]>([]);
  const [showHotelSelection, setShowHotelSelection] = useState(false);
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  // Fetch featured trips from API
  const { data: featuredTripsData, isLoading, error } = useFeaturedTrips();

  // Fetch user's trips (only when signed in)
  const { data: userTripsData, isLoading: userTripsLoading } = useTrips(
    isSignedIn ? {} : undefined
  );

  // Fetch heritage sites from API
  const { data: sitesData, isLoading: sitesLoading } = useHeritageSites({ limit: 100 });
  const sites = sitesData?.sites || [];

  // Fetch hotels near selected site
  const { data: hotelsData, isLoading: hotelsLoading } = useHotels(
    selectedSiteId && showHotelSelection ? { siteId: selectedSiteId } : undefined,
    { enabled: !!selectedSiteId && showHotelSelection }
  );
  const hotels = hotelsData?.hotels || [];

  // Generate trip mutation
  const generateTripMutation = useMutation({
    mutationFn: async (data: { budget: "Budget" | "Moderate" | "Luxury" | "high" | "medium" | "low"; numberOfDays: number; siteId: string; selectedHotelIds?: string[] }) => {
      return await tripsApi.generate(data);
    },
    onSuccess: (trip) => {
      navigate(`/trip-planner/${trip._id}`);
    },
  });

  const handleContinueToHotels = () => {
    if (!selectedSiteId || !selectedDuration || !selectedBudget) {
      return;
    }
    setShowHotelSelection(true);
  };

  const handleGenerateTrip = () => {
    if (!isSignedIn) {
      navigate("/sign-in?redirect_url=/trip-planner");
      return;
    }

    if (!selectedSiteId || !selectedDuration || !selectedBudget) {
      return;
    }

    generateTripMutation.mutate({
      budget: selectedBudget,
      numberOfDays: selectedDuration,
      siteId: selectedSiteId,
      selectedHotelIds: selectedHotelIds.length > 0 ? selectedHotelIds : undefined,
    });
  };

  const toggleHotelSelection = (hotelId: string) => {
    setSelectedHotelIds((prev) =>
      prev.includes(hotelId) ? prev.filter((id) => id !== hotelId) : [...prev, hotelId]
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

          {/* Your Trips Section */}
          {isSignedIn && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">Your Trips</h2>
              {userTripsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Loading your trips...</span>
                </div>
              ) : userTripsData && userTripsData.trips.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {userTripsData.trips.map((trip: Trip) => (
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
                          {trip.isAIGenerated && (
                            <Badge className="absolute top-3 left-3 bg-secondary/90 text-secondary-foreground">
                              AI Generated
                            </Badge>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                            {trip.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">{trip.location}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {trip.duration}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {trip.status}
                            </Badge>
                          </div>
                          <div className="flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
                            View Itinerary
                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-lg border border-border">
                  <p className="text-muted-foreground mb-4">You haven't created any trips yet.</p>
                  <Button onClick={() => setShowCustomPlanner(true)} variant="outline">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create Your First Trip
                  </Button>
                </div>
              )}
            </div>
          )}

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
            {/* Site Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Select Heritage Site
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sitesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">Loading sites...</span>
                  </div>
                ) : sites.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No heritage sites available</p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                    {sites.map((site) => (
                      <button
                        key={site._id}
                        onClick={() => setSelectedSiteId(site._id)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          selectedSiteId === site._id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <p className="font-semibold text-foreground">{site.name}</p>
                        <p className="text-sm text-muted-foreground">{site.location}</p>
                        {site.city && (
                          <p className="text-xs text-muted-foreground mt-1">{site.city}, {site.state || site.country}</p>
                        )}
                      </button>
                    ))}
                  </div>
                )}
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
                    {[2, 3, 5].map((days) => (
                      <Button
                        key={days}
                        variant={selectedDuration === days ? "default" : "outline"}
                        className="w-full"
                        onClick={() => setSelectedDuration(days)}
                      >
                        {days} {days === 1 ? "Day" : "Days"}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Budget Range</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Budget", "Moderate", "Luxury"] as const).map((budget) => (
                      <Button
                        key={budget}
                        variant={selectedBudget === budget ? "default" : "outline"}
                        className="w-full"
                        onClick={() => setSelectedBudget(budget)}
                      >
                        {budget}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Interests</label>
                  <div className="flex flex-wrap gap-2">
                    {["Architecture", "History", "Photography", "Culture", "Food"].map((interest) => {
                      const isSelected = selectedInterests.includes(interest);
                      return (
                        <Badge
                          key={interest}
                          variant={isSelected ? "default" : "secondary"}
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => {
                            setSelectedInterests((prev) =>
                              prev.includes(interest)
                                ? prev.filter((i) => i !== interest)
                                : [...prev, interest]
                            );
                          }}
                        >
                          {interest}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hotel Selection Step */}
            {showHotelSelection && selectedSiteId && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hotel className="h-5 w-5 text-primary" />
                    Select Hotels (Optional)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose hotels near {sites.find((s) => s._id === selectedSiteId)?.name || "the site"}. 
                    You can skip this step and let AI recommend hotels.
                  </p>
                  {hotelsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="ml-2 text-muted-foreground">Loading hotels...</span>
                    </div>
                  ) : hotels.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No hotels found near this site. AI will suggest hotels during generation.
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {hotels.map((hotel) => (
                        <button
                          key={hotel._id}
                          onClick={() => toggleHotelSelection(hotel._id)}
                          className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                            selectedHotelIds.includes(hotel._id)
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-foreground">{hotel.name}</h4>
                                {hotel.chain && (
                                  <Badge variant="secondary" className="text-xs">
                                    {hotel.chain}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{hotel.location}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  {hotel.rating.toFixed(1)} ({hotel.reviewCount} reviews)
                                </div>
                                <span>
                                  ₹{hotel.pricePerNight.min}-{hotel.pricePerNight.max}/night
                                </span>
                              </div>
                              {hotel.description && (
                                <p className="text-xs text-muted-foreground line-clamp-2">{hotel.description}</p>
                              )}
                            </div>
                            <div className="shrink-0">
                              {selectedHotelIds.includes(hotel._id) ? (
                                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                                  <Check className="w-4 h-4" />
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-full border-2 border-border" />
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-3 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowHotelSelection(false);
                        setSelectedHotelIds([]);
                      }}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleGenerateTrip}
                      disabled={generateTripMutation.isPending || !isSignedIn}
                      className="flex-1"
                    >
                      {generateTripMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Itinerary
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {!showHotelSelection && (
              <>
                {generateTripMutation.isError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {generateTripMutation.error instanceof Error
                        ? generateTripMutation.error.message
                        : "Failed to generate trip. Please try again."}
                    </AlertDescription>
                  </Alert>
                )}

                {!isSignedIn && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Please sign in to generate personalized trips.
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  size="lg"
                  className="w-full h-14 text-lg bg-primary hover:bg-primary/90"
                  onClick={handleContinueToHotels}
                  disabled={
                    !selectedSiteId ||
                    !selectedDuration ||
                    !selectedBudget ||
                    !isSignedIn
                  }
                >
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Continue to Hotel Selection
                </Button>
              </>
            )}
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