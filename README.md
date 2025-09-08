
# Breezy

Breezy is a minimalist, offline-first Progressive Web App (PWA) for real-time navigation, tracking, and waypoint management—designed for sailing, regattas, and outdoor activities. It runs directly in your browser (optimized for Android tablets/phones) and works offline after first load.

## Features

- **Live Map & Tracking:**
	- Interactive map (OpenStreetMap via Leaflet)
	- Real-time position, heading, and speed display
	- Track your route and export as GPX/GeoJSON
- **Waypoint Navigation:**
	- Set a target by clicking the map or entering coordinates
	- See bearing and VMG (Velocity Made Good) to the target
- **Sensor Integration:**
	- Uses device GPS and compass (if available)
	- Wake lock to keep the screen on during use
- **Offline Support:**
	- Fully functional as a PWA (installable, works offline)
- **Privacy-Friendly:**
	- No accounts, no tracking, all data stays on your device

## Usage

1. **Open in Browser:**
	 - Open `index.html` in a modern browser (best on Android/Chrome).
2. **Start Sensors:**
	 - Tap "Start sensorer" to enable GPS and compass.
3. **Set Waypoint:**
	 - Click on the map or enter latitude/longitude, then tap "Sett mål".
4. **Track & Export:**
	 - Tap "Start sporing" to record your track. Export via "Eksporter" (GPX/GeoJSON).

## Controls

- **Start sensorer:** Enable location and compass sensors
- **Start/Stop sporing:** Begin/end track recording
- **Eksporter:** Download your track as GPX and GeoJSON
- **Sett mål:** Set a navigation target (waypoint)

## Technical Details

- **Frontend:** Pure HTML, CSS, and JavaScript (no build tools required)
- **Map:** [Leaflet.js](https://leafletjs.com/) with OpenStreetMap tiles
- **PWA:** Inline manifest and service worker for offline use
- **Sensors:** Uses browser APIs for geolocation and device orientation

## Installation

- Open in your browser and "Add to Home Screen" for a native-like experience.
- No server or backend required—just static files.

## License

MIT License. See [LICENSE](LICENSE).

---

**Note:**
- Some features (like compass) may require permissions and may not work on all devices/browsers.
- For best results, use on Android with Chrome or a Chromium-based browser.
