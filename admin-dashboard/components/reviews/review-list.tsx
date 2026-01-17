"use client"

import { Label } from "@/components/ui/label"
import { useState, useMemo, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Search, Eye, EyeOff, CheckCircle2, Circle, Loader2 } from "lucide-react"
import type { IReview } from "@/lib/types"
import { reviewsApi } from "@/lib/api"
import { toast } from "sonner"

const reviewTypeColors: Record<string, string> = {
  site: "bg-amber-100 text-amber-700",
  guide: "bg-blue-100 text-blue-700",
  hotel: "bg-green-100 text-green-700",
  experience: "bg-purple-100 text-purple-700",
}

const ratingStars = (rating: number) => {
  return "★".repeat(rating) + "☆".repeat(5 - rating)
}

export function ReviewList() {
  const [reviews, setReviews] = useState<IReview[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [verifiedFilter, setVerifiedFilter] = useState("all")
  const [visibilityFilter, setVisibilityFilter] = useState("all")
  const [selectedReview, setSelectedReview] = useState<IReview | null>(null)

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      setLoading(true)
      const response = await reviewsApi.getAll({ limit: 1000, all: true })
      setReviews(response.reviews)
    } catch (error: any) {
      toast.error(`Failed to load reviews: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const matchesSearch = review.comment.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = typeFilter === "all" || review.reviewType === typeFilter
      const matchesRating = ratingFilter === "all" || review.rating === Number(ratingFilter)
      const matchesVerified =
        verifiedFilter === "all" || (verifiedFilter === "yes" ? review.isVerified : !review.isVerified)
      const matchesVisibility =
        visibilityFilter === "all" || (visibilityFilter === "visible" ? review.isVisible : !review.isVisible)

      return matchesSearch && matchesType && matchesRating && matchesVerified && matchesVisibility
    })
  }, [reviews, searchTerm, typeFilter, ratingFilter, verifiedFilter, visibilityFilter])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return
    
    try {
      await reviewsApi.delete(id)
      toast.success("Review deleted successfully")
      await loadReviews()
    } catch (error: any) {
      toast.error(`Failed to delete review: ${error.message}`)
    }
  }

  const handleToggleVisibility = async (review: IReview) => {
    try {
      await reviewsApi.update(review._id, { isVisible: !review.isVisible })
      toast.success(`Review ${review.isVisible ? "hidden" : "shown"} successfully`)
      await loadReviews()
    } catch (error: any) {
      toast.error(`Failed to update review: ${error.message}`)
    }
  }

  const handleToggleVerified = async (review: IReview) => {
    try {
      await reviewsApi.update(review._id, { 
        isVerified: !review.isVerified,
      })
      toast.success(`Review ${review.isVerified ? "unverified" : "verified"} successfully`)
      await loadReviews()
    } catch (error: any) {
      toast.error(`Failed to update review: ${error.message}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Reviews</h1>
        <p className="text-muted-foreground mt-1">Moderate and manage user reviews</p>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search comments..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Review type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="site">Site</SelectItem>
              <SelectItem value="guide">Guide</SelectItem>
              <SelectItem value="hotel">Hotel</SelectItem>
              <SelectItem value="experience">Experience</SelectItem>
            </SelectContent>
          </Select>
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
          <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Verified" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="yes">Verified</SelectItem>
              <SelectItem value="no">Unverified</SelectItem>
            </SelectContent>
          </Select>
          <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="visible">Visible</SelectItem>
              <SelectItem value="hidden">Hidden</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">Showing {filteredReviews.length} reviews</p>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Reviews Table */}
      {!loading && (
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left p-4">Type</th>
                <th className="text-left p-4">Rating</th>
                <th className="text-left p-4">Comment</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((review) => (
                <tr key={review._id} className="border-b hover:bg-muted/50">
                  <td className="p-4">
                    <Badge className={reviewTypeColors[review.reviewType]}>
                      {review.reviewType}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500">{ratingStars(review.rating)}</span>
                      <span className="text-sm text-muted-foreground">({review.rating})</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="line-clamp-2 max-w-md">{review.comment}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      {review.isVerified ? (
                        <Badge variant="secondary" className="w-fit">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="w-fit">
                          <Circle className="h-3 w-3 mr-1" />
                          Unverified
                        </Badge>
                      )}
                      {review.isVisible ? (
                        <Badge variant="secondary" className="w-fit">
                          <Eye className="h-3 w-3 mr-1" />
                          Visible
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="w-fit">
                          <EyeOff className="h-3 w-3 mr-1" />
                          Hidden
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleVisibility(review)}
                        title={review.isVisible ? "Hide review" : "Show review"}
                      >
                        {review.isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleVerified(review)}
                        title={review.isVerified ? "Unverify review" : "Verify review"}
                      >
                        {review.isVerified ? <Circle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(review._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      )}

      {/* Empty State */}
      {!loading && filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No reviews found</p>
        </div>
      )}

      {/* Review Detail Dialog */}
      {selectedReview && (
        <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Review Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Rating</Label>
                <div className="text-2xl text-yellow-500">{ratingStars(selectedReview.rating)}</div>
              </div>
              <div>
                <Label>Comment</Label>
                <p>{selectedReview.comment}</p>
              </div>
              {selectedReview.images && selectedReview.images.length > 0 && (
                <div>
                  <Label>Images</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedReview.images.map((img, idx) => (
                      <img key={idx} src={img} alt={`Review image ${idx + 1}`} className="rounded" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}