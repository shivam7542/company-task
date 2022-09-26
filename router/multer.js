const multer = require('multer');


const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const fileUpload = multer({
    limits: {
        fileSize: 1048576,
    },

    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public/images');
        },
        filename: (req, file, cb) => {

            console.log('in file name')

            const ext = MIME_TYPE_MAP[file.mimetype];
            cb(null, file.originalname + Date.now() + '.' + ext);
        }
    }),
    fileFilter: (req, file, cb) => {

        console.log("hello")
        const fileSizeN = parseInt(req.headers['content-length']);
        // console.log({ file, fileSizeN });
        console.log(file.fieldname);
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        if (file.fieldname != "image") {
            req.isFieldNameValidator = "invalid field name"
            return cb(null, false, req.isFieldNameValidator);
        } else
            if (fileSizeN > 1048576) {
                req.isFileSizeValidator = "invalid file size";
                return cb(null, false, req.isFileSizeValidator);

            } else if (!isValid) {
                console.log('COMMING HERE ')
                req.fileValidationError = 'invalid file type'
                return cb(null, false, req.fileValidationError);
            } else {
                cb(null, true);
            }
    }
});

module.exports = fileUpload;