# Breezy Testing Guide

This document describes the automated testing infrastructure for the Breezy PWA application.

## Overview

Breezy uses a comprehensive testing strategy that includes:

- **Unit Tests**: Testing individual functions and utilities using Vitest
- **End-to-End Tests**: Testing complete user flows using Playwright

## Prerequisites

Install dependencies before running tests:

```bash
npm install
```

## Running Tests

### All Tests

Run both unit and E2E tests:

```bash
npm run test:all
```

### Unit Tests

Unit tests verify the correctness of navigation calculations, data processing, and utility functions.

```bash
# Run unit tests in watch mode (for development)
npm test

# Run unit tests once
npm run test:unit

# Run with coverage report
npm run test:coverage
```

### End-to-End Tests

E2E tests verify the complete application behavior in a real browser environment.

```bash
npm run test:e2e
```

**Note**: E2E tests will automatically start a local HTTP server on port 8080 to serve the application.

## Test Structure

### Unit Tests (`tests/unit/`)

Unit tests focus on pure functions extracted to `src/utils.js`:

- **Navigation Calculations**:
  - `haversine()` - Distance calculation between coordinates
  - `bearing()` - Bearing calculation from one point to another
  - `calculateVMG()` - Velocity Made Good calculation
  
- **Angle Utilities**:
  - `smallestAngleDiff()` - Shortest angle between two headings
  - `toRad()` / `toDeg()` - Angle conversions
  
- **Data Processing**:
  - `median()` - Median filtering for sensor smoothing
  - `ema()` - Exponential moving average
  - `fmt()` - Number formatting for display

### End-to-End Tests (`tests/e2e/`)

E2E tests verify complete application behavior:

- **Page Load & Rendering**:
  - Application loads correctly
  - All UI elements are visible
  - Map initializes properly
  
- **User Interactions**:
  - Button clicks work as expected
  - Form inputs accept data
  - Waypoint setting functionality
  - Tracking toggle behavior
  
- **Responsive Design**:
  - Mobile viewport (375x667)
  - Tablet viewport (768x1024)
  - Desktop viewport (1920x1080)

## Testing Philosophy

### What We Test

1. **Pure Functions**: All navigation calculations and data processing
2. **UI Behavior**: User interactions and visual feedback
3. **Responsive Layout**: Multiple viewport sizes
4. **Error Handling**: Invalid inputs and edge cases

### What We Don't Test

1. **Actual GPS/Sensor Data**: Real device sensors are mocked in tests
2. **Map Tiles**: External OpenStreetMap tiles (assumes Leaflet works)
3. **Browser-Specific Bugs**: Tests run in Chromium only by default

## Mocking Sensors

The PWA relies on browser APIs that aren't available in test environments:

- `navigator.geolocation.watchPosition()` - GPS location
- `DeviceOrientationEvent` - Compass heading
- `navigator.wakeLock` - Screen wake lock

**Approach**: Tests focus on the pure calculation functions that process sensor data, rather than testing the sensor APIs themselves. E2E tests verify UI behavior with mocked sensor scenarios.

## Continuous Integration

Tests are designed to run in CI/CD environments without requiring:

- Physical device
- GPS signals
- Device orientation sensors
- Deployment to external servers

The test suite can run entirely locally or in automated pipelines.

## Coverage Goals

- **Unit Tests**: >90% coverage for `src/utils.js`
- **E2E Tests**: Cover all major user flows
  - Initial page load
  - Waypoint setting
  - Track recording
  - Data export
  - UI state changes

## Debugging Tests

### Unit Tests

```bash
# Run specific test file
npx vitest tests/unit/utils.test.js

# Run with UI
npx vitest --ui
```

### E2E Tests

```bash
# Run in headed mode (see browser)
npx playwright test --headed

# Run specific test
npx playwright test tests/e2e/basic.spec.js

# Debug mode
npx playwright test --debug

# Generate report
npx playwright show-report
```

## Test Development

### Adding Unit Tests

1. Add new functions to `src/utils.js`
2. Export them for testing
3. Create tests in `tests/unit/utils.test.js`
4. Run tests to verify

### Adding E2E Tests

1. Create new spec file in `tests/e2e/`
2. Use Playwright's test syntax
3. Focus on user-visible behavior
4. Run tests with `npm run test:e2e`

## Known Limitations

1. **Geolocation**: Cannot test actual GPS movement in automated tests
2. **Compass**: Device orientation events are browser-dependent
3. **PWA Installation**: Cannot test "Add to Home Screen" automatically
4. **Offline Mode**: Service worker behavior is complex to test comprehensively

## Best Practices

1. **Keep tests fast**: Unit tests should run in milliseconds
2. **Test behavior, not implementation**: Focus on what users experience
3. **Use descriptive names**: Test names should explain what they verify
4. **Avoid flaky tests**: Make tests deterministic and reliable
5. **Mock external dependencies**: Don't rely on network requests or APIs

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles/)
