// routes/api/photos.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

//Import Image
const storageEngine = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, `${Date.now()}--${file.originalname}`);
    },
    });

// const checkFileType = function (file, cb) {
//     //Allowed file extensions
//     const fileTypes = /jpeg|jpg|png|gif|svg/;
    
//     //check extension names
//     const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    
//     const mimeType = fileTypes.test(file.mimetype);
    
//     if (mimeType && extName) {
//         return cb(null, true);
//     } else {
//         cb("Error: You can Only Upload Images!!");
//     }
// };
        

const upload = multer({
    storage: storageEngine,
    limits: { fileSize: 1000000000 },
});

router.post('/saveImage', upload.single('file'), (req, res) => {
    try {
        res.json({Message: 'File saved successfully', ImageName: req.file.filename});
    } catch (error) {
        res.status(500).json({message: 'Error saving file'});
    }
})
// Get Image Uploaded
router.get('/uploads/:filename', (req, res) => {
    const {filename} = req.params;
    res.sendFile(path.join(__dirname, `../../uploads/${filename}` ));
});

// Load Book model
const Photo = require('../../models/Photos');

// @route GET api/photos/test
// @description tests books route
// @access Public
router.get('/test', (req, res) => res.send('book route testing!'));

// @route GET api/books
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
    // Photo.find()
    // .then(photo => res.json(photo))
    // .catch(err => res.status(404).json({ nophotofound: 'No Photos found' }));
});

// @route GET api/books/:id
// @description Get single book by id
// @access Public
router.get('/:id', (req, res) => {
    Photo.findById(req.params.id)
    .then(book => res.json(book))
    .catch(err => res.status(404).json({ nobookfound: 'No Book found' }));
});

// @route GET api/books
// @description add/save book
// @access Public
router.post('/', (req, res) => {
    console.log(req.body);
    // Photo.create(req.body)
    // .then(book => res.json({ msg: 'Book added successfully' }))
    // .catch(err => res.status(400).json({ error: 'Unable to add this book' }));
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

// @route GET api/books/:id
// @description Update book
// @access Public
router.put('/:id', (req, res) => {
    Photo.findByIdAndUpdate(req.params.id, req.body)
    .then(book => res.json({ msg: 'Updated successfully' }))
    .catch(err =>
      res.status(400).json({ error: 'Unable to update the Database' })
    );
});

// @route GET api/books/:id
// @description Delete book by id
// @access Public
router.delete('/:id', (req, res) => {
    Photo.findByIdAndRemove(req.params.id, req.body)
    .then(book => res.json({ mgs: 'Book entry deleted successfully' }))
    .catch(err => res.status(404).json({ error: 'No such a book' }));
});

module.exports = router;