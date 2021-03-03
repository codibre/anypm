import { mountNpmCommand } from '../../../src/lib/mount-npm-command';

describe(mountNpmCommand.name, () => {
	it('should mount command with no save-dev parameter when saveDev is not informed', () => {
		const result = mountNpmCommand('myNPM', 'doABarrelRoll', [
			'pack1',
			'pack2',
			'pack3',
		]);

		expect(result).toEqual([
			'myNPM',
			['doABarrelRoll', 'pack1', 'pack2', 'pack3'],
		]);
	});

	it('should mount command with no save-dev parameter when saveDev is false', () => {
		const result = mountNpmCommand(
			'myNPM',
			'doABarrelRoll',
			['pack1', 'pack2', 'pack3'],
			false,
		);

		expect(result).toEqual([
			'myNPM',
			['doABarrelRoll', 'pack1', 'pack2', 'pack3'],
		]);
	});

	it('should mount command with save-dev parameter when saveDev is true', () => {
		const result = mountNpmCommand(
			'myNPM',
			'doABarrelRoll',
			['pack1', 'pack2', 'pack3'],
			true,
		);

		expect(result).toEqual([
			'myNPM',
			['doABarrelRoll', '-D', 'pack1', 'pack2', 'pack3'],
		]);
	});
});
