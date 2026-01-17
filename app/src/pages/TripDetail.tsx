import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/core/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Calendar, DollarSign, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { useTrip } from "@/lib/api";

export default function TripDetail() {
  const { tripId } = useParams<{ tripId: string }>();
  const { data: trip, isLoading, error } = useTrip(tripId || "", !!tripId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Trip Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {error ? error.message : "The trip you're looking for doesn't exist."}
          </p>
          <Link to="/trip-planner">
            <Button>Back to Trip Planner</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={trip.image}
          alt={trip.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <Link to="/trip-planner">
              <Button variant="ghost" className="mb-4 text-foreground hover:text-primary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Trips
              </Button>
            </Link>
            <h1 className="text-4xl md:text-5xl  font-bold text-foreground mb-2">
              {trip.name}
            </h1>
            <p className="text-xl text-muted-foreground mb-4">{trip.location}</p>
            <div className="flex flex-wrap gap-4">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <Clock className="w-4 h-4 mr-1" />
                {trip.duration}
              </Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <DollarSign className="w-4 h-4 mr-1" />
                {trip.budget}
              </Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <Calendar className="w-4 h-4 mr-1" />
                Best: {trip.bestTimeToVisit}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Trip</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{trip.description}</p>
              </CardContent>
            </Card>

            {/* Highlights */}
            <Card>
              <CardHeader>
                <CardTitle>Trip Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {trip.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <span className="text-foreground">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Day-by-Day Itinerary */}
            <div className="space-y-6">
              <h2 className="text-3xl  font-bold text-foreground">Day-by-Day Itinerary</h2>
              {trip.itinerary.map((dayPlan) => (
                <Card key={dayPlan.day} className="overflow-hidden">
                  <CardHeader className="bg-primary/5 border-b border-border">
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        {dayPlan.day}
                      </div>
                      <span>Day {dayPlan.day}: {dayPlan.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border">
                      {dayPlan.activities.map((activity, index) => (
                        <div key={index} className="p-6 hover:bg-muted/30 transition-colors">
                          <div className="flex gap-4">
                            <div className="shrink-0 w-20 text-sm font-medium text-primary">
                              {activity.time}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start gap-2 mb-1">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                                <h4 className="font-semibold text-foreground">{activity.activity}</h4>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2 ml-4">
                                <MapPin className="w-4 h-4" />
                                {activity.location}
                              </div>
                              {activity.description && (
                                <p className="text-sm text-muted-foreground ml-4">{activity.description}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Trip Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Duration</p>
                  <p className="text-foreground">{trip.duration}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Budget Level</p>
                  <Badge variant="secondary">{trip.budget}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Best Time to Visit</p>
                  <p className="text-foreground">{trip.bestTimeToVisit}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Location</p>
                  <p className="text-foreground">{trip.location}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ready to Book?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Customize this itinerary or get personalized recommendations for hotels, restaurants, and experiences.
                </p>
                <Button className="w-full" size="lg">
                  Customize This Trip
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

