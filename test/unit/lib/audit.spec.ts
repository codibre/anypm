import * as mountNpmCommandLib from '../../../src/lib/mount-npm-command';
import * as lockLib from '../../../src/lib/has-no-package-lock';
import * as getCommandLib from '../../../src/lib/get-command';
import { ci } from '../../../src/lib/ci';
import { audit } from '../../../src/lib/audit';

describe(fName(audit), () => {
	let hasNoPackageLock: jest.SpyInstance;

	beforeEach(() => {
		jest
			.spyOn(mountNpmCommandLib, 'mountNpmCommand')
			.mockImplementation((...[a, ...others]: any[]) => [a, others]);
		jest.spyOn(getCommandLib, 'getCommand').mockResolvedValue({
			hasCommand: 'has command value' as any,
			command: 'myNpmCommand',
		});
		hasNoPackageLock = jest
			.spyOn(lockLib, 'hasNoPackageLock')
			.mockReturnValue(false);
	});

	it('should thrown an error when there is not package-lock', async () => {
		hasNoPackageLock.mockReturnValue(true);
		let thrownError: any;

		try {
			const result: any[] = [];
			for await (const item of ci({})) {
				result.push(item);
			}
		} catch (err) {
			thrownError = err;
		}

		expect(getCommandLib.getCommand).toHaveCallsLike();
		expect(mountNpmCommandLib.mountNpmCommand).toHaveCallsLike();
		expect(thrownError).toBeInstanceOf(Error);
	});

	it('should run "npm audit" when force is falsy', async () => {
		const result: any[] = [];

		for await (const item of audit({})) {
			result.push(item);
		}

		expect(getCommandLib.getCommand).toHaveCallsLike([]);
		expect(mountNpmCommandLib.mountNpmCommand).toHaveCallsLike([
			'myNpmCommand',
			'audit',
			[],
		]);
		expect(result).toEqual([
			['myNpmCommand', ['audit', []]],
			['rm', ['-rf', 'pnpm-lock.yaml']],
			['npm', ['install', '--package-lock-only', '--ignore-scripts']],
		]);
	});

	it('should run "npm audit fix" when fix is true', async () => {
		const result: any[] = [];

		for await (const item of audit({ fix: true })) {
			result.push(item);
		}

		expect(getCommandLib.getCommand).toHaveCallsLike([]);
		expect(mountNpmCommandLib.mountNpmCommand).toHaveCallsLike([
			'myNpmCommand',
			'audit',
			['fix'],
		]);
		expect(result).toEqual([
			['myNpmCommand', ['audit', ['fix']]],
			['rm', ['-rf', 'pnpm-lock.yaml']],
			['npm', ['install', '--package-lock-only', '--ignore-scripts']],
		]);
	});

	it('should run "npm audit fix --force" when fix and force are true', async () => {
		const result: any[] = [];

		for await (const item of audit({ fix: true, force: true })) {
			result.push(item);
		}

		expect(getCommandLib.getCommand).toHaveCallsLike([]);
		expect(mountNpmCommandLib.mountNpmCommand).toHaveCallsLike([
			'myNpmCommand',
			'audit',
			['fix', '--force'],
		]);
		expect(result).toEqual([
			['myNpmCommand', ['audit', ['fix', '--force']]],
			['rm', ['-rf', 'pnpm-lock.yaml']],
			['npm', ['install', '--package-lock-only', '--ignore-scripts']],
		]);
	});
});
