import { inspect } from 'util';
import Debug from 'debug';
import { isFunction } from 'lodash';
import { isContext } from 'vm';

import { exec } from '../engine.js';

const debug = Debug('demo:define-variable-inside-given-context');

const sandbox = {
    PI_OF_ANOTHER_UNIVERSE: 2.1415926,

    // ATTENTION!!
    // Calling this function inside the vm will stop the
    // execution and made node.js switched back to original
    // context
    calcPerimeterInAnotherUniverse(r) {
        return 2 * PI_OF_ANOTHER_UNIVERSE * r;
    }
};

// Variables defined in "sandbox" will be served as global
// variables when code runs inside contextified sandbox.
//
// Math, String, Array, Date, Function can be used as normal inside
// sandbox,
// But they are different and clear
const code = `
    var r = 10;
    var perimeterOfAnotherUniverse = multiply(2, PI_OF_ANOTHER_UNIVERSE, r);

    var perimeter = multiply(2, Math.PI, r);

    var message = \`${'hello'.toUpperCase()} ${['w', 'o', 'r', 'l', 'd'].join('')}\`

    var now = Date.now();

    function multiply() {
        return Array.prototype.reduce.call(arguments, (prev, curr) => {
            return prev * curr;
        }, 1)
    }

    var FunctionCtor = Function;
`;

// Nothing is returned
// Since all we have done are simply define variables inside
// the created context
const result = exec(code, { sandbox, filename: 'define-variable-inside-new-context' });

// Variables defined inside the vm are carried out with the sandbox
debug('sandbox changed to', sandbox);

// Sandbox has been contextified
debug('is contextified', isContext(sandbox));

// Using function defined inside the vm
debug('sandbox.multiply(2, 4)', sandbox.multiply(2, 4));

// functions defined inside the vm are constructed
// using the `Function` constructor of the "sandbox"
debug('sandbox.multiply instanceof Function',
    sandbox.multiply instanceof Function);
// => false
debug('sandbox.multiply instanceof sandbox.FunctionCtor',
    sandbox.multiply instanceof sandbox.FunctionCtor);
// => true

// using `typeof` still result `function`
debug('typeof sandbox.multiply',
    typeof sandbox.multiply);
// => function

// using `toString` still result `[object Function]`
debug('Object.prototype.toString.call(sandbox.multiply)',
    Object.prototype.toString.call(sandbox.multiply));
// => function

// _.isFunction use `Object.prototype.toString.call(func)` to check internally,
// thus cause no trouble indentify "the function is a Function"
// See [isFunction](https://github.com/lodash/lodash/blob/master/lodash.js#L9619)
debug('_.isFunction(sandbox.multiply)',
    isFunction(sandbox.multiply));
// => true

debug('done');
