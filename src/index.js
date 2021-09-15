const express = require('express');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb) => {
        /* cb(null, file.originalname); */
        cb(null, uuidv4() + path.extname(file.originalname).toLowerCase());
    }
});

// Initilizations
const app = express();

// Settings
app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(multer({
    storage,
    dest: path.join(__dirname, 'public/uploads'),
    limits: {fieldSize: 1000000},
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const minetype = filetypes.test(file.mimetype); // tipo de archivo
        const extname = filetypes.test(path.extname(file.originalname)); // extensión de archivo
        if (minetype && extname) return cb(null, true);
        cb("Error: Archivo debe ser una imagen valida");
    }
}).single('image'));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/upload', (req, res) => {
    console.log(req.file);
    res.send('upload');
});

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});