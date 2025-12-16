import { describe, it, expect } from 'vitest';
import {
  toRad,
  toDeg,
  smallestAngleDiff,
  haversine,
  bearing,
  calculateVMG,
  median,
  fmt,
  ema
} from '../../src/utils.js';

describe('Math Utilities', () => {
  describe('toRad', () => {
    it('should convert degrees to radians', () => {
      expect(toRad(0)).toBe(0);
      expect(toRad(180)).toBeCloseTo(Math.PI, 10);
      expect(toRad(90)).toBeCloseTo(Math.PI / 2, 10);
      expect(toRad(360)).toBeCloseTo(2 * Math.PI, 10);
    });
  });

  describe('toDeg', () => {
    it('should convert radians to degrees', () => {
      expect(toDeg(0)).toBe(0);
      expect(toDeg(Math.PI)).toBeCloseTo(180, 10);
      expect(toDeg(Math.PI / 2)).toBeCloseTo(90, 10);
      expect(toDeg(2 * Math.PI)).toBeCloseTo(360, 10);
    });
  });

  describe('smallestAngleDiff', () => {
    it('should calculate smallest angle difference', () => {
      expect(smallestAngleDiff(10, 5)).toBe(5);
      expect(smallestAngleDiff(5, 10)).toBe(-5);
      expect(smallestAngleDiff(350, 10)).toBe(-20);
      expect(smallestAngleDiff(10, 350)).toBe(20);
      expect(Math.abs(smallestAngleDiff(180, 0))).toBe(180);
      expect(Math.abs(smallestAngleDiff(0, 180))).toBe(180);
    });

    it('should handle wraparound correctly', () => {
      expect(smallestAngleDiff(359, 1)).toBe(-2);
      expect(smallestAngleDiff(1, 359)).toBe(2);
    });
  });
});

describe('Navigation Functions', () => {
  describe('haversine', () => {
    it('should calculate distance between two points', () => {
      // Distance from Kristiansand to Oslo (approx 252km actual distance)
      const d1 = haversine(58.1467, 7.9956, 59.9139, 10.7522);
      expect(d1).toBeGreaterThan(240000);
      expect(d1).toBeLessThan(270000);
    });

    it('should return 0 for same point', () => {
      const d = haversine(58.1467, 7.9956, 58.1467, 7.9956);
      expect(d).toBeCloseTo(0, 1);
    });

    it('should calculate short distances accurately', () => {
      // 1 nautical mile ≈ 1852 meters
      // At equator, 1 minute of latitude ≈ 1 nautical mile
      const d = haversine(0, 0, 0.0166667, 0); // ~1 nm
      expect(d).toBeCloseTo(1852, -1); // Within 10 meters
    });
  });

  describe('bearing', () => {
    it('should calculate bearing to north', () => {
      const b = bearing(0, 0, 1, 0);
      expect(b).toBeCloseTo(0, 0);
    });

    it('should calculate bearing to east', () => {
      const b = bearing(0, 0, 0, 1);
      expect(b).toBeCloseTo(90, 0);
    });

    it('should calculate bearing to south', () => {
      const b = bearing(1, 0, 0, 0);
      expect(b).toBeCloseTo(180, 0);
    });

    it('should calculate bearing to west', () => {
      const b = bearing(0, 1, 0, 0);
      expect(b).toBeCloseTo(270, 0);
    });

    it('should return value between 0 and 360', () => {
      const b1 = bearing(58.1467, 7.9956, 59.9139, 10.7522);
      expect(b1).toBeGreaterThanOrEqual(0);
      expect(b1).toBeLessThan(360);
    });
  });

  describe('calculateVMG', () => {
    it('should calculate VMG when heading directly to target', () => {
      // Going 5 m/s directly towards target (0° difference)
      const vmg = calculateVMG(5, 90, 90);
      expect(vmg).toBeCloseTo(5 * 1.94384, 2); // ~9.72 knots
    });

    it('should return 0 when perpendicular to target', () => {
      // 90° angle means no VMG
      const vmg = calculateVMG(5, 0, 90);
      expect(vmg).toBeCloseTo(0, 1);
    });

    it('should return negative VMG when heading away', () => {
      // 180° angle means negative VMG
      const vmg = calculateVMG(5, 0, 180);
      expect(vmg).toBeCloseTo(-5 * 1.94384, 2);
    });

    it('should handle non-finite inputs', () => {
      expect(calculateVMG(NaN, 90, 90)).toBeNaN();
      expect(calculateVMG(5, NaN, 90)).toBeNaN();
      expect(calculateVMG(5, 90, NaN)).toBeNaN();
    });

    it('should calculate VMG at 45 degree angle', () => {
      const vmg = calculateVMG(5, 0, 45);
      // cos(45°) ≈ 0.707
      expect(vmg).toBeCloseTo(5 * 0.707 * 1.94384, 1);
    });
  });
});

describe('Data Processing Functions', () => {
  describe('median', () => {
    it('should calculate median of odd-length array', () => {
      expect(median([1, 2, 3, 4, 5])).toBe(3);
      expect(median([5, 1, 3, 2, 4])).toBe(3);
    });

    it('should calculate median of even-length array', () => {
      expect(median([1, 2, 3, 4])).toBe(3); // Middle-right value
      expect(median([4, 1, 2, 3])).toBe(3);
    });

    it('should handle single element', () => {
      expect(median([42])).toBe(42);
    });

    it('should handle empty array', () => {
      expect(median([])).toBeNaN();
    });

    it('should handle null/undefined', () => {
      expect(median(null)).toBeNaN();
      expect(median(undefined)).toBeNaN();
    });
  });

  describe('fmt', () => {
    it('should format finite numbers', () => {
      expect(fmt(1.23456, 0)).toBe('1');
      expect(fmt(1.23456, 2)).toBe('1.23');
      expect(fmt(1.23456, 4)).toBe('1.2346');
    });

    it('should return placeholder for non-finite numbers', () => {
      expect(fmt(NaN)).toBe('—');
      expect(fmt(Infinity)).toBe('—');
      expect(fmt(-Infinity)).toBe('—');
    });

    it('should default to 0 decimals', () => {
      expect(fmt(3.14159)).toBe('3');
    });
  });

  describe('ema', () => {
    it('should return current value when previous is not finite', () => {
      expect(ema(NaN, 10, 0.5)).toBe(10);
      expect(ema(undefined, 10, 0.5)).toBe(10);
    });

    it('should calculate exponential moving average', () => {
      const result = ema(10, 20, 0.5);
      expect(result).toBe(15); // 10 + 0.5 * (20 - 10)
    });

    it('should smooth with low alpha', () => {
      const result = ema(10, 20, 0.1);
      expect(result).toBe(11); // 10 + 0.1 * (20 - 10)
    });

    it('should respond quickly with high alpha', () => {
      const result = ema(10, 20, 0.9);
      expect(result).toBe(19); // 10 + 0.9 * (20 - 10)
    });
  });
});
