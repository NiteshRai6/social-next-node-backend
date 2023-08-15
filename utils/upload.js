const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        const uploadPath =
            path.join(__dirname, "../public/uploads" + (file.fieldname.includes('post') ? '/posts' : '/users'))

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },
});

const upload = multer({ storage });

module.exports = upload;
