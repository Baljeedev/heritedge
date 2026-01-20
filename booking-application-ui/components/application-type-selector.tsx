'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Hotel, Music } from 'lucide-react';

interface ApplicationTypeSelectorProps {
  onSelect: (type: 'guide' | 'hotel' | 'experience') => void;
}

export function ApplicationTypeSelector({ onSelect }: ApplicationTypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onSelect('guide')}>
        <CardHeader>
          <Users className="w-12 h-12 text-primary mb-4" />
          <CardTitle>Apply as Guide</CardTitle>
          <CardDescription>
            Become a certified guide and share your knowledge about heritage sites
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full">Select</Button>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onSelect('hotel')}>
        <CardHeader>
          <Hotel className="w-12 h-12 text-primary mb-4" />
          <CardTitle>Apply as Hotel</CardTitle>
          <CardDescription>
            List your heritage hotel and offer unique cultural experiences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full">Select</Button>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onSelect('experience')}>
        <CardHeader>
          <Music className="w-12 h-12 text-primary mb-4" />
          <CardTitle>Apply as Experience Provider</CardTitle>
          <CardDescription>
            Offer music shows or workshops related to heritage and culture
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full">Select</Button>
        </CardContent>
      </Card>
    </div>
  );
}
