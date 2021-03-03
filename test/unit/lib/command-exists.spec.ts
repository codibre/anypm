import { commandExists } from '../../../src/lib/command-exists';

describe(commandExists.name, () => {
	it('should return true when command exists', async () => {
		const result = await commandExists('npm');

		expect(result).toBeTruthy();
	});

	it('should return false when command does not exists', async () => {
		const result = await commandExists('never gonna give you up');

		expect(result).toBeFalsy();
	});
});
