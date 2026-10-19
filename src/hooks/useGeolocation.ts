"use client";

import { useState, useEffect, useCallback } from "react";
import { GeoLocationCoordinates } from "@/types/attendance";
import { attendanceService, OFFICIAL_OFFICES, OfficeLocationConfig } from "@/services/attendanceService";

export interface GeolocationState {
  coordinates: GeoLocationCoordinates | null;
  distanceMeters: number | null;
  allowedRadiusMeters: number;
  isWithinGeofence: boolean;
  closestOffice: OfficeLocationConfig | null;
  allOffices: (OfficeLocationConfig & { distanceMeters: number; isWithinGeofence: boolean })[];
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    distanceMeters: null,
    allowedRadiusMeters: 150,
    isWithinGeofence: false,
    closestOffice: null,
    allOffices: [],
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
          closestOffice: geoCheck.closestOffice,
          allOffices: geoCheck.allOffices,
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
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Perangkat atau browser Anda tidak mendukung GPS / Geolocation.",
      }));
      return;
    }

    getPosition();

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const coords: GeoLocationCoordinates = { latitude, longitude, accuracy };
        const geoCheck = attendanceService.checkGeofence(latitude, longitude);

        setState({
          coordinates: coords,
          distanceMeters: geoCheck.distanceMeters,
          allowedRadiusMeters: geoCheck.allowedRadiusMeters,
          isWithinGeofence: geoCheck.isWithinGeofence,
          closestOffice: geoCheck.closestOffice,
          allOffices: geoCheck.allOffices,
          loading: false,
          error: null,
        });
      },
      (err) => {
        setState((prev) => {
          if (prev.coordinates) return prev;
          let errorMsg = "Gagal mendapatkan lokasi GPS.";
          if (err.code === err.PERMISSION_DENIED) {
            errorMsg = "Akses lokasi ditolak. Harap izinkan akses lokasi di browser untuk absensi.";
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            errorMsg = "Informasi lokasi GPS tidak tersedia.";
          } else if (err.code === err.TIMEOUT) {
            errorMsg = "Waktu permintaan lokasi habis. Silakan coba lagi.";
          }
          return { ...prev, loading: false, error: errorMsg };
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [getPosition]);

  /**
   * Helper for development/demo: Simulate being right inside Kantor 1 or Kantor 2
   */
  const simulateOfficeLocation = (officeIndex: number = 0) => {
    const target = OFFICIAL_OFFICES[officeIndex] || OFFICIAL_OFFICES[0];
    const coords = { latitude: target.latitude, longitude: target.longitude, accuracy: 5 };
    const geoCheck = attendanceService.checkGeofence(target.latitude, target.longitude);

    setState({
      coordinates: coords,
      distanceMeters: geoCheck.distanceMeters,
      allowedRadiusMeters: geoCheck.allowedRadiusMeters,
      isWithinGeofence: geoCheck.isWithinGeofence,
      closestOffice: geoCheck.closestOffice,
      allOffices: geoCheck.allOffices,
      loading: false,
      error: null,
    });
  };

  return {
    ...state,
    offices: OFFICIAL_OFFICES,
    refreshLocation: getPosition,
    simulateOfficeLocation,
  };
}
