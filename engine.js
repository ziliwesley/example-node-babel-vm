import { Script, createContext, runInNewContext, isContext } from 'vm';
import { inspect } from 'util';
import Debug from 'debug';
import { transform } from 'babel-core';
import { highlight } from 'cardinal';

const debug = Debug('demo:engine');

const highlightOpts = {
    linenos: true
};

export function review(source, { filename = 'vm.js', babelify = false }) {
    debug('review', '\n' + highlight(source, highlightOpts));

    if (babelify) {
        let {
            code,
            map,
            ast
        } = transform(source, {
            presets: [
                'es2015-node4',
                'stage-1'
            ]
        });

        debug('transpiled', '\n' + highlight(code, highlightOpts));
        debug('map', map);

        // Compile the "transpiled/babelified" code instead
        return new Script(code, {
            filename
        });
    }

    // Compile and return the compiled code with a
    // filename (default: 'vm.js')
    return new Script(source, {
        // allows you to control the filename that shows up in any stack traces
        // produced from this script.
        filename
    });
}

export function createSandbox(context) {
    debug('create sandbox', context);

    return createContext(context);
}

export function exec(code, { sandbox = {}, filename, babelify } = {}) {
    // Review the code before actually executing it
    const script = review(code, { filename, babelify });
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
