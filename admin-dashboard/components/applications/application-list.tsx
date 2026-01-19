"use client"

import { useState, useMemo, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Search, User, Hotel, Music, Loader2, CheckCircle2, XCircle, Clock, Mail, Calendar } from "lucide-react"
import { applicationsApi, type Application } from "@/lib/api/applications"
import { toast } from "sonner"

const typeColors: Record<string, string> = {
  guide: "bg-blue-100 text-blue-700",
  hotel: "bg-green-100 text-green-700",
  experience: "bg-purple-100 text-purple-700",
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
}

export function ApplicationList() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("pending")
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    loadApplications()
  }, [statusFilter, typeFilter])

  const loadApplications = async () => {
    try {
      setLoading(true)
      const response = await applicationsApi.getAll(
        statusFilter !== "all" ? statusFilter : undefined,
        typeFilter !== "all" ? typeFilter : undefined
      )
      setApplications(response.applications)
    } catch (error: any) {
      toast.error(`Failed to load applications: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicationData?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.clerkUserId.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesSearch
    })
  }, [applications, searchTerm])

  const handleApprove = async (application: Application) => {
    if (!confirm(`Are you sure you want to approve this ${application.type} application?`)) {
      return
    }

    try {
      setIsProcessing(true)
      await applicationsApi.approve(application._id)
      toast.success("Application approved and record created!")
      await loadApplications()
      setSelectedApplication(null)
    } catch (error: any) {
      toast.error(`Failed to approve application: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async (application: Application) => {
    if (!rejectionReason.trim() && !confirm("Reject without a reason?")) {
      return
    }

    try {
      setIsProcessing(true)
      await applicationsApi.reject(application._id, rejectionReason || undefined)
      toast.success("Application rejected")
      await loadApplications()
      setSelectedApplication(null)
      setRejectionReason("")
    } catch (error: any) {
      toast.error(`Failed to reject application: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "guide":
        return <User className="w-4 h-4" />
      case "hotel":
        return <Hotel className="w-4 h-4" />
      case "experience":
        return <Music className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "guide":
        return "Guide"
      case "hotel":
        return "Hotel"
      case "experience":
        return "Experience"
      default:
        return type
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderApplicationDetails = (app: Application) => {
    const data = app.applicationData

    if (app.type === "guide") {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-sm">{data.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Specialization</p>
              <p className="text-sm">{data.specialization}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Experience</p>
              <p className="text-sm">{data.experience} years</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Price per Day</p>
              <p className="text-sm">₹{data.pricePerDay}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Languages</p>
              <p className="text-sm">{data.languages?.join(", ") || "N/A"}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Bio</p>
              <p className="text-sm">{data.bio}</p>
            </div>
            {data.image && (
              <div className="col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Image</p>
                <img src={data.image} alt={data.name} className="w-32 h-32 object-cover rounded" />
              </div>
            )}
            {data.video && (
              <div className="col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Video</p>
                <video
                  src={data.video}
                  className="w-64 h-40 rounded border"
                  controls
                />
              </div>
            )}
          </div>
        </div>
      )
    }

    if (app.type === "hotel") {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Hotel Name</p>
              <p className="text-sm">{data.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Chain</p>
              <p className="text-sm">{data.chain || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Location</p>
              <p className="text-sm">{data.location}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">City, State</p>
              <p className="text-sm">{data.city}, {data.state}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Price Range</p>
              <p className="text-sm">₹{data.pricePerNight?.min} - ₹{data.pricePerNight?.max}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Partnership Type</p>
              <p className="text-sm">{data.partnershipType}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p className="text-sm">{data.description}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Amenities</p>
              <p className="text-sm">{data.amenities?.join(", ") || "N/A"}</p>
            </div>
          </div>
        </div>
      )
    }

    if (app.type === "experience") {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-sm">{data.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Type</p>
              <p className="text-sm">{data.type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Price</p>
              <p className="text-sm">₹{data.price}</p>
            </div>
            {data.duration && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Duration</p>
                <p className="text-sm">{data.duration}</p>
              </div>
            )}
            {data.venue && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Venue</p>
                <p className="text-sm">{data.venue}</p>
              </div>
            )}
            <div className="col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p className="text-sm">{data.description}</p>
            </div>
            {data.image && (
              <div className="col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Image</p>
                <img src={data.image} alt={data.name} className="w-32 h-32 object-cover rounded" />
              </div>
            )}
            {data.video && (
              <div className="col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Video</p>
                <video
                  src={data.video}
                  className="w-64 h-40 rounded border"
                  controls
                />
              </div>
            )}
          </div>
        </div>
      )
    }

    return <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by email, name, or user ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="guide">Guides</SelectItem>
            <SelectItem value="hotel">Hotels</SelectItem>
            <SelectItem value="experience">Experiences</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <Card>
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No applications found</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <Card key={app._id} className="hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded ${typeColors[app.type]}`}>
                        {getTypeIcon(app.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {app.applicationData?.name || "Unnamed Application"}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                          <Mail className="w-3 h-3" />
                          {app.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge className={typeColors[app.type]}>{getTypeLabel(app.type)}</Badge>
                      <Badge className={statusColors[app.status]}>{app.status}</Badge>
                      <Badge variant="outline" className="text-xs">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(app.submittedAt)}
                      </Badge>
                    </div>
                  </div>
                  {app.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => setSelectedApplication(app)}
                        variant="outline"
                      >
                        View Details
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Application Detail Dialog */}
      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedApplication?.type && getTypeLabel(selectedApplication.type)} Application
            </DialogTitle>
            <DialogDescription>
              Submitted on {selectedApplication && formatDate(selectedApplication.submittedAt)}
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Applicant Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p>{selectedApplication.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">User ID</p>
                    <p className="font-mono text-xs">{selectedApplication.clerkUserId}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Application Details</h4>
                {renderApplicationDetails(selectedApplication)}
              </div>

              {selectedApplication.status === "pending" && (
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <Label htmlFor="rejectionReason">Rejection Reason (optional)</Label>
                    <Textarea
                      id="rejectionReason"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Provide a reason for rejection..."
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(selectedApplication)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-2" />
                      )}
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleApprove(selectedApplication)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                      )}
                      Approve
                    </Button>
                  </div>
                </div>
              )}

              {selectedApplication.status === "rejected" && selectedApplication.rejectionReason && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Rejection Reason</p>
                  <p className="text-sm">{selectedApplication.rejectionReason}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
