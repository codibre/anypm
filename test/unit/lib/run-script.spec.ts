import { runScriptFactory } from '../../../src/lib/run-script-factory';
import * as childProcess from 'child_process';
import { EventEmitter } from 'events';

describe(runScriptFactory.name, () => {
	let commands: (...args: any[]) => any;
	let emitter: EventEmitter;

	beforeEach(() => {
		emitter = new EventEmitter();
		jest.spyOn(childProcess, 'spawn').mockReturnValue(emitter as any);
		jest.spyOn(emitter, 'once');
	});

	it('should return a callback that executes the scripts repassing the arguments', async () => {
		commands = jest.fn().mockImplementation(function* (a: string) {
			setImmediate(() => emitter.emit('exit', 0));
			yield [`command1 ${a}`, ['p1', 'p2', 'p3']];
			setImmediate(() => emitter.emit('exit', 0));
			yield [`command2 ${a}`, ['p4', 'p5', 'p6']];
		});

		const callback = runScriptFactory(commands);
		const result = await callback('test');

		expectCallsLike(
			emitter.once,
			['exit', expect.any(Function)],
			['exit', expect.any(Function)],
		);
		expectCallsLike(commands, ['test']);
		expect(result).toBeUndefined();
	});

	it('should omit error when some command fails', async () => {
		commands = jest.fn().mockImplementation(function* (a: string) {
			setImmediate(() => emitter.emit('exit', 1));
			yield [`command1 ${a}`, ['p1', 'p2', 'p3']];
			setImmediate(() => emitter.emit('exit', 0));
			yield [`command2 ${a}`, ['p4', 'p5', 'p6']];
		});

		const callback = runScriptFactory(commands);
		const result = await callback('test');

		expectCallsLike(
			emitter.once,
			['exit', expect.any(Function)],
			['exit', expect.any(Function)],
		);
		expectCallsLike(commands, ['test']);
		expect(result).toBeUndefined();
	});
});
