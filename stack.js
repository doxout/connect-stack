function makeCallbacks(callbackList, req, res, next) {
    var i = 0;
    return function callbacks(err) {
        var fn = callbackList[i++];
        try {
            if (err && fn) {
                // if this function isnt an error handler try the next one
                if (fn.length < 4)
                    callbacks(err);
                // otherwise pass the error to this one
                else 
                    fn(err, req, res, callbacks);
            } else if (fn) {
                // no errors? if this function isnt an err handler, use it
                if (fn.length < 4)
                    fn(req, res, callbacks);
                // otherwise try the next function
                else
                    callbacks();
            } else {
                // we are out of the stack
                next(err);
            }
        } catch (err2) {
            // an error was thrown? find an error handler.
            if (i < callbackList.length)                     
                callbacks(err2);
            else 
                next(err2);
        }
    }
}



module.exports = function stack(callbackList) {
    if (!(callbackList instanceof Array))
        callbackList = [].slice.call(arguments);

    var len = 3, stack;
    if (callbackList[0]) len = callbackList[0].length;
    
    if (len <= 3) stack = function stack(req, res, next) {
        var callbacks = makeCallbacks(callbackList, req, res, next);
        callbacks();
    }
    else stack = function stack(err, req, res, next) {
        var callbacks = makeCallbacks(callbackList, req, res, next);
        callbacks(err);
    }

    stack.push = function(mw) {
        if (typeof(mw) !== 'function')
            throw new TypeError("Middleware must be a function");
        callbackList.push(mw);
        return stack;
    }

    return stack;
};
