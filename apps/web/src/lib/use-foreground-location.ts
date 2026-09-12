"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { LocationReading } from "@space-coast-explorer/maps";

export type LocationStatus = "idle" | "requesting" | "active" | "denied" | "unavailable" | "timeout" | "error";

export function useForegroundLocation() {
  const watcherId = useRef<number | undefined>(undefined);
  const [status, setStatus] = useState<LocationStatus>("idle");
  const [reading, setReading] = useState<LocationReading | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const stop = useCallback(() => {
    if (watcherId.current !== undefined && "geolocation" in navigator) {
      navigator.geolocation.clearWatch(watcherId.current);
      watcherId.current = undefined;
    }
  }, []);

  const start = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setStatus("unavailable");
      return;
    }

    if (watcherId.current !== undefined) {
      return;
    }

    setStatus("requesting");
    watcherId.current = navigator.geolocation.watchPosition(
      (position) => {
        setReading({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        });
        setStatus("active");
        setErrorMessage(undefined);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setStatus("denied");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setStatus("unavailable");
        } else if (error.code === error.TIMEOUT) {
          setStatus("timeout");
        } else {
          setStatus("error");
        }
        setErrorMessage(error.message);
        stop();
      },
      {
        enableHighAccuracy: true,
        timeout: 12_000,
        maximumAge: 8_000
      }
    );
  }, [stop]);

  useEffect(() => stop, [stop]);

  return { status, reading, errorMessage, start, stop };
}
