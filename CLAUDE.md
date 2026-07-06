# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Breezy is a minimalist, offline-first PWA for sailing/regatta navigation: live map, GPS tracking, compass heading, bearing/VMG to a waypoint, and GPX/GeoJSON track export. UI copy is in Norwegian.

## No build tools

There is no `package.json`, bundler, or test runner. The entire app is three static files served as-is:

- `index.html` — everything: CSS, and the app's JS logic in an inline `<script type="module">` at the bottom of the file
- `service-worker.js` — offline caching (app-shell cache-first, map tiles stale-while-revalidate)
- `manifest.webmanifest` — PWA manifest (install shortcuts for `#start` / `#track` hash routes)

To run it locally, serve the directory with any static file server (e.g. `python3 -m http.server`) and open in a browser — opening `index.html` directly via `file://` will break the service worker and manifest. There is no lint or test command; verify changes by loading the page in a browser.

## Testing sensors without hardware

`TESTING.md` has snippets for faking `deviceorientation` events (via `window.dispatchEvent`) to simulate compass jitter at different noise levels, for testing the heading-smoothing logic in the browser console.

## Architecture (all inside `index.html`'s inline script)

- **State** is a flat set of module-level `let` variables (`lastFix`, `sog`, `cog`, `headingMag`, `headingTrue`, `target`, `trackPts`, etc.) — no framework, no reactivity system. `render()` is called manually after any state-changing event to update the DOM.
- **Sensor pipeline**: `navigator.geolocation.watchPosition` → `updateFromPosition()` computes SOG/COG from consecutive fixes via haversine distance/bearing (not from `coords.speed`/`coords.heading`, which are unreliable on many devices). `deviceorientation`/`deviceorientationabsolute` → `onOrientation()` computes magnetic heading, corrected to true heading using declination from the WMM model.
- **Smoothing**: both SOG and heading go through sliding-window median filters (`SOG_WINDOW`, `HEADING_WINDOW`) plus minimum-change thresholds (`MIN_SOG_CHANGE`, `MIN_HEADING_CHANGE`) and update throttling (`UPDATE_INTERVAL` = 1s) to fight GPS/compass jitter. This filtering logic is the most fiddly part of the codebase — see `TESTING.md` before changing it.
- **Declination**: `getDeclination()` lazy-loads `geomagnetism` from a CDN via dynamic `import()`; if that fails, it silently falls back to `0` declination (true heading == magnetic heading in that case).
- **Map**: Leaflet, loaded from CDN (`unpkg.com`). Tile source is Kartverket's `topograatone` WMTS layer (Norwegian topo tiles), not OpenStreetMap, despite `service-worker.js`'s tile-caching logic still matching on `tile.openstreetmap.org` hostnames — that cache path is currently dead code and won't be hit for the Kartverket tiles in use.
- **Waypoint/VMG**: clicking the map or submitting the lat/lon inputs calls `setWaypoint()`. `vmgKnots()` projects SOG onto the bearing-to-target line, preferring COG over compass heading as the reference direction when available.
- **Export**: `exportGPX()`/`exportGeoJSON()` serialize `trackPts` and trigger a browser download via an object URL — no server round-trip.
- **PWA install**: standard `beforeinstallprompt` capture/deferred-prompt pattern wired to `#btnInstall`.
- **Hash-based shortcuts**: `applyShortcutFromHash()` reads `location.hash` (`#start`, `#track`) so the manifest's `shortcuts` entries and Android's "Add to Home Screen" launcher can jump straight into sensor-start or tracking mode.

## Working in this codebase

Since everything lives in one `<script type="module">` block in `index.html`, prefer targeted edits over restructuring into modules/files unless asked — there's no bundler to resolve imports across files at runtime (CDN dynamic `import()` is the only module loading in use).
