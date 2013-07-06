# connect-stack

Stack multiple connect/express middlewares into a single middleware function

# example


myauth.js:

```js
var stack = require('connect-stack'),
    connect = require('connect');

function myAuth(req, res, next) {
    //TODO: write auth code
}

module.exports = stack(connect.cookieParser(), 
    connect.session({secret: 'hush'}),
    myAuth);

```

app.js

```js
app.use('/secret-area', require('./myauth'));
```


