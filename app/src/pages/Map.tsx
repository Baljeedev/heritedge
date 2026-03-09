"use client"

import { MapControls } from "@/core/components/map/map-controls"
import { SiteDetailPanel } from "@/core/components/map/site-detail-panel"
import { Navigation } from "@/core/components/navigation"
import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useHeritageSites } from "@/lib/api"
import { Loader2 } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for selected/unselected markers
const defaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const selectedIcon = L.divIcon({
  className: '',
  html: `<div style="
    width: 32px;
    height: 32px;
    background: #b45309;
    border: 3px solid #fff;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: 0 3px 8px rgba(0,0,0,0.4);
  "></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -34],
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MarkerWithIcon = Marker as any;

interface MapComponentProps {
  onSiteSelect: (siteId: string) => void;
  selectedSiteId: string | null;
  selectedCity?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
}

const MapComponent = ({ onSiteSelect, selectedSiteId, selectedCity, initialCenter, initialZoom }: MapComponentProps) => {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get("search")
  const { t } = useI18n()

  const { data, isLoading, error } = useHeritageSites({
    limit: 100,
    search: searchQuery || undefined,
    city: selectedCity || undefined,
  });
  const sites = data?.sites || [];

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-background to-muted">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{t('loadingHeritageSites')}</p>
        </div>
      </div>
    );
  }

  if (error || sites.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-background to-muted">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">{t('unableToLoadHeritageSites')}</p>
          <p className="text-sm text-muted-foreground">{t('makeSureBackendRunning')}</p>
        </div>
      </div>
    );
  }

  // Use initial center if provided, otherwise center on India
  const mapCenter: [number, number] = initialCenter || [20.5937, 78.9629];
  const mapZoom = initialZoom || 5;

  return (
    <>
      <MapContainer
        {...({
          center: mapCenter as [number, number],
          zoom: mapZoom,
          scrollWheelZoom: true,
          style: { height: "100%", width: "100%" },
        } as Record<string, unknown>)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {sites.map((site) => {
          const position: [number, number] = [site.coordinates.latitude, site.coordinates.longitude];
          const isSelected = selectedSiteId === site._id;

          return (
            <MarkerWithIcon
              key={site._id}
              position={position}
              icon={isSelected ? selectedIcon : defaultIcon}
              eventHandlers={{
                click: () => onSiteSelect(site._id)
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={site.image || "/placeholder.svg"}
                      alt={site.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-bold text-sm">{site.name}</h3>
                      <p className="text-xs text-gray-600">
                        {site.city || ''}{site.city && site.state ? ', ' : ''}{site.state || ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-yellow-500">★</span>
                    <span className="text-xs">{site.rating?.toFixed(1) || 'N/A'}</span>
                    <span className="text-xs text-gray-500">({site.reviewCount || 0} reviews)</span>
                  </div>

                  <p className="text-xs text-gray-700 line-clamp-2 mb-2">
                    {site.description}
                  </p>

                  <div className="flex gap-1 flex-wrap">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {site.era}
                    </span>
                    {site.unescoWorldHeritage && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        UNESCO
                      </span>
                    )}
                  </div>
                </div>
              </Popup>
            </MarkerWithIcon>
          );
        })}
      </MapContainer>
    </>
  );
};

export default function MapPage() {
  const [searchParams] = useSearchParams()
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null)
  const [selectedSites, setSelectedSites] = useState<string[]>([])
  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>(undefined)
  const [mapZoom, setMapZoom] = useState<number | undefined>(undefined)
  const [selectedCity, setSelectedCity] = useState<string>("")
  const { t } = useI18n()

  const { data: sitesData } = useHeritageSites({ limit: 100 })

  // Derive unique cities from sites
  const cities = sitesData?.sites
    ? Array.from(new Set(sitesData.sites.map(s => s.city).filter(Boolean))).sort() as string[]
    : []

  // Read site query parameter and select the site on mount
  useEffect(() => {
    const siteIdFromUrl = searchParams.get("site")
    const searchQuery = searchParams.get("search")

    if (siteIdFromUrl && sitesData?.sites) {
      const site = sitesData.sites.find(s => s._id === siteIdFromUrl)
      if (site) {
        Promise.resolve().then(() => {
          setSelectedSiteId(siteIdFromUrl)
          setMapCenter([site.coordinates.latitude, site.coordinates.longitude])
          setMapZoom(12)
        })
      }
    } else if (searchQuery) {
      // MapComponent handles filtered results via search query param
    }
  }, [searchParams, sitesData])

  const handleSiteSelect = (siteId: string) => {
    setSelectedSiteId(siteId)
  }

  const handleToggleSite = (siteId: string) => {
    setSelectedSites((prev) => (prev.includes(siteId) ? prev.filter((id) => id !== siteId) : [...prev, siteId]))
  }

  const handleProceedToTripPlanner = () => {
    if (selectedSites.length > 0) {
      const siteIds = selectedSites.join(",")
      window.location.href = `/trip-planner?sites=${siteIds}`
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="flex h-[calc(100vh-60px)]">
        {/* Map Section */}
        <div className="flex-1 relative">
          <MapComponent
            onSiteSelect={handleSiteSelect}
            selectedSiteId={selectedSiteId}
            selectedCity={selectedCity}
            initialCenter={mapCenter}
            initialZoom={mapZoom}
          />

          {/* City Filter Overlay */}
          <div className="absolute top-3 left-3 z-[1000]">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Map Controls */}
          <MapControls
            selectedCount={selectedSites.length}
            onProceed={handleProceedToTripPlanner}
            disabled={selectedSites.length === 0}
          />
        </div>

        {/* Detail Panel */}
        <div className="w-2/5 border-l border-border bg-card overflow-y-auto max-h-full">
          {selectedSiteId ? (
            <SiteDetailPanel
              siteId={selectedSiteId}
              isSelected={selectedSites.includes(selectedSiteId)}
              onToggleSelect={() => handleToggleSite(selectedSiteId)}
            />
          ) : (
            <div className="p-6 flex items-center justify-center h-full text-center text-muted-foreground">
              <p>{t('selectSiteOnMap')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
