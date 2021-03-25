import { getTypes } from '../../../src/lib/get-types';
import * as lib from '../../../src/lib/package-exists';
import { expectCallsLike } from '../setup';
describe(getTypes.name, () => {
	beforeEach(() => {
		jest
			.spyOn(lib, 'packageExists')
			.mockImplementation(async (x) => x !== '@types/pack2');
	});

	it('should return types packages to install', async () => {
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

	it('should return only types pacakges present on the informed reference object', async () => {
		const result = await getTypes(
			['pack1', '@types/pack1', '@company/pack1', 'pack2', 'pack3'],
			new Set(['@types/company__pack1', '@types/pack2']),
		);

		expectCallsLike(
			lib.packageExists,
			['@types/company__pack1'],
			['@types/pack2'],
		);
		expect(result).toEqual(['@types/company__pack1']);
	});
});
