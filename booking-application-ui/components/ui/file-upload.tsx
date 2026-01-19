"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Image as ImageIcon, Video } from "lucide-react"

interface FileUploadProps {
  label?: string
  value?: string | File | string[] | null // Can be URL (existing), File (new upload), or array of URLs
  onChange: (file: File | null) => void // Changed to return File instead of URL
  accept?: string
  maxSizeMB?: number
  fileType?: "image" | "video" | "both"
  multiple?: boolean
  onMultipleChange?: (files: File[]) => void
}

export function FileUpload({
  label = "Upload File",
  value,
  onChange,
  accept,
  maxSizeMB = 100,
  fileType = "image",
  multiple = false,
  onMultipleChange,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [preview, setPreview] = useState<string | null>(null)
  const [previews, setPreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize preview from existing URL value or File
  useEffect(() => {
    if (multiple) {
      // For multiple files, handle arrays
      if (Array.isArray(value)) {
        const urls = value.filter((v) => typeof v === "string")
        setPreviews(urls)
      } else if (value instanceof File) {
        const url = URL.createObjectURL(value)
        setPreviews([url])
        setSelectedFiles([value])
      } else {
        setPreviews([])
        setSelectedFiles([])
      }
    } else {
      // For single file
      if (typeof value === "string" && value) {
        setPreview(value)
        setSelectedFile(null) // Existing URL, no new file
      } else if (value instanceof File) {
        const url = URL.createObjectURL(value)
        setPreview(url)
        setSelectedFile(value)
      } else {
        setPreview(null)
        setSelectedFile(null)
      }
    }
  }, [value, multiple])

  const getAcceptTypes = () => {
    if (accept) return accept
    if (fileType === "image") return "image/*"
    if (fileType === "video") return "video/*"
    return "image/*,video/*"
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (multiple) {
      const fileArray = Array.from(files)
      handleMultipleSelect(fileArray)
    } else {
      handleSingleSelect(files[0])
    }
  }

  const handleSingleSelect = (file: File) => {
    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File size must be less than ${maxSizeMB}MB`)
      return
    }

    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreview(url)
    onChange(file)
  }

  const handleMultipleSelect = (files: File[]) => {
    // Validate all files
    const oversizedFiles = files.filter((file) => file.size > maxSizeMB * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      alert(`Some files exceed ${maxSizeMB}MB limit`)
      return
    }

    // Add new files to existing ones
    const updatedFiles = [...selectedFiles, ...files]
    setSelectedFiles(updatedFiles)
    
    // Keep existing URL previews and add new file previews
    const newUrls = files.map((file) => URL.createObjectURL(file))
    setPreviews([...previews, ...newUrls])
    
    if (onMultipleChange) {
      onMultipleChange(updatedFiles)
    }
  }

  const handleRemove = () => {
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview)
    }
    setSelectedFile(null)
    setPreview(null)
    onChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveMultiple = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)
    
    // Revoke URL for removed file
    if (previews[index] && previews[index].startsWith("blob:")) {
      URL.revokeObjectURL(previews[index])
    }
    
    setSelectedFiles(newFiles)
    setPreviews(newPreviews)
    if (onMultipleChange) {
      onMultipleChange(newFiles)
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {!multiple && (
        <div className="space-y-2">
          {preview && (
            <div className="relative border rounded-lg overflow-hidden">
              {preview.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
              ) : preview.match(/\.(mp4|webm|mov|avi)$/i) ? (
                <video src={preview} className="w-full h-48 object-cover" controls />
              ) : (
                <div className="w-full h-48 bg-muted flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <Input
            ref={fileInputRef}
            type="file"
            accept={getAcceptTypes()}
            onChange={handleFileSelect}
            className="flex-1"
          />
        </div>
      )}

      {multiple && (
        <div className="space-y-2">
          {(previews.length > 0 || selectedFiles.length > 0) && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {/* Show existing URL previews (from value prop) */}
              {Array.isArray(value) && value.filter((v) => typeof v === "string").map((url, index) => (
                <div key={`existing-${index}`} className="relative border rounded-lg overflow-hidden">
                  {url.match(/\.(jpg|jpeg|png|gif|webp)$/i) || url.startsWith("http") ? (
                    <img src={url} alt={`Existing ${index + 1}`} className="w-full h-24 object-cover" />
                  ) : url.match(/\.(mp4|webm|mov|avi)$/i) ? (
                    <video src={url} className="w-full h-24 object-cover" />
                  ) : (
                    <div className="w-full h-24 bg-muted flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">Existing</div>
                </div>
              ))}
              {/* Show new file previews */}
              {selectedFiles.map((file, index) => {
                const url = URL.createObjectURL(file)
                return (
                  <div key={`new-${index}`} className="relative border rounded-lg overflow-hidden">
                    {file.type.startsWith("image/") ? (
                      <img src={url} alt={`New ${index + 1}`} className="w-full h-24 object-cover" />
                    ) : file.type.startsWith("video/") ? (
                      <video src={url} className="w-full h-24 object-cover" />
                    ) : (
                      <div className="w-full h-24 bg-muted flex items-center justify-center">
                        <Video className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => {
                        URL.revokeObjectURL(url)
                        const newFiles = selectedFiles.filter((_, i) => i !== index)
                        setSelectedFiles(newFiles)
                        const newPreviews = previews.filter((_, i) => i !== index)
                        setPreviews(newPreviews)
                        if (onMultipleChange) {
                          onMultipleChange(newFiles)
                        }
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )
              })}
            </div>
          )}

          <Input
            ref={fileInputRef}
            type="file"
            accept={getAcceptTypes()}
            onChange={handleFileSelect}
            multiple
            className="flex-1"
          />
        </div>
      )}

      {typeof value === "string" && value && !preview && (
        <div className="text-sm text-muted-foreground">
          Current: <a href={value} target="_blank" rel="noopener noreferrer" className="underline">{value}</a>
        </div>
      )}
    </div>
  )
}