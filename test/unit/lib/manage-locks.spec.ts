import { manageLocks } from '../../../src/lib/manage-locks';

describe(manageLocks.name, () => {
	it('should yield nothing when hasPNPM is false', () => {
		const result = Array.from(manageLocks(false, undefined as any));

		expect(result).toEqual([]);
	});

	it('should yield just the package-lock updating when hasPNPM is true but keepLock is also true', () => {
		const result = Array.from(
			manageLocks(true, {
				keepLock: true,
			}),
		);

		expect(result).toEqual([
			['npm', ['install', '--package-lock-only', '--ignore-scripts']],
		]);
	});

	it('should yield lock deleting and package-lock updating when hasPNPM is true but keepLock is false', () => {
		const result = Array.from(
			manageLocks(true, {
				keepLock: false,
			}),
		);

		expect(result).toEqual([
			['rm', ['-rf', 'pnpm-lock.yaml']],
			['npm', ['install', '--package-lock-only', '--ignore-scripts']],
		]);
	});
});
