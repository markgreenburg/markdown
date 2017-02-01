'use strict';
const express = require('express');
const router = express.Router();
const db = require('../queries');

/* Generates new token */
router.post('/login', db.getToken);

/* Require auth for all other API endpoints */
router.all('/*', db.auth);

/* Protected API Routes */
router.route('/files')
    .get(db.getAllFiles)
    .post(db.createFile);
router.route('/files/:id')
    .get(db.getSingleFile)
    .put(db.updateFile)
    .delete(db.removeFile);

module.exports = router;
