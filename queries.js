'use strict';
const marked = require('marked');
const user = require('./models/user');
const file = require('./models/file');

/* Set up Postgres connector */
const promise = require('bluebird');
const options = {
    promiseLib: promise
};

const pgp = require('pg-promise')(options);
const dbSettings = {
    "host": 'localhost',
    "port": 5432,
    "database": 'markdown',
    "user": 'postgres',
    "password": 'postgresql'
};

const db = pgp(dbSettings);

/**
 * API SQL queries
 */

const getAllFiles = (req, res, next) => {
    db.any("select * from files")
        .then((data) => {
            res.status(200)
                .json({
                    "status": "success",
                    "data": data,
                    "message": "Retrieved all files"
                });
        })
        .catch((err) => next(err));
};

/* Refactor display and getSingle with Callback - DRY */
const getSingleFile = (req, res, next) => {
    const fileID = parseInt(req.params.id);
    db.one('SELECT * FROM files WHERE id = $1', fileID)
        .then((data) => {
            res.status(200)
                .json({
                    "status": "success",
                    "data": data,
                    "message": "Retrieved file"
                });
        })
        .catch((err) => next(err));
};

const displayFileByID = (req, res) => {
    file.file(parseInt(req.params.id), (file) => {
        const renderObject = {
            "title": file.getTitle(),
            "html": file.getHtml()
        };
        res.status(200)
            .render("displayHtml.hbs", renderObject);
    });
};

const createFile = (req, res, next) => {
    const title = req.body.title;
    const contents = req.body.contents;
    const html = marked(contents);
    const query = ("INSERT INTO files (title, contents, html) values ($1, $2,"
        + " $3) RETURNING id");
    db.one(query, [title, contents, html])
        .then((data) => {
            res.status(200)
                .json({
                    "status": "success",
                    "message": "Added one file",
                    "data": data
                });
        })
        .catch((err) => next(err));
};

const updateFile = (req, res, next) => {
    const title = req.body.title;
    const contents = req.body.contents;
    const id = parseInt(req.params.id);
    const query = ("UPDATE files SET title=$1, contents=$2 WHERE id=$3"
        + "RETURNING id"); 
    db.one(query, [title, contents, id])
        .then((data) => {
            res.status(200)
                .json({
                    "status": "success",
                    "message": "Modified one file",
                    "data": data
                });
        })
        .catch((err) => next(err));
};

const removeFile = (req, res, next) => {
    const id = parseInt(req.params.id);
    const query = "DELETE FROM files WHERE id=$1";
    db.none(query, id)
        .then(() => {
            res.status(200)
                .json({
                    "status": "success",
                    "message": "One file deleted"
                });
        })
        .catch((err) => next(err));
};

/** 
 * End SQL queries
 */

/* Construct user and save to memory */
const getToken = (req, res, next) => {
    const username = req.body.username;
    let newUser = user.user(username);
    newUser.setToken();
    const token = newUser.getToken();
    res.status(200)
        .json({
            "status": "success",
            "message": "Token generated",
            "token": token
        });
};

/* Auth */
// To-Do: actually do auth...
const auth = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['token'];
    if (token) {
        // obviously this is not secure...
        next();
    } else {
        res.status(403).send({
            "success": false,
            "message": "No token provided"
        });
    }
};

module.exports = {
    "getAllFiles": getAllFiles,
    "getSingleFile": getSingleFile,
    "createFile": createFile,
    "updateFile": updateFile,
    "removeFile": removeFile,
    "displayFileByID": displayFileByID,
    "getToken": getToken,
    "auth": auth
};