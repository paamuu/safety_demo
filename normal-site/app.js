const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();
const port = 3000;

// 设置模板引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 中间件
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'normal-site-secret',
    resave: false,
    saveUninitialized: true
}));

// 模拟用户数据
const users = {
    'admin': {
        password: 'admin',
        balance: 5000
    }
};

// 路由
app.get('/', (req, res) => {
    if (req.session.loggedIn) {
        res.render('dashboard', { 
            username: req.session.username,
            balance: users[req.session.username].balance
        });
    } else {
        res.redirect('/login');
    }
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username].password === password) {
        req.session.loggedIn = true;
        req.session.username = username;
        res.redirect('/');
    } else {
        res.render('login', { error: '用户名或密码错误' });
    }
});

app.post('/transfer', (req, res) => {
    if (!req.session.loggedIn) {
        return res.status(401).send('未登录');
    }
    const { amount } = req.body;
    res.render('dashboard', { 
        username: req.session.username,
        balance: users[req.session.username].balance,
        message: `成功转账 ${amount} 元`
    });
});

// 添加余额查询接口
app.get('/balance', (req, res) => {
    console.log(req.headers.referer,'reference-balance')
    // if (!req.session.loggedIn) {
    //     return res.status(401).send('未登录');
    // }
    const balance = users[req.session.username]?.balance ||5000;
    res.json({ balance });
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.listen(port, () => {
    console.log(`正常网站运行在 http://localhost:${port}`);
}); 