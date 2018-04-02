/**
 * validate-trivia.js
 *
 * Created by jay on 3/26/18
 */

const ajv = require('ajv');
const path = require('path');
const fs = require('fs');

const schema = require(path.join(__dirname, '../trivia-schema.json'));

let validator = new ajv();

let data = JSON.parse(fs.readFileSync(process.argv[2]));

let valid = validator.validate(schema, data);

if (!valid) {
    console.log(validator.errors);
} else {
    console.log('data validates');
}
