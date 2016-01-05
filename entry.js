import { readdir } from 'fs';
import Debug from 'debug';
import Promise from 'bluebird';
import { prompt } from 'inquirer';

const debug = Debug('demo:entry');

const readdirAsync = Promise.promisify(readdir);
// U_U!! Cuz `Promise.promisify()` simply just not working...
const promptAsync = Promise.promisify((questions, callback) => {
    try {
        prompt(questions, (anwsers) => callback(null, anwsers));
    } catch (e) {
        callback(e);
    }
});

readdirAsync('./demo')
    .then(files => {
        debug('files', files);

        return promptAsync([{
            type: 'list',
            name: 'filename',
            choices: files,
            message: 'Choose a demo to run'
        }]);
    })
    .then(({ filename }) => {
        debug('choose', filename);

        require(`./demo/${filename}`);
    });
