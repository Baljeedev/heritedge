import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/core/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Calendar, DollarSign, ArrowLeft, CheckCircle2, Loader2, Edit, Sparkles } from "lucide-react";
import { useTrip, tripsApi } from "@/lib/api";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/core/components/ui/label";
import { Alert, AlertDescription } from "@/core/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function TripDetail() {
  const { tripId } = useParams<{ tripId: string }>();
  const { data: trip, isLoading, error } = useTrip(tripId || "", !!tripId);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const queryClient = useQueryClient();

  // Edit trip mutation
  const editTripMutation = useMutation({
    mutationFn: async (data: { customPrompt: string }) => {
      if (!tripId) throw new Error("Trip ID is required");
      return await tripsApi.edit(tripId, data);
    },
    onSuccess: () => {
      // Invalidate and refetch trip data
      queryClient.invalidateQueries({ queryKey: ["trips", tripId] });
      setEditDialogOpen(false);
      setCustomPrompt("");
      // Optionally navigate to refresh the page
      window.location.reload();
    },
  });

  const handleEditTrip = () => {
    if (!customPrompt.trim()) {
      return;
    }
    editTripMutation.mutate({ customPrompt: customPrompt.trim() });
  };

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
                  {trip.highlights?.map((highlight, index) => (
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
              {trip.itinerary?.map((dayPlan) => (
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

            {trip.status === "draft" && trip.isAIGenerated && (
              <Card>
                <CardHeader>
                  <CardTitle>Trip Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {trip.itinerary && trip.itinerary.length > 0
                      ? "Edit your itinerary with AI or customize it further."
                      : "Generate or customize your itinerary."}
                  </p>
                  {trip.itinerary && trip.itinerary.length > 0 && (
                    <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full" size="lg" variant="outline">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit with AI
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            Edit Trip Itinerary
                          </DialogTitle>
                          <DialogDescription>
                            Describe how you'd like to modify your trip itinerary. Our AI will regenerate it based on your preferences.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          {editTripMutation.isError && (
                            <Alert variant="destructive">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>
                                {editTripMutation.error instanceof Error
                                  ? editTripMutation.error.message
                                  : "Failed to edit trip. Please try again."}
                              </AlertDescription>
                            </Alert>
                          )}
                          <div className="space-y-2">
                            <Label htmlFor="prompt">Custom Instructions</Label>
                            <Textarea
                              id="prompt"
                              placeholder="e.g., Add more time for photography, include more local food experiences, make it more budget-friendly, add a day trip to nearby attractions..."
                              value={customPrompt}
                              onChange={(e) => setCustomPrompt(e.target.value)}
                              rows={6}
                              className="resize-none"
                            />
                            <p className="text-xs text-muted-foreground">
                              Be specific about what you want to change or add to your itinerary.
                            </p>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setEditDialogOpen(false);
                              setCustomPrompt("");
                            }}
                            disabled={editTripMutation.isPending}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleEditTrip}
                            disabled={!customPrompt.trim() || editTripMutation.isPending}
                          >
                            {editTripMutation.isPending ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Editing...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Apply Changes
                              </>
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

