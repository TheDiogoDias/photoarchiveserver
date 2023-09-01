// routes/api/photos.js
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Load User model
const Photographers = require('../../models/Photographer');
const ObjectId = mongoose.Types.ObjectId;

router.get('/getProfile/:id', async (req, res) => {
    try{
        const idToFind = req.params.id;

        const result = await Photographers.findOne({ User: idToFind });

        if(result) {
            res.send(result);

        } else{
            res.send(false);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }

});

router.post('/createProfile', async (req, res) => {

    try{
        const newProfile = new Photographers({
            User: req.body.User,
            Age: req.body.Age,
            TimeOfExperience: req.body.TimeOfExperience,
            Camera: req.body.Camera,
            Lens: req.body.Lens,
            ProfileImg: req.body.ProfileImg
        })

        newProfile.save()
        .then(savedProfile=> {
        res.status(201).json(savedProfile);
        })
        .catch(error => {
        res.status(500).json({ error: 'Error saving profile' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
    
  
});

module.exports = router;