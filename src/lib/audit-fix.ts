import { BaseOptions } from './prepare-options';
import { audit } from './audit';

interface AuditFixOptions extends BaseOptions {
	force?: boolean;
	keepLock?: boolean;
}

export function auditFix(informedOptions: AuditFixOptions) {
	return audit({ ...informedOptions, fix: true });
}
