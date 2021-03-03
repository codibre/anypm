import { getTypes } from '../../../src/lib/get-types';
import * as lib from '../../../src/lib/package-exists';
import { expectCallsLike } from '../setup';
describe(getTypes.name, () => {
	beforeEach(() => {
		jest
			.spyOn(lib, 'packageExists')
			.mockImplementation(async (x) => x !== '@types/pack2');
	});

	it('should return true when command exists', async () => {
		const result = await getTypes([
			'pack1',
			'@types/pack1',
			'@company/pack1',
			'pack2',
			'pack3',
		]);

		expectCallsLike(
			lib.packageExists,
			['@types/company__pack1'],
			['@types/pack2'],
			['@types/pack3'],
		);
		expect(result).toEqual(['@types/company__pack1', '@types/pack3']);
	});
});
