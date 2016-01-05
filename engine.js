import { Script, createContext, runInNewContext, isContext } from 'vm';
import { inspect } from 'util';
import Debug from 'debug';

const debug = Debug('demo:engine');

export function review(code, { filename = 'vm.js' }) {
    debug('review', code);

    // Compile and return the compiled code with a
    // filename (default: 'vm.js')
    return new Script(code, {
        // allows you to control the filename that shows up in any stack traces
        // produced from this script.
        filename
    });
}

export function createSandbox(context) {
    debug('create sandbox', context);

    return createContext(context);
}

export function exec(code, { sandbox = {}, filename } = {}) {
    // Review the code before actually executing it
    const script = review(code, { filename });
    let result;

    if (isContext(sandbox)) {
        throw Error('"sandbox" has already been contextified, use "execIn" instead');
    }

    debug('sandbox before executing', sandbox);

    try {
        result = script.runInNewContext(sandbox);
    } catch (e) {
        debug('failed executing', {
            message: e.message,
            stack: e.stack
        });
    }

    // View Context After the codes actually executed
    debug('sandbox after execution', sandbox);
    // Result from executing the code
    debug('result', typeof(result));

    // Return the result
    return result;
}
