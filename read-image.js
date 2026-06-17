const fs = require('fs');
const buf = fs.readFileSync('c:/Users/Ajitesh/Desktop/naved/ak-clone/Inspiration-02.jpg');
const b64 = buf.toString('base64');
const html = '<html><body style="margin:0;background:#000"><img src="data:image/jpeg;base64,' + b64 + '" style="max-width:100%;height:auto"/></body></html>';
fs.writeFileSync('c:/Users/Ajitesh/Desktop/naved/ak-clone/view-inspiration.html', html);
console.log('Done. Open view-inspiration.html in browser.');
