import apiClient from "../api-client"

export interface UploadResponse {
  url: string
  key: string
  type: "image" | "video"
}

export interface MultipleUploadResponse {
  files: Array<{
    url: string
    key: string
    type: "image" | "video"
    originalName: string
  }>
}

export const uploadApi = {
  // Upload a single file
  upload: async (
    type: "trip" | "monument" | "guide" | "experience" | "hotel" | "review",
    file: File
  ): Promise<UploadResponse> => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await apiClient.post<UploadResponse>(`/api/upload/${type}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    return response.data
  },

  // Upload multiple files
  uploadMultiple: async (
    type: "trip" | "monument" | "guide" | "experience" | "hotel" | "review",
    files: File[]
  ): Promise<MultipleUploadResponse> => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append("files", file)
    })

    const response = await apiClient.post<MultipleUploadResponse>(`/api/upload/${type}/multiple`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    return response.data
  },
}