"use client";

import { useState, useEffect, useCallback } from "react";
import { GeoLocationCoordinates } from "@/types/attendance";
import { attendanceService } from "@/services/attendanceService";

interface GeolocationState {
  coordinates: GeoLocationCoordinates | null;
  distanceMeters: number | null;
  allowedRadiusMeters: number;
  isWithinGeofence: boolean;
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    distanceMeters: null,
    allowedRadiusMeters: 150,
    isWithinGeofence: false,
    loading: true,
    error: null,
  });

  const getPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Perangkat atau browser Anda tidak mendukung GPS / Geolocation.",
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const coords: GeoLocationCoordinates = { latitude, longitude, accuracy };
        const geoCheck = attendanceService.checkGeofence(latitude, longitude);

        setState({
          coordinates: coords,
          distanceMeters: geoCheck.distanceMeters,
          allowedRadiusMeters: geoCheck.allowedRadiusMeters,
          isWithinGeofence: geoCheck.isWithinGeofence,
          loading: false,
          error: null,
        });
      },
      (err) => {
        let errorMsg = "Gagal mendapatkan lokasi GPS.";
        if (err.code === err.PERMISSION_DENIED) {
          errorMsg = "Akses lokasi ditolak. Harap izinkan akses lokasi di browser untuk absensi.";
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          errorMsg = "Informasi lokasi GPS tidak tersedia.";
        } else if (err.code === err.TIMEOUT) {
          errorMsg = "Waktu permintaan lokasi habis. Silakan coba lagi.";
        }

        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMsg,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  useEffect(() => {
    getPosition();
  }, [getPosition]);

  /**
   * Helper for development/demo: Simulate being right inside CV. Asia Plastik factory
   */
  const simulateOfficeLocation = () => {
    const factoryLat = parseFloat(process.env.NEXT_PUBLIC_OFFICE_LATITUDE || "-7.424312");
    const factoryLng = parseFloat(process.env.NEXT_PUBLIC_OFFICE_LONGITUDE || "112.721415");
    const coords = { latitude: factoryLat, longitude: factoryLng, accuracy: 5 };
    const geoCheck = attendanceService.checkGeofence(factoryLat, factoryLng);

    setState({
      coordinates: coords,
      distanceMeters: geoCheck.distanceMeters,
      allowedRadiusMeters: geoCheck.allowedRadiusMeters,
      isWithinGeofence: geoCheck.isWithinGeofence,
      loading: false,
      error: null,
    });
  };

  return {
    ...state,
    refreshLocation: getPosition,
    simulateOfficeLocation,
  };
}
