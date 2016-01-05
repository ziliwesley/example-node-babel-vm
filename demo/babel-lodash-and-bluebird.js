import { inspect } from 'util';
import { exec } from '../engine.js';
import Debug from 'debug';
import Promise, { coroutine } from 'bluebird';
import lodash from 'lodash';

const debug = Debug('demo:babel-lodash-and-bluebird');

// Mock outter storage
const storage = new Map([
    ['normal', [1, 2, 3, 4, 5]],
    ['odd', [1, 3, 5, 7, 9]],
    ['even', [2, 4, 6, 8, 10]],
]);

// Mock API
const api = {
    fetch(key) {
        return Promise
            .delay(1000)
            .then(() => storage.get(key));
    }
};

const sandbox = {
    // debug will be called when the defined function has
    // been actually called
    debug,
    // Add reference to api library
    api,
    // Add reference to custom Promise implementation
    Promise,
    // Add reference to third party library
    _: lodash
};

let code = `
(function fetchDataAsync(...selection) {
    debug('fetch', selection);

    return Promise
        .map([...selection], api.fetch)
        .tap(dataSet => debug('dataSet', dataSet))
        .then(dataSet => _.flatten(dataSet));
});
`;

coroutine(function* run() {
    // A function is returned
    const fetchDataAsync = exec(code, {
        sandbox,
        filename: 'babel-lodash-and-bluebird',
        babelify: true
    });

    // Returned Function
    debug('fetchDataAsync', fetchDataAsync);

    // Call the function
    const result = yield fetchDataAsync('even', 'odd');
    debug('result', result);
    // => 5

    debug('done');
})();
