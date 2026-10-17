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
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Validasi Lokasi (Geofencing GPS)
            </h4>
            <p className="text-xs text-slate-500">
              Radius Pabrik CV. Asia Plastik: {allowedRadiusMeters} meter
            </p>
          </div>
        </div>

        <div>
          {loading ? (
            <Badge variant="info">Mencari Koordinat GPS...</Badge>
          ) : isWithinGeofence ? (
            <Badge variant="success" className="gap-1.5 py-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Di Dalam Radius Pabrik
            </Badge>
          ) : (
            <Badge variant="danger" className="gap-1.5 py-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Di Luar Radius Pabrik
            </Badge>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase">
            Jarak ke Pabrik
          </span>
          <span className="text-lg font-black text-slate-900 dark:text-white">
            {distanceMeters !== null ? `${distanceMeters} meter` : "Memindai..."}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase">
            Akurasi GPS
          </span>
          <span className="text-lg font-black text-slate-900 dark:text-white">
            {coordinates?.accuracy ? `± ${Math.round(coordinates.accuracy)} meter` : "Memindai..."}
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

        {/* Development testing button: Allows simulating being inside factory without having to travel */}
        <Button
          variant="ghost"
          size="sm"
          onClick={simulateOfficeLocation}
          className="text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50"
        >
          <Navigation className="w-3.5 h-3.5" />
          Mode Uji Coba: Simulasikan di Pabrik
        </Button>
      </div>
    </div>
  );
}
