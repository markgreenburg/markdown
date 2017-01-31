'use strict';
const express = require('express');
const router = express.Router();
const db = require('../queries');

/* Generates new token */
router.post('/api/login', db.getToken);

/* Protected API Routes */
router.get('/api/files', db.auth, db.getAllFiles);
router.get('/api/files/:id', db.auth, db.getSingleFile);
router.post('/api/files', db.auth, db.createFile);
router.put('/api/files/:id', db.auth, db.updateFile);
router.delete('/api/files/:id', db.auth, db.removeFile);

/* File Display for search by ID */
router.get('/files/:id/display', db.displayFileByID);

module.exports = router;
