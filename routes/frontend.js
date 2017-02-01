'use strict';
const express = require('express');
const router = express.Router();
const db = require('../queries');

/* File Display for search by ID */
router.get('/files/:id/display', db.displayFileByID);

module.exports = router;