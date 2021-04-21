import { Command, program } from 'commander';

describe('index-fix.ts', () => {
	let cmd: Command;

	afterEach(() => {
		delete require.cache[require.resolve('../../src/index-fix')];
	});

	beforeEach(() => {
		cmd = {} as Command;
		cmd.action = jest.fn().mockReturnValue(cmd) as any;
		cmd.description = jest.fn().mockReturnValue(cmd) as any;
		cmd.configureHelp = jest.fn().mockReturnValue(cmd) as any;
		jest.spyOn(program, 'option').mockReturnValue(cmd);
		jest.spyOn(program, 'parse').mockReturnThis();
	});

	it('should set available commands', () => {
		process.argv = ['a', 'b', 'c'];

		require('../../src/index-fix');

		expect(program.option).toBeCalledTimes(1);
		expect(cmd.action).toBeCalledTimes(1);
		expect(cmd.description).toBeCalledTimes(1);
		expect(cmd.configureHelp).toBeCalledTimes(1);
		expect(program.parse).toHaveCallsLike([['a', 'b', 'c']]);
	});
});
