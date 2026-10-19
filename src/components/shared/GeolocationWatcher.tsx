"use client";

import React from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, RefreshCw, Navigation, AlertCircle, CheckCircle2 } from "lucide-react";

export function GeolocationWatcher() {
  const {
    coordinates,
    distanceMeters,
    allowedRadiusMeters,
    isWithinGeofence,
    closestOffice,
    allOffices,
    loading,
    error,
    refreshLocation,
    simulateOfficeLocation,
  } = useGeolocation();

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-5 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Validasi Lokasi (Geofencing GPS)
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
                2 Kantor Terdaftar
              </span>
            </h4>
            <p className="text-xs text-slate-500">
              Radius Presensi: {allowedRadiusMeters} meter dari Kantor 1 atau Kantor 2
            </p>
          </div>
        </div>

        <div>
          {loading ? (
            <Badge variant="info">Mencari Koordinat GPS...</Badge>
          ) : isWithinGeofence ? (
            <Badge variant="success" className="gap-1.5 py-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Di Dalam Radius {closestOffice?.name ? `(${closestOffice.name})` : "Pabrik"}
            </Badge>
          ) : (
            <Badge variant="danger" className="gap-1.5 py-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Di Luar Radius Pabrik
            </Badge>
          )}
        </div>
      </div>

      {/* Offices list with live distance badges & Google Maps links */}
      {allOffices && allOffices.length > 0 && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {allOffices.map((office) => (
            <div
              key={office.id}
              className={`p-3 rounded-xl border transition-all ${
                office.isWithinGeofence
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200"
                  : "bg-white dark:bg-slate-800/80 border-slate-200/70 dark:border-slate-700/70 text-slate-800 dark:text-slate-200"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold truncate">{office.name}</span>
                <span
                  className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md ${
                    office.isWithinGeofence
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {office.distanceMeters >= 1000
                    ? `${(office.distanceMeters / 1000).toFixed(1)} km`
                    : `${office.distanceMeters} m`}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Maksimal {office.radiusMeters}m</span>
                <a
                  href={office.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center gap-0.5"
                >
                  Buka Maps ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase">
            Jarak Terdekat
          </span>
          <span className="text-base font-black text-slate-900 dark:text-white">
            {distanceMeters !== null
              ? distanceMeters >= 1000
                ? `${(distanceMeters / 1000).toFixed(1)} km`
                : `${distanceMeters} meter`
              : "Memindai..."}
          </span>
          <span className="text-[10px] text-slate-500 block truncate mt-0.5">
            ke {closestOffice?.name || "Kantor Terdekat"}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase">
            Akurasi GPS Perangkat
          </span>
          <span className="text-base font-black text-slate-900 dark:text-white">
            {coordinates?.accuracy ? `± ${Math.round(coordinates.accuracy)} meter` : "Memindai..."}
          </span>
          <span className="text-[10px] text-slate-500 block truncate mt-0.5">
            Sensor Satelit / Hardware
          </span>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase">
            Koordinat Saat Ini
          </span>
          <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 block truncate mt-1">
            {coordinates
              ? `${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}`
              : "Menunggu GPS"}
          </span>
          <span className="text-[10px] text-slate-500 block truncate mt-0.5">
            Latitude, Longitude
          </span>
        </div>
      </div>

      {error && (
        <div className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-400 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={refreshLocation}
          isLoading={loading}
          className="text-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Perbarui Lokasi GPS
        </Button>

        {/* Development testing buttons: Allows simulating being inside Kantor 1 or Kantor 2 */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => simulateOfficeLocation(0)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50"
          >
            <Navigation className="w-3.5 h-3.5" />
            Uji: Kantor 1
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => simulateOfficeLocation(1)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50"
          >
            <Navigation className="w-3.5 h-3.5" />
            Uji: Kantor 2
          </Button>
        </div>
      </div>
    </div>
  );
}
