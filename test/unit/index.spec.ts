import './setup';

describe('index.ts', () => {
	afterEach(() => {
		delete require.cache[require.resolve('../../src/index')];
	});

	beforeEach(() => {
		jest.spyOn(process, 'exit').mockReturnValue(undefined as never);
	});

	it('should start things', () => {
		require('../../src/index');

		expect(process.exit).toBeCalled();
	});
});
