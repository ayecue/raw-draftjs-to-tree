'use strict';

const fs = require('fs');
const path = require('path');

function createHtmlFile(html, times) {
    const output = `<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    </head>
    <div>
    (to Tree => to HTML) ${times.conversionToTreeTime + times.htmlConversionTime}ms
    </div>
    <div>
    ${html}
    </div>`;

    fs.writeFile(path.resolve(__dirname, 'output.html'), output, function(err) {
        if (err) {
            return console.log(err);
        }
        console.log("The comparison output was saved to example/output.html");
    });
}

module.exports = createHtmlFile;
