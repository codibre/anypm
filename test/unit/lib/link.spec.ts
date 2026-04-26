import { link } from '../../../src/lib/link';
import * as getCommandLib from '../../../src/lib/get-command';
import * as mountNpmCommandLib from '../../../src/lib/mount-npm-command';
import * as prepareManagerLib from '../../../src/lib/prepare-manager';
import * as manageLocksLib from '../../../src/lib/manage-locks';

describe('link command', () => {
	beforeEach(() => {
		jest.spyOn(getCommandLib, 'getCommand').mockResolvedValue({
			hasCommand: 'hasPNPM value' as any,
			command: 'myNPM' as any,
		});
		jest
			.spyOn(mountNpmCommandLib, 'mountNpmCommand')
			.mockImplementation((...[a, ...others]: any[]) => [a, others]);
		jest.spyOn(prepareManagerLib, 'prepareManager');
		jest.spyOn(manageLocksLib, 'manageLocks');
	});

	it('runs `link` with no packages', async () => {
		const iterable = link([], {} as any);
		const result: any[] = [];
		for await (const item of iterable) result.push(item);

		expectCallsLike(getCommandLib.getCommand, []);
		expectCallsLike(mountNpmCommandLib.mountNpmCommand, ['myNPM', 'link', []]);
		expect(result).toEqual([['myNPM', ['link', []]]]);
		expect(prepareManagerLib.prepareManager).not.toHaveBeenCalled();
		expect(manageLocksLib.manageLocks).not.toHaveBeenCalled();
	});

	it('runs `link` with packages', async () => {
		const iterable = link(['pkg1', 'pkg2'], {} as any);
		const result: any[] = [];
		for await (const item of iterable) result.push(item);

		expectCallsLike(mountNpmCommandLib.mountNpmCommand, [
			'myNPM',
			'link',
			['pkg1', 'pkg2'],
		]);
		expect(result).toEqual([['myNPM', ['link', ['pkg1', 'pkg2']]]]);
	});

	it('runs `link -g` with packages', async () => {
		const iterable = link(['pkg1'], { global: true } as any);
		const result: any[] = [];
		for await (const item of iterable) result.push(item);

		expectCallsLike(mountNpmCommandLib.mountNpmCommand, [
			'myNPM',
			'link',
			['-g', 'pkg1'],
		]);
		expect(result).toEqual([['myNPM', ['link', ['-g', 'pkg1']]]]);
	});
});
