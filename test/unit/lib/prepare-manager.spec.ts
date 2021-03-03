import { prepareManager } from '../../../src/lib/prepare-manager';

describe(prepareManager.name, () => {
	it('should yield nothing when hasPNPM is false', () => {
		const result = Array.from(prepareManager(false));

		expect(result).toEqual([]);
	});

	it('should yield preparing commands when hasPNPM is true', () => {
		const result = Array.from(prepareManager(true));

		expect(result).toEqual([['pnpm', ['import']]]);
	});
});
