/**
 * Created by unbound on 11/23/13.
 */
var fs = require('fs'),
    path = require('path'),
    util = require('util'),
    connect = require('connect'),
    editor = require('./editor'),
    app = connect();

app.use(connect.bodyParser());
app.use(connect.query());
app.use(editor());
app.use(connect.static(path.resolve('')));

app.listen(8080);