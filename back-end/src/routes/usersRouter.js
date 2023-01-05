const express = require('express');
const userController = require('../controllers/admin/users');
const router = express.Router();

router.get('/room', userController.getRoom);
router.post('/adduser', userController.postAddUser);

module.exports = router;
