/**
 * Utility functions for Breezy navigation app
 */

// Math utilities
export const toRad = d => d * Math.PI / 180;
export const toDeg = r => r * 180 / Math.PI;

/**
 * Calculate the smallest angle difference between two angles
 * @param {number} a - First angle in degrees
 * @param {number} b - Second angle in degrees
 * @returns {number} Smallest difference in degrees (-180 to 180)
 */
export function smallestAngleDiff(a, b) {
  let d = (a - b + 540) % 360 - 180;
  return d;
}

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in meters
 */
export function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const dφ = toRad(lat2 - lat1);
  const dλ = toRad(lon2 - lon1);
  const a = Math.sin(dφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(dλ / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/**
 * Calculate bearing from one point to another
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Bearing in degrees (0-360)
 */
export function bearing(lat1, lon1, lat2, lon2) {
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lon2 - lon1);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

/**
 * Calculate Velocity Made Good (VMG) towards target
 * @param {number} sog - Speed over ground in m/s
 * @param {number} currentHeading - Current heading/COG in degrees
 * @param {number} targetBearing - Bearing to target in degrees
 * @returns {number} VMG in knots
 */
export function calculateVMG(sog, currentHeading, targetBearing) {
  if (!Number.isFinite(sog) || !Number.isFinite(currentHeading) || !Number.isFinite(targetBearing)) {
    return NaN;
  }
  const delta = smallestAngleDiff(currentHeading, targetBearing);
  const vmgMs = sog * Math.cos(toRad(delta));
  return vmgMs * 1.94384; // Convert m/s to knots
}

/**
 * Calculate median of an array of numbers
 * @param {number[]} arr - Array of numbers
 * @returns {number} Median value
 */
export function median(arr) {
  if (!arr || arr.length === 0) return NaN;
  const sorted = [...arr].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

/**
 * Format number for display
 * @param {number} n - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted string
 */
export function fmt(n, decimals = 0) {
  return Number.isFinite(n) ? n.toFixed(decimals) : '—';
}

/**
 * Exponential moving average
 * @param {number} prev - Previous value
 * @param {number} curr - Current value
 * @param {number} alpha - Smoothing factor (0-1)
 * @returns {number} Smoothed value
 */
export function ema(prev, curr, alpha) {
  if (!Number.isFinite(prev)) return curr;
  return prev + alpha * (curr - prev);
}
