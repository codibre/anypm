import * as getCommandLib from '../../../src/lib/get-command';
import * as mountNpmCommandLib from '../../../src/lib/mount-npm-command';
import * as prepareOptionsLib from '../../../src/lib/prepare-options';
import * as lockLib from '../../../src/lib/has-no-package-lock';
import * as manageLocksLib from '../../../src/lib/manage-locks';
import { Command } from '../../../src/lib/config';
import { auditFix } from '../../../src/lib/audit-fix';

describe(fName(auditFix), () => {
	let hasNoPackageLock: jest.SpyInstance;
	let command: Command;

	beforeEach(() => {
		jest.spyOn(getCommandLib, 'getCommand').mockImplementation(async () => ({
			hasCommand: command !== 'npm',
			command,
		}));
		jest
			.spyOn(mountNpmCommandLib, 'mountNpmCommand')
			.mockImplementation((...[a, ...others]: any[]) => [a, others]);
		jest.spyOn(prepareOptionsLib, 'prepareOptions');
		hasNoPackageLock = jest
			.spyOn(lockLib, 'hasNoPackageLock')
			.mockReturnValue(false);
		jest.spyOn(manageLocksLib, 'manageLocks').mockReturnValue([
			['finish', ['command1f']],
			['finish', ['command2f']],
		]);
	});

	it('should thrown an error when there is not package-lock', async () => {
		hasNoPackageLock.mockReturnValue(true);
		let thrownError: any;

		try {
			const result: any[] = [];
			for await (const item of auditFix({})) {
				result.push(item);
			}
		} catch (err) {
			thrownError = err;
		}

		expect(getCommandLib.getCommand).toHaveCallsLike();
		expect(prepareOptionsLib.prepareOptions).toHaveCallsLike();
		expect(mountNpmCommandLib.mountNpmCommand).toHaveCallsLike();
		expect(manageLocksLib.manageLocks).toHaveCallsLike();
		expect(thrownError).toBeInstanceOf(Error);
	});

	it('should run "npm auditFix" when command is npm', async () => {
		command = 'npm';
		const result: any[] = [];

		for await (const item of auditFix({})) {
			result.push(item);
		}

		expect(getCommandLib.getCommand).toHaveCallsLike([]);
		expect(prepareOptionsLib.prepareOptions).toHaveCallsLike([
			{
				fix: true,
			},
		]);
		expect(mountNpmCommandLib.mountNpmCommand).toHaveCallsLike([
			'npm',
			'audit',
			['fix'],
		]);
		expect(manageLocksLib.manageLocks).toHaveCallsLike([
			false,
			{ fix: true, keepLock: false },
		]);
		expect(result).toEqual([
			['npm', ['audit', ['fix']]],
			['finish', ['command1f']],
			['finish', ['command2f']],
		]);
	});
});
