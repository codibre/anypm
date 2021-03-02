describe('index.ts', () => {
	afterEach(() => {
		delete require.cache[require.resolve('../../src/index')];
	});

	it('should start things', () => {
		require('../../src/index');
	});
});
