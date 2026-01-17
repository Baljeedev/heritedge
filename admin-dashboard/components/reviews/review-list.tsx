"use client"

import { Label } from "@/components/ui/label"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Search, Eye, EyeOff, CheckCircle2, Circle } from "lucide-react"
import type { IReview } from "@/lib/types"

const mockReviews: IReview[] = [
  {
    _id: "1",
    clerkUserId: "user_1",
    rating: 5,
    comment: "Incredible experience! The Taj Mahal tour was beautifully organized.",
    reviewType: "site",
    targetId: "taj-mahal",
    visitDate: "2024-01-10",
    helpfulCount: 24,
    isVerified: true,
    isVisible: true,
    createdAt: "2024-01-12",
    updatedAt: "2024-01-12",
  },
  {
    _id: "2",
    clerkUserId: "user_2",
    rating: 3,
    comment: "Good guide but some information seemed outdated.",
    reviewType: "guide",
    targetId: "guide_1",
    visitDate: "2024-01-08",
    helpfulCount: 8,
    isVerified: false,
    isVisible: true,
    createdAt: "2024-01-09",
    updatedAt: "2024-01-09",
  },
]

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
  const [reviews, setReviews] = useState<IReview[]>(mockReviews)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [verifiedFilter, setVerifiedFilter] = useState("all")
  const [visibilityFilter, setVisibilityFilter] = useState("all")
  const [selectedReview, setSelectedReview] = useState<IReview | null>(null)

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

  const handleDelete = (id: string) => {
    setReviews(reviews.filter((r) => r._id !== id))
  }

  const handleToggleVisibility = (id: string) => {
    setReviews(reviews.map((r) => (r._id === id ? { ...r, isVisible: !r.isVisible } : r)))
  }

  const handleToggleVerified = (id: string) => {
    setReviews(
      reviews.map((r) =>
        r._id === id
          ? { ...r, isVerified: !r.isVerified, verificationDate: !r.isVerified ? new Date().toISOString() : undefined }
          : r,
      ),
    )
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
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
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
              <SelectItem value="site">Heritage Site</SelectItem>
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
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="yes">Verified Only</SelectItem>
              <SelectItem value="no">Unverified Only</SelectItem>
            </SelectContent>
          </Select>
          <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="visible">Visible</SelectItem>
              <SelectItem value="hidden">Hidden</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("")
              setTypeFilter("all")
              setRatingFilter("all")
              setVerifiedFilter("all")
              setVisibilityFilter("all")
            }}
          >
            Clear
          </Button>
        </div>
      </Card>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">Showing {filteredReviews.length} reviews</p>

      {/* Reviews Table */}
      <div className="space-y-3">
        {filteredReviews.map((review) => (
          <Card key={review._id} className="p-4 hover:shadow-md transition-shadow">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              {/* Type & Rating */}
              <div className="md:col-span-2 flex flex-col gap-2">
                <Badge className={reviewTypeColors[review.reviewType]}>
                  {review.reviewType.charAt(0).toUpperCase() + review.reviewType.slice(1)}
                </Badge>
                <div className="text-sm">
                  <span className="text-yellow-500">{ratingStars(review.rating)}</span>
                </div>
              </div>

              {/* Comment & Details */}
              <div className="md:col-span-5">
                <p className="font-medium text-sm mb-2 line-clamp-2">{review.comment}</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  {review.visitDate && <div>Visited: {new Date(review.visitDate).toLocaleDateString()}</div>}
                  <div>👍 {review.helpfulCount} found helpful</div>
                </div>
              </div>

              {/* Status Badges */}
              <div className="md:col-span-2 flex gap-2 flex-wrap">
                {review.isVerified && <Badge variant="secondary">Verified</Badge>}
                {!review.isVisible && <Badge variant="destructive">Hidden</Badge>}
              </div>

              {/* Actions */}
              <div className="md:col-span-3 flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleToggleVisibility(review._id)}
                  title={review.isVisible ? "Hide review" : "Show review"}
                >
                  {review.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleToggleVerified(review._id)}
                  title={review.isVerified ? "Unverify" : "Verify"}
                >
                  {review.isVerified ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedReview(review)}
                  className="flex-1 md:flex-none"
                >
                  View
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(review._id)} title="Delete review">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Review Detail Dialog */}
      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Type</Label>
                <p className="text-sm">
                  <Badge className={reviewTypeColors[selectedReview.reviewType]}>{selectedReview.reviewType}</Badge>
                </p>
              </div>

              <div>
                <Label className="text-muted-foreground">Rating</Label>
                <p className="text-lg text-yellow-500">{ratingStars(selectedReview.rating)}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Comment</Label>
                <p className="text-sm mt-1">{selectedReview.comment}</p>
              </div>

              {selectedReview.visitDate && (
                <div>
                  <Label className="text-muted-foreground">Visit Date</Label>
                  <p className="text-sm">{new Date(selectedReview.visitDate).toLocaleDateString()}</p>
                </div>
              )}

              <div>
                <Label className="text-muted-foreground">Helpful Count</Label>
                <p className="text-sm">{selectedReview.helpfulCount}</p>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    handleToggleVisibility(selectedReview._id)
                    setSelectedReview(null)
                  }}
                >
                  {selectedReview.isVisible ? "Hide Review" : "Show Review"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleToggleVerified(selectedReview._id)
                    setSelectedReview(null)
                  }}
                >
                  {selectedReview.isVerified ? "Unverify" : "Verify"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDelete(selectedReview._id)
                    setSelectedReview(null)
                  }}
                >
                  Delete Review
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
