/**
 * meta-validate.js
 *
 * Created by jay on 3/26/18
 */

const ajv = require('ajv');
const path = require('path');

const schema = require(path.join(__dirname, '../trivia-schema.json'));

let validator = new ajv();

let valid = validator.validateSchema(schema);

if (!valid) {
    console.log(validator.errors);
} else {
    console.log('schema validates');
}