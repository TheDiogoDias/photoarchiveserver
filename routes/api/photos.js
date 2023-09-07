// routes/api/photos.js

const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const router = express.Router();
        
const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000000 },
});

router.post('/saveImage', upload.single('image'), async (req, res) => {

    const imageBuffer = req.file.buffer;

    const parsedFileName = path.parse(req.file.originalname).name;

    const lowQualityBuffer = await sharp(imageBuffer)
    .resize({ width: 800 })
    .jpeg({ quality: 30 })
    .toBuffer();

    const mediumQualityBuffer = await sharp(imageBuffer)
    .resize({ width: 1200 })
    .jpeg({ quality: 60 })
    .toBuffer();

    const highQualityBuffer = await sharp(imageBuffer)
    .resize({ width: 1600 })
    .jpeg({ quality: 80 })
    .toBuffer();

    // Save the buffers to the server's file system
    const uploadDirectory = path.join(__dirname, `../../uploads/${parsedFileName}/`);

    try {
        fs.mkdirSync(uploadDirectory, { recursive: true }, (err) => {
            if (err) throw err;
          });
        console.log('Folder created successfully');
      } catch (err) {
        console.error('Error creating folder:', err);
      }

    fs.writeFileSync(path.join(uploadDirectory, 'low_quality.jpg'), lowQualityBuffer);
    fs.writeFileSync(path.join(uploadDirectory, 'medium_quality.jpg'), mediumQualityBuffer);
    fs.writeFileSync(path.join(uploadDirectory, 'high_quality.jpg'), highQualityBuffer);
    fs.writeFileSync(path.join(uploadDirectory, 'original.jpg'), imageBuffer);


    try {
        res.json({Message: 'File saved successfully', ImageName: parsedFileName});
    } catch (error) {
        res.status(500).json({message: 'Error saving file'});
    }
});

router.post('/saveProfileImage', upload.single('image'), async (req, res) => {

    const imageBuffer = req.file.buffer;

    const parsedFileName = path.parse(req.file.originalname).name;

    const lowQualityBuffer = await sharp(imageBuffer)
    .resize({ width: 800 })
    .jpeg({ quality: 30 })
    .toBuffer();

    const mediumQualityBuffer = await sharp(imageBuffer)
    .resize({ width: 1200 })
    .jpeg({ quality: 60 })
    .toBuffer();

    const highQualityBuffer = await sharp(imageBuffer)
    .resize({ width: 1600 })
    .jpeg({ quality: 80 })
    .toBuffer();

    // Save the buffers to the server's file system
    const uploadDirectory = path.join(__dirname, `../../uploads/profileImg/${parsedFileName}/`);

    try {
        fs.mkdirSync(uploadDirectory, { recursive: true }, (err) => {
            if (err) throw err;
          });
        console.log('Folder created successfully');
      } catch (err) {
        console.error('Error creating folder:', err);
      }

    fs.writeFileSync(path.join(uploadDirectory, 'low_quality.jpg'), lowQualityBuffer);
    fs.writeFileSync(path.join(uploadDirectory, 'medium_quality.jpg'), mediumQualityBuffer);
    fs.writeFileSync(path.join(uploadDirectory, 'high_quality.jpg'), highQualityBuffer);
    fs.writeFileSync(path.join(uploadDirectory, 'original.jpg'), imageBuffer);


    try {
        res.json({Message: 'File saved successfully', ImageName: parsedFileName});
    } catch (error) {
        res.status(500).json({message: 'Error saving file'});
    }
});

router.post('/internetSpeed', async (req, res) => {
    const { effectiveType } = req.body;

    try {
        res.status(201).json({ message: effectiveType });
    } catch (error) {
        res.status(500).json({ message: 'Error saving connection info' });
    }
});

// Get Image Uploaded
router.get('/uploads/:filename/:internetSpeed', (req, res) => {
    const {filename} = req.params;
    const {internetSpeed} = req.params;
    //'slow-2g', '2g', '3g', '4g', or '5g'
    switch (internetSpeed) {
        case 'slow-2g':
            res.sendFile(path.join(__dirname, `../../uploads/${filename}/low_quality.jpg` ));
            break;
        case '2g':
            res.sendFile(path.join(__dirname, `../../uploads/${filename}/medium_quality.jpg` ));
            break;
        case '3g':
            res.sendFile(path.join(__dirname, `../../uploads/${filename}/high_quality.jpg` ));
            break;
        case '4g':
            res.sendFile(path.join(__dirname, `../../uploads/${filename}/original.jpg` ));
            break;
        // Add more cases as needed
        default:
            res.sendFile(path.join(__dirname, `../../uploads/${filename}/low_quality.jpg` ));
      }
    
});

router.get('/uploadsProfileImg/:filename/:internetSpeed', (req, res) => {
    const {filename} = req.params;
    const {internetSpeed} = req.params;
    //'slow-2g', '2g', '3g', '4g', or '5g'
    switch (internetSpeed) {
        case 'slow-2g':
            res.sendFile(path.join(__dirname, `../../uploads/profileImg/${filename}/low_quality.jpg` ));
            break;
        case '2g':
            res.sendFile(path.join(__dirname, `../../uploads/profileImg/${filename}/medium_quality.jpg` ));
            break;
        case '3g':
            res.sendFile(path.join(__dirname, `../../uploads/profileImg/${filename}/high_quality.jpg` ));
            break;
        case '4g':
            res.sendFile(path.join(__dirname, `../../uploads/profileImg/${filename}/original.jpg` ));
            break;
        // Add more cases as needed
        default:
            res.sendFile(path.join(__dirname, `../../uploads/profileImg/${filename}/low_quality.jpg` ));
      }
});

// Load Book model
const Photo = require('../../models/Photos');

// @route GET api/photos/test
// @description tests books route
// @access Public
router.get('/test', (req, res) => res.send('book route testing!'));

// @route GET api/photos
// @description Get all books
// @access Public
router.get('/', async (req, res) => {
    try{
        const documents = await Photo.find().sort({publishDate: -1}).exec();
        res.json(documents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/profile/:profileId', async (req, res) => {
    const author = req.params.profileId;
  
    try {
      const posts = await Photo.find({ author }).sort({publishDate: -1}).exec();
      res.json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ message: 'Error fetching posts' });
    }
});

// @route GET api/photos/:id
// @description Get single book by id
// @access Public
router.get('/:id', (req, res) => {
    Photo.findById(req.params.id)
    .then(book => res.json(book))
    .catch(err => res.status(404).json({ nobookfound: 'No Book found' }));
});

// @route GET api/photos
// @description add/save photos
// @access Public
router.post('/', (req, res) => {

    try{
        const newPost = new Photo({
            placeName: req.body.placeName,
            geolocation: req.body.geolocation,
            author: req.body.author,
            title: req.body.title,
            description: req.body.description,
            iso: req.body.iso,
            aperture: req.body.aperture,
            focalLength: req.body.focalLength,
            fileName: req.body.fileName,
            publishDate: req.body.publishDate
        })

        newPost.save()
        .then(savedPost=> {
        res.status(201).json(savedPost);
        })
        .catch(error => {
        res.status(500).json({ error: 'Error saving profile' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// @route GET api/photos/:id
// @description Update book
// @access Public
router.put('/:id', (req, res) => {
    Photo.findByIdAndUpdate(req.params.id, req.body)
    .then(book => res.json({ msg: 'Updated successfully' }))
    .catch(err =>
      res.status(400).json({ error: 'Unable to update the Database' })
    );
});

// @route Delete api/photos/:id
// @description Delete book by id
// @access Public
router.delete('/:id', async (req, res) => {
    try{
        const deletedPost = await Photo.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
          return res.status(404).json({ message: 'Post not found' });
        }
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Error deleting post' });
    }
});

module.exports = router;