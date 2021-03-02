"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expectCallsLike = exports.getNames = void 0;
afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
});
function getNames(c) {
    return new Proxy(c.prototype, {
        get(target, property) {
            const result = target[property];
            if (!result) {
                throw new Error(`Method ${property} doesn't exist`);
            }
            return result;
        },
    });
}
exports.getNames = getNames;
function expectCallsLike(spy, ...parameters) {
    expect(spy).toBeCalledTimes(parameters.length);
    parameters.forEach((params, i) => {
        expect(spy).toHaveBeenNthCalledWith(i + 1, ...params);
    });
}
exports.expectCallsLike = expectCallsLike;
//# sourceMappingURL=setup.js.map