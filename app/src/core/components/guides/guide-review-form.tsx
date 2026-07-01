"use client"

import { useState, useRef } from "react"
import { useUser } from "@clerk/clerk-react"
import { Star, Upload, ImagePlus, X, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/core/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const resetForm = () => {
    setRating(5)
    setComment("")
    setImageFile(null)
    setImagePreview(null)
    setError(null)
    setShowSuccess(false)
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) resetForm()
    onOpenChange(next)
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setError(t("reviewImageOnly"))
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setError(null)
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
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
      const images: string[] = []

      if (imageFile) {
        const uploaded = await uploadApi.upload("review", imageFile)
        images.push(uploaded.url)
      }

      await createReview.mutateAsync({
        reviewType: "guide",
        targetId: guideId,
        rating,
        comment: comment.trim(),
        authorName: user?.fullName || user?.firstName || undefined,
        authorImage: user?.imageUrl || undefined,
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

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  {t("reviewPhotoLabel")}
                </label>
                {imagePreview ? (
                  <div className="relative rounded-lg overflow-hidden border border-border">
                    <img
                      src={imagePreview}
                      alt=""
                      className="w-full h-40 object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                      aria-label={t("removePhoto")}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors bg-muted/50 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary"
                  >
                    <ImagePlus className="w-8 h-8" />
                    <span className="text-sm font-medium flex items-center gap-1">
                      <Upload className="w-4 h-4" />
                      {t("reviewPhotoUpload")}
                    </span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                />
                <p className="text-xs text-muted-foreground mt-1.5">{t("reviewPhotoHint")}</p>
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
