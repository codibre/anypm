import { getCommand } from './get-command';
import { BaseOptions, prepareOptions } from './prepare-options';
import { audit } from './audit';
import { frozenInstall } from './frozen-install';
import { manageLocks } from './manage-locks';

interface AuditFixOptions extends BaseOptions {
	force?: boolean;
}

export async function* auditFix(informedOptions: AuditFixOptions) {
	yield* audit({ fix: true });
	const options = prepareOptions(informedOptions);
	const { hasCommand, command } = await getCommand();
	if (hasCommand) {
		yield* frozenInstall(command);
		yield* manageLocks(hasCommand, options);
	}
}
