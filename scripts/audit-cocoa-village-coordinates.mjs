#!/usr/bin/env node

import { readFileSync } from "node:fs";

const contentPath = new URL("../apps/web/src/lib/content.ts", import.meta.url);
const content = readFileSync(contentPath, "utf8");

const referenceStops = [
  { sequence: 1, name: "Parrish Grove Inn / Pette House", address: "536 Delannoy Ave", latitude: 28.351836, longitude: -80.724905, confidence: "High" },
  { sequence: 2, name: "Porcher House", address: "434 Delannoy Ave", latitude: 28.353867, longitude: -80.725233, confidence: "High" },
  { sequence: 3, name: "Sur Le Parc", address: "Near Florida Ave / west of City Hall", latitude: undefined, longitude: undefined, confidence: "Low" },
  { sequence: 4, name: "St. Mark's Episcopal Church", address: "4 Church St", latitude: 28.353367, longitude: -80.724667, confidence: "High" },
  { sequence: 5, name: "Hindle Building", address: "Historic Cocoa Village", latitude: undefined, longitude: undefined, confidence: "Low" },
  { sequence: 6, name: "Derby Street Chapel", address: "121 Derby St / Derby & Brevard", latitude: 28.3509, longitude: -80.726083, confidence: "High" },
  { sequence: 7, name: "S.F. Travis & Company", address: "300-302 Delannoy Ave", latitude: 28.355783, longitude: -80.7253, confidence: "High" },
  { sequence: 8, name: "Masonic Temple / Village Tower", address: "315 Brevard Ave", latitude: 28.354928, longitude: -80.726233, confidence: "High" },
  { sequence: 9, name: "Blair Building", address: "Historic Cocoa Village", latitude: undefined, longitude: undefined, confidence: "Low" },
  { sequence: 10, name: "Brevard County State Bank", address: "401 Delannoy Ave / Harrison & Delannoy", latitude: 28.354893, longitude: -80.725525, confidence: "High" },
  { sequence: 11, name: "Cocoa Village Playhouse", address: "300 Brevard Ave", latitude: 28.355283, longitude: -80.726133, confidence: "High" }
];

const titleAliases = new Map([
  ["S.F. Travis & Company", "S.F. Travis & Company"]
]);

const tourBlock = content.match(/slug: "cocoa-village-historic-explorer"[\s\S]*?stops: \[([\s\S]*?)\n    \]\n  \}/)?.[1] ?? "";
const stopLines = tourBlock.split("\n").filter((line) => line.includes("sequence:"));

const repoStops = stopLines.map((line) => {
  const sequence = Number(line.match(/sequence: (\d+)/)?.[1]);
  const slug = line.match(/slug: "([^"]+)"/)?.[1] ?? "";
  const name = line.match(/title: "([^"]+)"/)?.[1] ?? "";
  const locationMatch = line.match(/location: \{ latitude: ([\d.-]+), longitude: ([\d.-]+) \}/);
  const triggerMatch = line.match(/triggerRadiusMeters: (\d+)/);
  const exitMatch = line.match(/exitRadiusMeters: (\d+)/);
  const verificationStatus = line.match(/coordinateVerificationStatus: "([^"]+)"/)?.[1] ?? "unknown";

  return {
    sequence,
    slug,
    name,
    latitude: locationMatch ? Number(locationMatch[1]) : undefined,
    longitude: locationMatch ? Number(locationMatch[2]) : undefined,
    triggerRadiusMeters: triggerMatch ? Number(triggerMatch[1]) : undefined,
    exitRadiusMeters: exitMatch ? Number(exitMatch[1]) : undefined,
    verificationStatus
  };
});

function radians(degrees) {
  return (degrees * Math.PI) / 180;
}

function distanceMeters(from, to) {
  const earthRadiusMeters = 6_371_000;
  const deltaLat = radians(to.latitude - from.latitude);
  const deltaLon = radians(to.longitude - from.longitude);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(radians(from.latitude)) *
      Math.cos(radians(to.latitude)) *
      Math.sin(deltaLon / 2) ** 2;

  return 2 * earthRadiusMeters * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function findRepoStop(referenceStop) {
  const expectedTitle = titleAliases.get(referenceStop.name) ?? referenceStop.name;
  return repoStops.find((stop) => stop.name === expectedTitle);
}

console.log("# Cocoa Village Coordinate Audit");
console.log("");
console.log("Reference label: map-verified / provisional, not field-verified.");
console.log(`Repo tour stops: ${repoStops.length}`);
console.log(`Reference stops: ${referenceStops.length}`);
console.log("");
console.log("| Ref # | Reference stop | Repo match | Repo # | Reference coords | Repo coords | Delta | Status |");
console.log("| --- | --- | --- | --- | --- | --- | --- | --- |");

for (const referenceStop of referenceStops) {
  const repoStop = findRepoStop(referenceStop);
  const hasReferenceCoords = referenceStop.latitude !== undefined && referenceStop.longitude !== undefined;
  const hasRepoCoords = repoStop?.latitude !== undefined && repoStop.longitude !== undefined;
  const referenceCoords = hasReferenceCoords ? `${referenceStop.latitude}, ${referenceStop.longitude}` : "MISSING_COORDINATES";
  const repoCoords = hasRepoCoords ? `${repoStop.latitude}, ${repoStop.longitude}` : repoStop ? "MISSING_COORDINATES" : "MISSING_REPO_STOP";
  const delta = repoStop && hasReferenceCoords && hasRepoCoords
    ? `${Math.round(distanceMeters(referenceStop, repoStop))}m`
    : "n/a";
  const status = !repoStop
    ? "MISSING_REPO_STOP"
    : !hasReferenceCoords || !hasRepoCoords
      ? "NEEDS_FIELD_VERIFICATION"
      : distanceMeters(referenceStop, repoStop) > 75
        ? "SUSPICIOUS_DISTANCE"
        : "WITHIN_EXPECTED_RANGE";

  console.log(
    `| ${referenceStop.sequence} | ${referenceStop.name} | ${repoStop?.name ?? "none"} | ${repoStop?.sequence ?? "n/a"} | ${referenceCoords} | ${repoCoords} | ${delta} | ${status} |`
  );
}

const repoStopsWithCoordinates = repoStops.filter((stop) => stop.latitude !== undefined && stop.longitude !== undefined);
const duplicates = repoStopsWithCoordinates.flatMap((stop, index) =>
  repoStopsWithCoordinates.slice(index + 1).flatMap((otherStop) => {
    const distance = distanceMeters(stop, otherStop);
    return distance < 10 ? [`${stop.name} and ${otherStop.name}: ${Math.round(distance)}m`] : [];
  })
);

console.log("");
console.log("Duplicate point check:");
console.log(duplicates.length ? duplicates.map((item) => `- ${item}`).join("\n") : "- No repo stop coordinates are within 10m of each other.");
