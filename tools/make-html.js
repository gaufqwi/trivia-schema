/**
 * make_html.js
 *
 * Created by jay on 3/28/18
 */

const ajv = require('ajv');
const path = require('path');
const fs = require('fs');

const template = fs.readFileSync(path.join(__dirname, 'template.html')).toString('utf-8');
const schema = require(path.join(__dirname, '../trivia-schema.json'));
const validator = new ajv();

let infile = process.argv[2];
let outfile = process.argv[3];

let source = JSON.parse(fs.readFileSync(infile));
let valid = validator.validate(schema, source);

if (valid) {
    let title = source.title || 'Trivia';
    let description = source.description || 'A round of trivia';
    let output = template.replace(/\$title/g, title).replace(/\$description/g, description);
    let content = '';
    let i = 0;
    for (let item of source.items) {
        let q = item.question || '';
        let a = formatAnswer(item.answer);
        let mm = '';
        if (item.multimedia && item.multimedia.length) {
            mm = formatMM(source, item.multimedia);
        }
        content += `
<div class="item">
<div class="question">${q}</div>
${mm}
<div class="answer"><span class="label" id="label${i}" onClick="showAnswer(${i})">Show Answer</span><span style="display: none;" id="ans${i}">${a}</span></div>
</div>`;
    i += 1;
    }
    output = output.replace(/\$content/g, content);
    fs.writeFile(outfile, output);
} else {
    console.log('Input data not valid');
    console.log(validator.errors);
}

function formatAnswer (ans) {
    if (typeof ans === 'string') {
        return ans;
    }
    if (ans.regex) {
        return `Matches regular expression ${ans.regex}`;
    }
    if (ans.choice) {
        return `Answer choice ${ans.choice}`;
    }
    if (ans.and) {
        return `(all of) ${ans.and.join(', ')}`
    }
    if (ans.or) {
        return `(any of) ${ans.or.join(', ')}`
    }
    if (ans.n) {
        return `(${ans.n} of) ${ans.of.join(', ')}`
    }
}

function formatMM (source, mmarray) {
    let html = '';
    for (let mm of mmarray) {
        if (typeof mm.mmref !== "undefined") {
            mm = source.multimedia[mm.mmref];
        }
        if (mm.type === 'image') {
            let source = mm.sources[0];
            let uri = source.uri || `data:${source.mimetype};base64,${source.data}`;
            html += `
<div class="mmcontent"><img src="${uri}"></div>
`;
        } else if (mm.type === 'audio') {
            let sources = '';
            for (let source of mm.sources) {
                let uri = source.uri || `data:${source.mimetype};base64,${source.data}`;
                sources += `<source src="${uri}" type="${source.mimetype}">
`
            }
            html += `<div class="mmcontent"><audio controls>${sources}</audio></div>`;
        }
    }
    return `<div class="mmcontainer">${html}</div>`;
}