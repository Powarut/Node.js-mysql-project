const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './images')
    },
    filename: function (req, file, cb) {
      console.log(req)
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + 
      uniqueSuffix + file.originalname)
      console.log(uniqueSuffix)
    }
  })
  
const upload = multer({ limits: {
    fileSize: 16 * 1024 * 1024
  },storage : storage })
module.exports = {upload}