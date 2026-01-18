'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Mail, Phone, FileText } from 'lucide-react';

interface IBooking {
  _id: string;
  userId: string;
  bookingType: 'guide' | 'music' | 'workshop';
  guideId?: string;
  experienceId?: string;
  bookingDate: Date;
  numberOfPeople: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// Mock booking data
const mockBookings: IBooking[] = [
  {
    _id: '1',
    userId: 'user_123',
    bookingType: 'guide',
    guideId: 'guide_456',
    bookingDate: new Date('2024-02-15T10:00:00'),
    numberOfPeople: 4,
    contactName: 'Sarah Johnson',
    contactEmail: 'sarah@example.com',
    contactPhone: '+1 (555) 123-4567',
    notes: 'Interested in historical sites. Please arrange early morning tour.',
    status: 'confirmed',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    _id: '2',
    userId: 'user_789',
    bookingType: 'music',
    experienceId: 'exp_101',
    bookingDate: new Date('2024-02-18T19:00:00'),
    numberOfPeople: 2,
    contactName: 'Michael Chen',
    contactEmail: 'michael.chen@example.com',
    contactPhone: '+1 (555) 234-5678',
    notes: 'Prefer jazz music. Anniversary celebration.',
    status: 'pending',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    _id: '3',
    userId: 'user_456',
    bookingType: 'workshop',
    experienceId: 'exp_202',
    bookingDate: new Date('2024-02-20T14:00:00'),
    numberOfPeople: 8,
    contactName: 'Emma Rodriguez',
    contactEmail: 'emma.r@example.com',
    contactPhone: '+1 (555) 345-6789',
    status: 'confirmed',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    _id: '4',
    userId: 'user_321',
    bookingType: 'guide',
    guideId: 'guide_789',
    bookingDate: new Date('2024-02-10T09:00:00'),
    numberOfPeople: 6,
    contactName: 'James Wilson',
    contactEmail: 'james.w@example.com',
    contactPhone: '+1 (555) 456-7890',
    notes: 'Group tour. Wheelchair accessible route needed.',
    status: 'cancelled',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    _id: '5',
    userId: 'user_654',
    bookingType: 'music',
    experienceId: 'exp_303',
    bookingDate: new Date('2024-02-25T18:00:00'),
    numberOfPeople: 15,
    contactName: 'Lisa Anderson',
    contactEmail: 'lisa.anderson@example.com',
    contactPhone: '+1 (555) 567-8901',
    notes: 'Corporate event. Need sound system setup.',
    status: 'confirmed',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-17'),
  },
];

function getStatusColor(status: string): string {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getBookingTypeColor(type: string): string {
  switch (type) {
    case 'guide':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'music':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case 'workshop':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function BookingsPage() {
  return (
    <main className="min-h-screen bg-background p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Bookings</h1>
          <p className="text-muted-foreground">Manage and view all your bookings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Total Bookings</p>
              <p className="text-3xl font-bold">{mockBookings.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Confirmed</p>
              <p className="text-3xl font-bold text-green-600">
                {mockBookings.filter((b) => b.status === 'confirmed').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">
                {mockBookings.filter((b) => b.status === 'pending').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Cancelled</p>
              <p className="text-3xl font-bold text-red-600">
                {mockBookings.filter((b) => b.status === 'cancelled').length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {mockBookings.map((booking) => (
            <Card key={booking._id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="grid gap-6">
                  {/* Top row with title and badges */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {booking.contactName}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getBookingTypeColor(booking.bookingType)}>
                          {booking.bookingType.charAt(0).toUpperCase() +
                            booking.bookingType.slice(1)}
                        </Badge>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Booking details grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Booking Date</p>
                        <p className="text-sm font-medium text-foreground">
                          {formatDate(booking.bookingDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Number of People</p>
                        <p className="text-sm font-medium text-foreground">
                          {booking.numberOfPeople} {booking.numberOfPeople === 1 ? 'person' : 'people'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <a
                          href={`mailto:${booking.contactEmail}`}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          {booking.contactEmail}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <a
                          href={`tel:${booking.contactPhone}`}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          {booking.contactPhone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Notes section */}
                  {booking.notes && (
                    <div className="flex gap-3 pt-4 border-t border-border">
                      <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-1">Notes</p>
                        <p className="text-sm text-foreground italic">{booking.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
