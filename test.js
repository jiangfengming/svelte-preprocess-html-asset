const preprocessor = require('./index.js');

const content = `
<img src="./1.png">
<img src="/2.png">
`;

console.log(preprocessor().markup({ content }).code);
