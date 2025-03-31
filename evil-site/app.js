const express = require('express');
const path = require('path');

const app = express();
const port = 3001;

// 设置模板引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 路由
app.get('/', (req, res) => {
    res.render('index');
});

app.listen(port, () => {
    console.log(`恶意网站运行在 http://localhost:${port}`);
}); 