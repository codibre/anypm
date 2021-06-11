import { readFileSync } from 'fs';

export async function replaceNpm() {
	console.info('If you use Linux, add this to your .zshrc or .bashrc:');
	console.info('-----------------------------------------------------');
	console.info(readFileSync('apply-nvmrc.sh').toString());
}
