'use strict';

var express = require('express');
var controller = require('./project.controller');
import auth from '../../auth/auth.service';
var router = express.Router();

router.get('/', controller.index);
router.get('/all', auth.hasRole('admin'), controller.all);
router.get('/:id', controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
router.post('/:id/addImage', auth.hasRole('admin'), controller.addImage);
router.post('/:id/removeImage', auth.hasRole('admin'), controller.removeImage);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/images/:id', controller.getImage);
module.exports = router;
