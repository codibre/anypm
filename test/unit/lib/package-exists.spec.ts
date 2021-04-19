const prop = jest.fn();
const repo = jest.fn().mockReturnValue({ prop });
const NpmApi = jest.fn().mockReturnValue({ repo });
jest.mock('npm-api', () => NpmApi);
import { packageExists } from '../../../src/lib/package-exists';

describe(packageExists.name, () => {
	it('should return false when deprecated is filled', async () => {
		prop.mockResolvedValue('it is');

		const result = await packageExists('some-pack');

		expectCallsLike(repo, ['some-pack']);
		expectCallsLike(prop, ['deprecated']);
		expect(result).toEqual(false);
	});

	it('should return false when package does not exist', async () => {
		prop.mockRejectedValue('err');

		const result = await packageExists('some-pack');

		expectCallsLike(repo, ['some-pack']);
		expectCallsLike(prop, ['deprecated']);
		expect(result).toEqual(false);
	});
	it('should return true when deprecated falsy', async () => {
		prop.mockResolvedValue(undefined);

		const result = await packageExists('some-pack');

		expectCallsLike(repo, ['some-pack']);
		expectCallsLike(prop, ['deprecated']);
		expect(result).toEqual(true);
	});
});
