'use strict';
const express = require('express');
const router = express.Router();

const db = require('../queries');

/* API Routes */
router.get('/api/files', db.getAllFiles);
router.get('/api/files/:id', db.getSingleFile);
router.post('/api/files', db.createFile);
router.put('/api/files/:id', db.updateFile);
router.delete('/api/files/:id', db.removeFile);

/* File Display for search by ID*/
router.get('/files/:id/display', db.displayFileByID);


module.exports = router;
