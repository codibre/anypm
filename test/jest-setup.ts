import 'jest-extended';
import 'jest-callslike';

afterEach(() => {
	jest.restoreAllMocks();
	jest.clearAllMocks();
});

declare global {
	function getNames<T extends object>(c: { prototype: T }): T;
	function expectCallsLike(spy: any, ...params: unknown[][]): void;
}

global.getNames = function getNames<T extends object>(c: { prototype: T }): T {
	return new Proxy(c.prototype, {
		get(target: T, property: string) {
			const result = target[property as keyof T];
			if (!result) {
				throw new Error(`Method ${property} doesn't exist`);
			}

			return result;
		},
	});
};

global.expectCallsLike = function expectCallsLike(
	spy: any,
	...params: unknown[][]
): void {
	expect(spy).toHaveCallsLike(...params);
};
