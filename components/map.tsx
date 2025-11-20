import React, { useState, useEffect, useRef, JSX } from "react";
import { Locate } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

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
}

// Location data to be stored in DB
export interface LocationData {
  address: string;
  coordinates: LatLng | null;
}

// Component Props
interface AddressLocationSelectorProps {
  value: LocationData;
  onChange?: (data: LocationData) => void;
  readOnly?: boolean;
  label?: string;
  placeholder?: string;
  className?: string;
}

export default function AddressLocationSelector({
  value,
  onChange,
  readOnly = false,
  label = "Registered Business Address",
  placeholder = "Enter Your Address",
  className = " w-full h-[490px] rounded-xl ",
}: AddressLocationSelectorProps): JSX.Element {
  const [mapCenter, setMapCenter] = useState<LatLng>(
    value.coordinates || { lat: 35.2271, lng: -80.8431 }
  );
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
  const mapRef = useRef<MapInstance>({
    map: null,
    marker: null,
    autocomplete: null,
  });

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

    const map = new google.maps.Map(mapElement, {
      center: mapCenter,
      zoom: value.coordinates ? 15 : 14,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "on" }],
        },
      ],
    });

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
          marker.setPosition(e.latLng);
          reverseGeocode(e.latLng, newCoords);
        }
      });

      // Drag marker
      marker.addListener("dragend", (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          const newCoords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
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

          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
          }

          const newCoords = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };

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
                className="h-[44px] bg-white"
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
