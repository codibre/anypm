import * as lib from '../../../src/lib/config';
import { prepareOptions } from '../../../src/lib/prepare-options';

describe(prepareOptions.name, () => {
	let getConfig: jest.SpyInstance;

	beforeEach(() => {
		getConfig = jest.spyOn(lib, 'getConfig');
	});

	it('should return an BaseOption with keepLock false when it is not boolean in the original value and in the config', () => {
		getConfig.mockReturnValue({
			keepLock: null,
		});

		const result = prepareOptions({
			keepLock: undefined as any,
			something: 'else',
		});

		expectCallsLike(lib.getConfig, []);
		expect(result).toEqual({
			keepLock: false,
			something: 'else',
		});
	});

	it('should return an BaseOption with keepLock true when it is not boolean in the original value and true in the config', () => {
		getConfig.mockReturnValue({
			keepLock: true,
		});

		const result = prepareOptions({
			keepLock: undefined as any,
			something: 'else',
		});

		expectCallsLike(lib.getConfig, []);
		expect(result).toEqual({
			keepLock: true,
			something: 'else',
		});
	});

	it('should keep the same value of the when it is boolean', () => {
		getConfig.mockReturnValue({
			keepLock: false,
			something: 'else',
		});

		const result = prepareOptions({ keepLock: true, something: 'else' });

		expectCallsLike(lib.getConfig);
		expect(result).toEqual({
			keepLock: true,
			something: 'else',
		});
	});
});
