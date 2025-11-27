import React, { useState, useEffect, useRef, JSX } from "react";
import { Locate } from "lucide-react";
import Swal from "sweetalert2";

// Extend Window interface to include google
declare global {
  interface Window {
    google: typeof google;
  }
}

// Google Maps type declarations
declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: HTMLElement, opts?: MapOptions);
      setCenter(latlng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
      fitBounds(bounds: LatLngBounds): void;
      addListener(eventName: string, handler: Function): void;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setPosition(latlng: LatLng | LatLngLiteral | null): void;
      addListener(eventName: string, handler: Function): void;
    }

    class Geocoder {
      geocode(
        request: GeocoderRequest,
        callback: (results: GeocoderResult[] | null, status: string) => void
      ): void;
    }

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }
    class Circle {
      constructor(opts?: CircleOptions);
      setMap(map: Map | null): void;
      getBounds(): LatLngBounds;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      styles?: any[];
    }

    interface MarkerOptions {
      map?: Map;
      position?: LatLng | LatLngLiteral;
      draggable?: boolean;
      animation?: any;
    }
    interface CircleOptions {
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
      fillColor?: string;
      fillOpacity?: number;
      map?: Map;
      center?: LatLng | LatLngLiteral;
      radius?: number;
      clickable: boolean;
    }

    interface MapMouseEvent {
      latLng: LatLng | null;
    }

    interface GeocoderRequest {
      location?: LatLng | LatLngLiteral;
    }

    interface GeocoderResult {
      formatted_address: string;
    }

    interface LatLngBounds {}

    enum Animation {
      DROP = 1,
    }

    namespace places {
      class Autocomplete {
        constructor(inputField: HTMLInputElement, opts?: AutocompleteOptions);
        bindTo(key: string, target: any): void;
        addListener(eventName: string, handler: Function): void;
        getPlace(): PlaceResult;
      }

      interface AutocompleteOptions {}

      interface PlaceResult {
        formatted_address?: string;
        geometry?: {
          location: LatLng;
          viewport?: LatLngBounds;
        };
      }
    }
  }
}

interface LatLng {
  lat: number;
  lng: number;
}

interface MapInstance {
  map: google.maps.Map | null;
  marker: google.maps.Marker | null;
  autocomplete: google.maps.places.Autocomplete | null;
  radiusCircle: google.maps.Circle | null;
}

// Location data to be stored in DB
export interface LocationData {
  address: string;
  coordinates: LatLng | null;
}
export interface RadiusLimit {
  center: LatLng; // Center point for radius restriction
  radiusKm: number; // Radius in kilometers
}

// Component Props
interface AddressLocationSelectorProps {
  value: LocationData;
  onChange?: (data: LocationData) => void;
  readOnly?: boolean;
  label?: string;
  placeholder?: string;
  className?: string;
  radiusLimit?: RadiusLimit; // New prop for radius limitation
}

// Label Component
const Label = ({ htmlFor, className, children }: any) => (
  <label htmlFor={htmlFor} className={className}>
    {children}
  </label>
);

// Input Component
const Input = ({ className, ...props }: any) => (
  <input
    className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  />
);

export default function AddressLocationSelector({
  value,
  onChange,
  readOnly = false,
  label = "Registered Business Address",
  placeholder = "Enter Your Address",
  className = " w-full h-[490px] rounded-xl ",
  radiusLimit, // New prop
}: AddressLocationSelectorProps): JSX.Element {
  const [mapCenter, setMapCenter] = useState<LatLng>(
    value.coordinates || { lat: 35.2271, lng: -80.8431 }
  );
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
  const mapRef = useRef<MapInstance>({
    map: null,
    marker: null,
    autocomplete: null,
    radiusCircle: null,
  });
  const calculateDistance = (point1: LatLng, point2: LatLng): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((point2.lat - point1.lat) * Math.PI) / 180;
    const dLon = ((point2.lng - point1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((point1.lat * Math.PI) / 180) *
        Math.cos((point2.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Check if a point is within the allowed radius
  const isWithinRadius = (point: LatLng): boolean => {
    if (!radiusLimit) return true;
    const distance = calculateDistance(radiusLimit.center, point);
    return distance <= radiusLimit.radiusKm;
  };

  useEffect(() => {
    // Load Google Maps script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA7sg-dUaG5v6JWizJoU_0E608O2ePDxz0&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsMapLoaded(true);
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (isMapLoaded && window.google && !mapRef.current.map) {
      initializeMap();
    }
  }, [isMapLoaded]);

  // Update map when value changes externally
  useEffect(() => {
    if (mapRef.current.map && mapRef.current.marker && value.coordinates) {
      mapRef.current.map.setCenter(value.coordinates);
      mapRef.current.marker.setPosition(value.coordinates);
      setMapCenter(value.coordinates);
    }
  }, [value.coordinates]);

  const initializeMap = (): void => {
    const mapElement = document.getElementById("map");
    if (!mapElement) return;
    const initialCenter = radiusLimit ? radiusLimit.center : mapCenter;

    const map = new google.maps.Map(mapElement, {
      center: initialCenter,
      zoom: value.coordinates ? 15 : 14,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "on" }],
        },
      ],
    });
    if (radiusLimit && !readOnly) {
      const circle = new google.maps.Circle({
        strokeColor: "#2563eb",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#3b82f6",
        fillOpacity: 0.15,
        map: map,
        center: radiusLimit.center,
        radius: radiusLimit.radiusKm * 1000, // Convert km to meters
        clickable: false, // Make circle non-clickable so map clicks work
      });
      mapRef.current.radiusCircle = circle;

      // Fit map to show the entire circle
      map.fitBounds(circle.getBounds()!);
    }

    // Add marker
    const marker = new google.maps.Marker({
      map: map,
      position: value.coordinates || undefined,
      draggable: !readOnly,
      animation: google.maps.Animation.DROP,
    });

    mapRef.current.map = map;
    mapRef.current.marker = marker;

    if (!readOnly) {
      // Click on map to set marker
      map.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          const newCoords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
          // Check if within radius limit
          if (radiusLimit && !isWithinRadius(newCoords)) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: `Selected location is outside the allowed ${radiusLimit.radiusKm}km radius. Please select a location within the restricted area.`,
              timer: 1500,
              showConfirmButton: false,
            });
            return;
          }

          marker.setPosition(e.latLng);
          reverseGeocode(e.latLng, newCoords);
        }
      });

      // Drag marker
      marker.addListener("dragend", (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          const newCoords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
          // Check if within radius limit
          if (radiusLimit && !isWithinRadius(newCoords)) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: `Marker cannot be placed outside the allowed ${radiusLimit.radiusKm}km radius. Resetting to previous position.`,
              timer: 1500,
              showConfirmButton: false,
            });

            // Reset marker to previous valid position
            marker.setPosition(value.coordinates || radiusLimit.center || null);
            return;
          }

          reverseGeocode(e.latLng, newCoords);
        }
      });

      // Initialize autocomplete
      const input = document.getElementById(
        "address-input"
      ) as HTMLInputElement;
      if (input) {
        const autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo("bounds", map);
        mapRef.current.autocomplete = autocomplete;

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place.geometry || !place.geometry.location) return;
          const newCoords = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };

          // Check if within radius limit
          if (radiusLimit && !isWithinRadius(newCoords)) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: `Selected address is outside the allowed ${radiusLimit.radiusKm}km radius. Please choose an address within the restricted area.`,
              timer: 1500,
              showConfirmButton: false,
            });

            return;
          }

          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
          }

          marker.setPosition(place.geometry.location);
          if (onChange) {
            onChange({
              address: place.formatted_address || "",
              coordinates: newCoords,
            });
          }
        });
      }
    }
  };

  const reverseGeocode = (
    latLng: google.maps.LatLng | LatLng,
    coords: LatLng
  ): void => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results && results[0] && onChange) {
        onChange({
          address: results[0].formatted_address,
          coordinates: coords,
        });
      }
    });
  };

  const getCurrentLocation = (): void => {
    if (readOnly) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos: LatLng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          // Check if within radius limit
          if (radiusLimit && !isWithinRadius(pos)) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: `Your current location is outside the allowed ${radiusLimit.radiusKm}km radius. Please select a location within the restricted area.`,
              timer: 1500,
              showConfirmButton: false,
            });
            return;
          }

          setMapCenter(pos);

          if (mapRef.current.map && mapRef.current.marker) {
            mapRef.current.map.setCenter(pos);
            mapRef.current.map.setZoom(15);
            mapRef.current.marker.setPosition(pos);
            reverseGeocode(pos, pos);
          }
        },
        () => {
          alert("Error: The Geolocation service failed.");
        }
      );
    } else {
      alert("Error: Your browser doesn't support geolocation.");
    }
  };

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (!readOnly && onChange) {
      onChange({
        ...value,
        address: e.target.value,
      });
    }
  };

  return (
    <div className="w-full">
      <div className="space-y-6 w-full">
        {!readOnly && (
          <div className="space-y-1">
            <Label
              htmlFor="address-input"
              className="text-[14px] font-semibold"
            >
              {label}
              {radiusLimit && (
                <span className="ml-2 text-xs text-blue-600 font-normal">
                  (Limited to {radiusLimit.radiusKm}km radius)
                </span>
              )}
            </Label>

            <div className="relative">
              <Input
                id="address-input"
                type="text"
                value={value.address}
                onChange={handleAddressChange}
                placeholder={placeholder}
                readOnly={readOnly}
                disabled={readOnly}
                className="h-[44px] bg-white w-full"
              />
              {!readOnly && (
                <button
                  onClick={getCurrentLocation}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Use current location"
                  type="button"
                >
                  <Locate className="w-5 h-5 text-gray-600" />
                </button>
              )}
            </div>
          </div>
        )}

        <div
          className={` relative bg-gray-200 overflow-hidden shadow-md ${className}`}
        >
          {!isMapLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading map...</p>
                <p className="text-sm text-gray-500 mt-2 px-4">
                  Note: This demo uses a placeholder API key. Add your Google
                  Maps API key to enable full functionality.
                </p>
              </div>
            </div>
          ) : null}
          <div id="map" className={className}></div>
        </div>
      </div>
    </div>
  );
}
