import { getCommand } from '../../../src/lib/get-command';
import * as configLib from '../../../src/lib/config';
import * as lib from '../../../src/lib/command-exists';

describe(getCommand.name, () => {
	let commandExists: jest.SpyInstance;

	beforeEach(() => {
		jest
			.spyOn(configLib, 'getConfig')
			.mockReturnValue({ command: 'default command' } as any);
		commandExists = jest.spyOn(lib, 'commandExists').mockResolvedValue(true);
	});

	it('should return command pnpm and hasPNPM as true when they exists', async () => {
		const result = await getCommand();

		expectCallsLike(configLib.getConfig, []);
		expectCallsLike(commandExists, ['default command']);
		expect(result).toEqual({
			hasCommand: true,
			command: 'default command',
		});
	});

	it('should return npm and hasPNPM as false when pnpm does not exist', async () => {
		commandExists.mockResolvedValue(false);

		const result = await getCommand();

		expectCallsLike(configLib.getConfig, []);
		expectCallsLike(commandExists, ['default command']);
		expect(result).toEqual({
			hasCommand: false,
			command: 'npm',
		});
	});
});
