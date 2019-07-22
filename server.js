const path = require('path');
const express = require('express');
const staticFiles = ['js', 'css', 'img']
const app = express();

app.use(express.static(path.join(__dirname, 'build')))
// frontend routes =========================================================
app.get('/*', (req, res) => {
    const dest = req.url.indexOf('/static') === 0 ? req.url : 'index.html';
    res.sendFile(path.resolve(__dirname, 'build', dest))
})

app.listen(3000, () => {
    console.log('started listening on port 3000')
})
