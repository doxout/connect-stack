module.exports = function stack() {
    var callbackList = [].slice.call(arguments);
    return function (req, res, next) {
        var i = 0;

        function callbacks(err) {
            var fn = callbackList[i++];
            try {
                if (err && fn) {
                    // if this function is not an error handler try the next one
                    if (fn.length < 4)
                        return callbacks(err);
                    // otherwise pass the error to this one
                    fn(err, req, res, callbacks);
                } else if (fn) {
                    // no errors - if this function is not an error handler, use it
                    if (fn.length < 4)
                        return fn(req, res, callbacks);
                    // otherwise try the next function
                    callbacks();
                } else {
                    // we are out of the stack
                    next(err);
                }
            } catch (err) {
                // an error was thrown? find an error handler.
                callbacks(err);
            }
        }

        callbacks();
    }
};
