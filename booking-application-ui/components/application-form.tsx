'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { applicationsApi } from '@/lib/api/applications';
import { uploadApi } from '@/lib/api/upload';
import { FileUpload } from '@/components/ui/file-upload';
import { toast } from 'sonner';
import { useI18n } from '@/lib/i18n/context';

interface ApplicationFormProps {
  applicationType: 'guide' | 'hotel' | 'experience';
  onSuccess: () => void;
  onCancel: () => void;
}

export function ApplicationForm({ applicationType, onSuccess, onCancel }: ApplicationFormProps) {
  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [guideLanguagesInput, setGuideLanguagesInput] = useState<string>('');
  const [guideImageFile, setGuideImageFile] = useState<File | null>(null);
  const [guideVideoFile, setGuideVideoFile] = useState<File | null>(null);
  const [hotelImageFiles, setHotelImageFiles] = useState<File[]>([]);
  const [experienceImageFile, setExperienceImageFile] = useState<File | null>(null);
  const [experienceVideoFile, setExperienceVideoFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: name === 'pricePerDay' || name === 'price' || name === 'experience' || name === 'age' || name === 'maxParticipants' || name === 'maxOccupancy' || name === 'pricePerNight' || name === 'min' || name === 'max' || name === 'latitude' || name === 'longitude' || name === 'discountPercentage' || name === 'listingFee' || name === 'referralFee'
        ? (value === '' ? undefined : Number(value))
        : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleCheckChange = (name: string, checked: boolean) => {
    setFormData((prev: any) => ({ ...prev, [name]: checked }));
  };

  const handleArrayChange = (name: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value.split(',').map((item) => item.trim()).filter(Boolean),
    }));
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let payload = { ...formData };

      // Normalize guide languages from comma-separated string
      if (applicationType === 'guide') {
        // Upload image/video if provided
        let imageUrl = payload.image || '';
        let videoUrl = payload.video || '';

        if (guideImageFile) {
          const uploadResult = await uploadApi.upload('guide', guideImageFile);
          imageUrl = uploadResult.url;
        }

        if (guideVideoFile) {
          const uploadResult = await uploadApi.upload('guide', guideVideoFile);
          videoUrl = uploadResult.url;
        }

        payload = {
          ...payload,
          image: imageUrl,
          video: videoUrl,
          languages: guideLanguagesInput
            .split(',')
            .map((l) => l.trim())
            .filter(Boolean),
        };
      }

      if (applicationType === 'hotel') {
        let images: string[] = payload.images || [];

        if (hotelImageFiles.length > 0) {
          const uploadResult = await uploadApi.uploadMultiple('hotel', hotelImageFiles);
          const newUrls = uploadResult.files.map((f) => f.url);
          images = [...images, ...newUrls];
        }

        payload = {
          ...payload,
          images,
        };
      }

      if (applicationType === 'experience') {
        let imageUrl = payload.image || '';
        let videoUrl = payload.video || '';

        if (experienceImageFile) {
          const uploadResult = await uploadApi.upload('experience', experienceImageFile);
          imageUrl = uploadResult.url;
        }

        if (experienceVideoFile) {
          const uploadResult = await uploadApi.upload('experience', experienceVideoFile);
          videoUrl = uploadResult.url;
        }

        payload = {
          ...payload,
          image: imageUrl,
          video: videoUrl,
        };
      }

      await applicationsApi.submit(applicationType, payload);
      toast.success('Application submitted successfully!');
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Guide Form
  if (applicationType === 'guide') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Apply as Guide</CardTitle>
          <CardDescription>Fill in all required information to apply as a guide</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input id="name" name="name" value={formData.name || ''} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="specialization">Specialization *</Label>
                <Input id="specialization" name="specialization" value={formData.specialization || ''} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="bio">Bio *</Label>
                <Textarea id="bio" name="bio" value={formData.bio || ''} onChange={handleChange} required rows={4} />
              </div>
              <div>
                <Label htmlFor="experience">Years of Experience *</Label>
                <Input id="experience" name="experience" type="number" value={formData.experience || ''} onChange={handleChange} required min={0} />
              </div>
              <div>
                <Label htmlFor="pricePerDay">Price per Day (INR) *</Label>
                <Input id="pricePerDay" name="pricePerDay" type="number" value={formData.pricePerDay || ''} onChange={handleChange} required min={0} />
              </div>
              <div>
                <Label htmlFor="languages">Languages (comma-separated) *</Label>
                <Input
                  id="languages"
                  name="languages"
                  value={guideLanguagesInput}
                  onChange={(e) => setGuideLanguagesInput(e.target.value)}
                  placeholder="English, Hindi, Spanish"
                  required
                />
              </div>
              <div>
                <FileUpload
                  label="Profile Image (Optional)"
                  value={guideImageFile || formData.image || null}
                  onChange={(file) => setGuideImageFile(file)}
                  fileType="image"
                />
              </div>
              <div>
                <FileUpload
                  label="Intro Video (Optional)"
                  value={guideVideoFile || formData.video || null}
                  onChange={(file) => setGuideVideoFile(file)}
                  fileType="video"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="isIntern" checked={formData.isIntern || false} onCheckedChange={(checked) => handleCheckChange('isIntern', checked as boolean)} />
                <Label htmlFor="isIntern">I am an intern (age 13-17)</Label>
              </div>
              {formData.isIntern && (
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" name="age" type="number" value={formData.age || ''} onChange={handleChange} min={13} max={17} />
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Application
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  // Hotel Form
  if (applicationType === 'hotel') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Apply as Hotel</CardTitle>
          <CardDescription>Fill in all required information to apply as a hotel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Hotel Name *</Label>
                <Input id="name" name="name" value={formData.name || ''} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="chain">Chain</Label>
                <Input id="chain" name="chain" value={formData.chain || ''} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input id="location" name="location" value={formData.location || ''} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input id="city" name="city" value={formData.city || ''} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input id="state" name="state" value={formData.state || ''} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="country">Country *</Label>
                <Input id="country" name="country" value={formData.country || 'India'} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="latitude">Latitude *</Label>
                <Input id="latitude" name="latitude" type="number" step="any" value={formData.coordinates?.latitude || ''} onChange={(e) => handleNestedChange('coordinates', 'latitude', Number(e.target.value))} required />
              </div>
              <div>
                <Label htmlFor="longitude">Longitude *</Label>
                <Input id="longitude" name="longitude" type="number" step="any" value={formData.coordinates?.longitude || ''} onChange={(e) => handleNestedChange('coordinates', 'longitude', Number(e.target.value))} required />
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} required rows={4} />
              </div>
              <div className="md:col-span-2">
                <FileUpload
                  label="Hotel Images (Optional)"
                  value={hotelImageFiles}
                  onChange={() => {}}
                  multiple
                  fileType="image"
                  onMultipleChange={(files) => setHotelImageFiles(files)}
                />
              </div>
              <div>
                <Label htmlFor="priceMin">Price per Night - Min (INR) *</Label>
                <Input id="priceMin" name="min" type="number" value={formData.pricePerNight?.min || ''} onChange={(e) => handleNestedChange('pricePerNight', 'min', Number(e.target.value))} required min={0} />
              </div>
              <div>
                <Label htmlFor="priceMax">Price per Night - Max (INR) *</Label>
                <Input id="priceMax" name="max" type="number" value={formData.pricePerNight?.max || ''} onChange={(e) => handleNestedChange('pricePerNight', 'max', Number(e.target.value))} required min={0} />
              </div>
              <div>
                <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                <Input id="amenities" name="amenities" value={formData.amenities?.join(', ') || ''} onChange={(e) => handleArrayChange('amenities', e.target.value)} placeholder="WiFi, Pool, Restaurant" />
              </div>
              <div>
                <Label htmlFor="partnershipType">Partnership Type *</Label>
                <Select value={formData.partnershipType || 'listing'} onValueChange={(value) => handleSelectChange('partnershipType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="listing">Listing</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="discountPercentage">Discount Percentage</Label>
                <Input id="discountPercentage" name="discountPercentage" type="number" value={formData.discountPercentage || ''} onChange={handleChange} min={0} max={100} />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Heritage Features</Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="hasLivingHistoryRooms" checked={formData.heritageFeatures?.hasLivingHistoryRooms || false} onCheckedChange={(checked) => handleNestedChange('heritageFeatures', 'hasLivingHistoryRooms', checked)} />
                  <Label htmlFor="hasLivingHistoryRooms">Living History Rooms</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="hasHistoryLectures" checked={formData.heritageFeatures?.hasHistoryLectures || false} onCheckedChange={(checked) => handleNestedChange('heritageFeatures', 'hasHistoryLectures', checked)} />
                  <Label htmlFor="hasHistoryLectures">History Lectures</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="hasCulturalMeals" checked={formData.heritageFeatures?.hasCulturalMeals || false} onCheckedChange={(checked) => handleNestedChange('heritageFeatures', 'hasCulturalMeals', checked)} />
                  <Label htmlFor="hasCulturalMeals">Cultural Meals</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="hasStorytellingEvenings" checked={formData.heritageFeatures?.hasStorytellingEvenings || false} onCheckedChange={(checked) => handleNestedChange('heritageFeatures', 'hasStorytellingEvenings', checked)} />
                  <Label htmlFor="hasStorytellingEvenings">Storytelling Evenings</Label>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Application
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  // Experience Form
  return (
    <Card>
      <CardHeader>
        <CardTitle>Apply as Experience Provider</CardTitle>
        <CardDescription>Fill in all required information to apply as a music show or workshop provider</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Experience Type *</Label>
              <Select value={formData.type || 'music'} onValueChange={(value) => handleSelectChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="music">Music Show</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input id="name" name="name" value={formData.name || ''} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} required rows={4} />
            </div>
            <div>
              <Label htmlFor="price">Price (INR) *</Label>
              <Input id="price" name="price" type="number" value={formData.price || ''} onChange={handleChange} required min={0} />
            </div>
            <div>
              <Label htmlFor="image">Image URL *</Label>
              <Input id="image" name="image" value={formData.image || ''} onChange={handleChange} type="url" required />
            </div>
            {formData.type === 'music' && (
              <>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input id="duration" name="duration" value={formData.duration || ''} onChange={handleChange} placeholder="e.g., 2 hours" />
                </div>
                <div>
                  <Label htmlFor="venue">Venue</Label>
                  <Input id="venue" name="venue" value={formData.venue || ''} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="genre">Genre</Label>
                  <Input id="genre" name="genre" value={formData.genre || ''} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="performers">Performers (comma-separated)</Label>
                  <Input id="performers" name="performers" value={formData.performers?.join(', ') || ''} onChange={(e) => handleArrayChange('performers', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="schedule">Schedule (comma-separated)</Label>
                  <Input id="schedule" name="schedule" value={formData.schedule?.join(', ') || ''} onChange={(e) => handleArrayChange('schedule', e.target.value)} />
                </div>
              </>
            )}
            {formData.type === 'workshop' && (
              <>
                <div>
                  <Label htmlFor="instructor">Instructor</Label>
                  <Input id="instructor" name="instructor" value={formData.instructor || ''} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="skillLevel">Skill Level</Label>
                  <Select value={formData.skillLevel || 'beginner'} onValueChange={(value) => handleSelectChange('skillLevel', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Input id="maxParticipants" name="maxParticipants" type="number" value={formData.maxParticipants || ''} onChange={handleChange} min={1} />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="materialsIncluded" checked={formData.materialsIncluded || false} onCheckedChange={(checked) => handleCheckChange('materialsIncluded', checked as boolean)} />
                  <Label htmlFor="materialsIncluded">Materials Included</Label>
                </div>
                <div>
                  <Label htmlFor="topics">Topics (comma-separated)</Label>
                  <Input id="topics" name="topics" value={formData.topics?.join(', ') || ''} onChange={(e) => handleArrayChange('topics', e.target.value)} />
                </div>
              </>
            )}
          </div>
          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Application
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
