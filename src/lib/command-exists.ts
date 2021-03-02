import { promisify } from 'util';
import which = require('which');

export const commandExists = promisify(which);
