import { getCommand, PNPM } from '../../../src/lib/get-command';
import * as lib from '../../../src/lib/command-exists';
import { expectCallsLike } from '../setup';

describe(getCommand.name, () => {
	let commandExists: jest.SpyInstance;

	beforeEach(() => {
		commandExists = jest.spyOn(lib, 'commandExists').mockResolvedValue(true);
	});

	it('should return command pnpm and hasPNPM as true when they exists', async () => {
		const result = await getCommand();

		expectCallsLike(commandExists, [PNPM]);
		expect(result).toEqual({
			hasPNPM: true,
			command: 'pnpm',
		});
	});

	it('should return npm and hasPNPM as false when pnpm does not exist', async () => {
		commandExists.mockResolvedValue(false);

		const result = await getCommand();

		expectCallsLike(commandExists, [PNPM]);
		expect(result).toEqual({
			hasPNPM: false,
			command: 'npm',
		});
	});
});
