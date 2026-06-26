"use client"

import { useState, useRef } from "react"
import { Star, Upload, User, CheckCircle2, AlertCircle } from "lucide-react"
import { useUser } from "@clerk/clerk-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/core/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog"
import { useCreateReview } from "@/lib/api/hooks/useReviews"
import { uploadApi } from "@/lib/api/upload"
import { useI18n } from "@/lib/i18n/context"

interface GuideReviewFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  guideId: string
  guideName: string
}

export function GuideReviewForm({ open, onOpenChange, guideId, guideName }: GuideReviewFormProps) {
  const { t } = useI18n()
  const { user } = useUser()
  const createReview = useCreateReview()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [profileFile, setProfileFile] = useState<File | null>(null)
  const [profilePreview, setProfilePreview] = useState<string | null>(null)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const resetForm = () => {
    setRating(5)
    setComment("")
    setAuthorName(user?.fullName || user?.firstName || "")
    setProfileFile(null)
    setProfilePreview(user?.imageUrl || null)
    setError(null)
    setShowSuccess(false)
  }

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setAuthorName(user?.fullName || user?.firstName || "")
      setProfilePreview(user?.imageUrl || null)
    } else {
      resetForm()
    }
    onOpenChange(next)
  }

  const handleProfileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setError(t("reviewImageOnly"))
      return
    }
    setProfileFile(file)
    setProfilePreview(URL.createObjectURL(file))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!comment.trim()) {
      setError(t("reviewDescriptionRequired"))
      return
    }

    setIsSubmitting(true)
    try {
      let authorImage = profilePreview && !profileFile ? profilePreview : undefined
      const images: string[] = []

      if (profileFile) {
        const uploaded = await uploadApi.upload("review", profileFile)
        authorImage = uploaded.url
        images.push(uploaded.url)
      }

      await createReview.mutateAsync({
        reviewType: "guide",
        targetId: guideId,
        rating,
        comment: comment.trim(),
        authorName: authorName.trim() || user?.fullName || user?.firstName || undefined,
        authorImage,
        images: images.length > 0 ? images : undefined,
      })

      setShowSuccess(true)
      setTimeout(() => handleOpenChange(false), 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const displayRating = hoveredStar || rating

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {showSuccess ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
            <p className="font-semibold text-foreground">{t("reviewSubmitted")}</p>
            <p className="text-sm text-muted-foreground">{t("reviewThankYou")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{t("writeReview")}</DialogTitle>
              <DialogDescription>
                {t("reviewGuideFor")} {guideName}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-dashed border-border hover:border-primary transition-colors bg-muted flex items-center justify-center"
                >
                  {profilePreview ? (
                    <img src={profilePreview} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-muted-foreground" />
                  )}
                  <span className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] py-0.5 flex items-center justify-center gap-0.5">
                    <Upload className="w-2.5 h-2.5" />
                    {t("photo")}
                  </span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfileSelect}
                />
                <p className="text-xs text-muted-foreground">{t("reviewProfilePhotoHint")}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  {t("fullName")}
                </label>
                <Input
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder={t("fullName")}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  {t("rating")}
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="p-0.5"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          star <= displayRating ? "fill-accent text-accent" : "text-border"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  {t("reviewDescription")}
                </label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t("reviewDescriptionPlaceholder")}
                  rows={4}
                  required
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                {t("close")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t("submitting") : t("submitReview")}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
