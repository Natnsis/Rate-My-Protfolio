import { describe, it, expect, vi, afterAll, beforeAll } from 'vitest';
import { timeAgo, compactCount, ratingLabel } from './format';

describe('timeAgo', () => {
	beforeAll(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-09-17T12:00:00Z'));
	});
	afterAll(() => vi.useRealTimers());

	const at = (m: number) => new Date('2026-09-17T12:00:00Z').getTime() - m * 60000;

	it('says just now under a minute', () => {
		expect(timeAgo(new Date(at(0)).toISOString())).toBe('just now');
	});

	it('formats minutes', () => {
		expect(timeAgo(new Date(at(5)).toISOString())).toBe('5m');
	});

	it('formats hours', () => {
		expect(timeAgo(new Date(at(60 * 2)).toISOString())).toBe('2h');
	});

	it('formats days', () => {
		expect(timeAgo(new Date(at(60 * 24 * 3)).toISOString())).toBe('3d');
	});

	it('formats weeks', () => {
		expect(timeAgo(new Date(at(60 * 24 * 7 * 2)).toISOString())).toBe('2w');
	});

	it('formats months past five weeks', () => {
		expect(timeAgo(new Date(at(60 * 24 * 60)).toISOString())).toBe('2mo');
	});
});

describe('compactCount', () => {
	it('keeps small numbers as-is', () => {
		expect(compactCount(0)).toBe('0');
		expect(compactCount(999)).toBe('999');
	});

	it('rounds thousands', () => {
		expect(compactCount(1200)).toBe('1.2k');
		expect(compactCount(1000)).toBe('1k');
		expect(compactCount(999_900)).toBe('999.9k');
	});

	it('formats millions', () => {
		expect(compactCount(1_200_000)).toBe('1.2M');
	});
});

describe('ratingLabel', () => {
	it('rounds to one decimal', () => {
		expect(ratingLabel(4.25)).toBe('4.3');
		expect(ratingLabel(4)).toBe('4.0');
	});

	it('shows a dash when unrated', () => {
		expect(ratingLabel(0)).toBe('—');
	});
});
