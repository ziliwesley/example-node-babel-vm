import { inspect } from 'util';
import { exec } from '../engine.js';
import Debug from 'debug';

const debug = Debug('demo:define-variable-inside-new-context');

const code = `
    var arr = [1, 2, 3, 4];
    var mapped = arr.map(n => n + 1);
`;

// Nothing is returned
// Since all we have done are simply define variables inside
// the created context
const result = exec(code, { filename: 'define-variable-inside-new-context' });

debug('done');
