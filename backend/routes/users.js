const express = require('express');
const router = express.Router();
const {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    searchUsers,
    exportUsers,
    upload
} = require('../controllers/users');

router.route('/')
    .post(upload.single('profile'), createUser)
    .get(getUsers);

router.route('/export').get(exportUsers);

router.route('/:id')
    .get(getUser)
    .put(upload.single('profile'), updateUser)
    .delete(deleteUser);

router.route('/search/:key').get(searchUsers);

module.exports = router;
