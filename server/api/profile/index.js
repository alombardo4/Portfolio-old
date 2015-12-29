'use strict';

var express = require('express');
var controller = require('./profile.controller');
import auth from '../../auth/auth.service';
var router = express.Router();

router.get('/', controller.index);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/', auth.hasRole('admin'), controller.update);
router.patch('/', auth.hasRole('admin'), controller.update);
router.post('/addPortrait', auth.hasRole('admin'), controller.addPortrait);
router.post('/addBackground', auth.hasRole('admin'), controller.addBackground);
router.get('/image/:id', controller.getImage);
module.exports = router;
