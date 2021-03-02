export declare function getNames<T extends object>(c: { prototype: T }): T;
export declare function expectCallsLike(
	spy: any,
	...parameters: unknown[][]
): void;
