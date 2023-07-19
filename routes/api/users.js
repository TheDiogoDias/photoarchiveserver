const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Load User model
const User = require('../../models/Users');

router.post('/register', (req, res) => {
    console.log(req.body);
    User.create(req.body).then(book => res.json({ msg: 'User added successfully' }))
    .catch(err => res.status(400).json({ error: 'Unable to add this User' }));
});

async function validateLogin(username, password) {
    const userExists = await User.exists({username, password});
    return userExists;
}

router.post('/login', (req,res) => {
    const { username, password } = req.body;
    const isValid = validateLogin(username, password).then(isValid => res.json({isValid})).catch(error => res.status(500).json({error: 'Internal server error'}));
});

router.get('/getName/:id', async (req, res) => {
    const userId = req.params.id;

    await User.findOne({_id: userId})
    .then(user => {
        if (user){
            const userName = user.name;
            res.json({name: userName});
            return userName;
        } else {
            res.status(404).json({error: 'User not found'});
        }
    })
    .catch(error => {
        res.status(500).json({error: 'Error retrieving user'});
    });
});

module.exports = router;