import { inspect } from 'util';
import { exec } from '../engine.js';
import Debug from 'debug';

const debug = Debug('demo:define-functio-in-vm');

const sandbox = {
    // debug will be called when the defined function has
    // been actually called
    debug
};

const code = `
(function factorial(n) {
    debug(\`Calc factorial of $\{n\}\`);
    return n === 1 ? 1: n * factorial(n - 1);
});
`;

// A function is returned
const factorial = exec(code, { sandbox, filename: 'define-functio-in-vm' });

// Call the function
debug('factorial(5)', factorial(5));
// => 5

debug('done');
