const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs').promises
let to;
let from;
to = './data2/file.txt';
from = './data1/file.txt';

fs.stat(from, (err) => {
    if (err) {
        to = './data1/file.txt';
        from = './data2/file.txt'
    }
});

app.get('/item', async (req, res) => {
    try {
        await fs.appendFile(from, req.query.id,)
        res.send('Hello World!')
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
})

app.get('/move', async (req, res) => {
    try {
        await fs.rename(from, to);
        const temp = from;
        from = to;
        to = temp;
        const stat = await fs.stat(from);
        if (stat.size / (1024 * 1024) > 2) {
            await fs.writeFile(from, '');
        }
        res.status(200).end();

    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
})

app.listen(port, () => {
    console.log(`test app listening at http://localhost:${port}`)
})