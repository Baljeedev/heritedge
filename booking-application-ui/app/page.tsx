'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Mail, Phone, FileText, Loader2 } from 'lucide-react';
import { bookingsApi, type Booking } from '@/lib/api/bookings';
import { AuthGuard } from '@/components/auth-guard';
import { UserButton as ClerkUserButton } from '@clerk/nextjs';

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

function BookingsContent() {
  const { user } = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.primaryEmailAddress?.emailAddress) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const email = user.primaryEmailAddress.emailAddress;
        const data = await bookingsApi.getByProviderEmail(email);
        setBookings(data.bookings);
      } catch (err: any) {
        setError(err.message || 'Failed to load bookings');
        console.error('Error fetching bookings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background p-6 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg">
            <p>Error: {error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Bookings</h1>
            <p className="text-muted-foreground">Manage and view all your bookings</p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
            <ClerkUserButton afterSignOutUrl="/" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Total Bookings</p>
              <p className="text-3xl font-bold">{bookings.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Confirmed</p>
              <p className="text-3xl font-bold text-green-600">
                {bookings.filter((b) => b.status === 'confirmed').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">
                {bookings.filter((b) => b.status === 'pending').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Cancelled</p>
              <p className="text-3xl font-bold text-red-600">
                {bookings.filter((b) => b.status === 'cancelled').length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <p className="text-muted-foreground">No bookings found for your email address.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Make sure your email is set in your guide, experience, or hotel profile.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
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
                          {formatDate(new Date(booking.bookingDate))}
                        </p>
                      </div>
                    </div>

                    {booking.bookingType !== 'guide' && (
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Number of People</p>
                          <p className="text-sm font-medium text-foreground">
                            {booking.numberOfPeople} {booking.numberOfPeople === 1 ? 'person' : 'people'}
                          </p>
                        </div>
                      </div>
                    )}

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
        )}
      </div>
    </main>
  );
}

export default function BookingsPage() {
  return (
    <AuthGuard>
      <BookingsContent />
    </AuthGuard>
  );
}
