
const preprocessor = require('./index.js');

const content = `
<script>
const foo = 1;
</script>

<img on:click={() => console.log('click')} src="./1.png">
<img src="/2.png">

<img srcset="elva-fairy-480w.jpg 480w,
             elva-fairy-800w.jpg 800w"
     sizes="(max-width: 600px) 480px,
            800px"
     src="elva-fairy-800w.jpg"
     alt="Elva dressed as a fairy">

<picture>
  <source type="image/svg+xml" srcset="pyramid.svg">
  <source type="image/webp" srcset="pyramid.webp">
  <img src="pyramid.png" alt="regular pyramid built from four equilateral triangles">
</picture>

<style>
p {
  & b {
    color: red;
  }
}
</style>
`;

console.log(preprocessor().markup({ content }).code);
