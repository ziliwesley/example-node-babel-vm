import { inspect } from 'util';
import Debug from 'debug';
import { isFunction } from 'lodash';
import { isContext } from 'vm';

import { exec } from '../engine.js';

const debug = Debug('demo:access-main-context-inside-vm');

// Mock Storage Class
class Storage {
    constructor() {
        this.items = new Set();
    }

    save(item) {
        debug('save', item);

        return this.items.add(item);
    }

    remove(item) {
        debug('remove', item);

        return this.items.delete(item);
    }

    getAll() {
        return this.items;
    }
}

const sandbox = {
    // Methods of the instance can be called inside the vm
    // without any problem
    store: new Storage()
};

// Variables defined in "sandbox" will be served as global
// variables when code runs inside contextified sandbox.
//
// Math, String, Array, Date, Function can be used as normal inside
// sandbox,
// But they are different and clear
const code = `
var size = store.getAll().size;

var cane = { name: 'Cane' };

store.save({ name: 'John' });
store.save(cane);

var sizeBetween = store.getAll().size;

store.remove(cane);

var sizeFinally = store.getAll().size;
`;

// Nothing is returned
// Since all we have done are simply define variables inside
// the created context
const result = exec(code, { sandbox, filename: 'access-main-context-inside-vm' });

// Variables defined inside the vm are carried out with the sandbox
debug('sandbox changed to', sandbox);

// Store changed via the execution inside sandbox
debug('items inside store', [...sandbox.store.getAll()]);

// Check proto of store
debug('sandbox.store instanceof Storage',
    sandbox.store instanceof Storage);
// => true
