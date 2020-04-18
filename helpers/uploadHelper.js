const multer = require('multer')

const storage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null,'./uploads')
    },
    filename : (req,file,cb) => {
        cb(null, Date.now() + file.originalname)
    },

})

const fileFilter = (req,file,cb) => {
    if (file.mimetype === 'image/jpeg' ||file.mimetype === 'image/jpg' ||file.mimetype === 'image/gif' || file.mimetype === 'image/png') {
        cb(null,true)
    }else {
        const err = new Error('File extension doesnt match')
        err.status = 400 
        cb(err, false)
    }
}

const upload = multer({
    storage,
    limits : {
        fileSize : 1024 * 1024 * 5
    },
    fileFilter
})
module.exports = {
    upload
}