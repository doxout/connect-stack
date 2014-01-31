var t = require('tap');

var stack = require('../stack');

function last(t, res) {
    t.end();
}

function lasterr(err, t, t, next) {
    t.ok(err, 'error came to the right place');
    t.end();
}

function err(t, t, next) {
    t.ok(true, 'got through err fn'); 
    next("ERROR"); 
}

function nothing(t, t, next) { 
    t.ok(true, 'got through nothing fn'); 
    next() ; 
}

function throwing() { throw "Error: should never get here"; }

function next(t, opt) {
    return function(err) {
        if (opt && opt.errors) 
            t.ok(err, 'has appropriate error');
        else
            t.notOk(err, 'doesnt have error');
        t.end();
    }
}


t.test('calls all middlewares', function(t) {
    stack(nothing, last)(t, t);
});

t.test('calls all middlewares in array', function(t) {
    stack([nothing, last])(t, t);
});


t.test('calls next too', function(t) {
    stack(nothing, nothing)(t, t, next(t));
});

t.test('calls error middleware, skips non-error', function(t) {
    stack(nothing, err, last, lasterr)(t, t);
});

t.test('calls error middleware wrapped in stack', function(t) {
    stack(nothing, err, last, stack(lasterr))(t, t, next(t));
});

t.test('passes error outside', function(t) {
    stack(nothing, err, last)(t, t, next(t, {errors: true}));
});


