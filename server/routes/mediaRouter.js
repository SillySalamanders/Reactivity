var mediaRouter = require('express').Router();
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
var localvars = require('../lib/localvars.js');
var env = process.env.NODE_ENV || 'development';
var dbMethods = require('../../db/dbMethods.js');

const s3 = new aws.S3({
  accessKeyId: localvars.AWS_ACCESS_KEY_ID,
  secretAccessKey: localvars.AWS_SECRET_ACCESS_KEY,
  region: 'us-west-1',
});

// Initialize multers3 with our s3 config and other options
const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'reactivitymedia',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    storageClass: 'REDUCED_REDUNDANCY',
    metadata(req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key(req, file, cb) {
      cb(null, env + '/profile/' + req.user.id + '/profilePic' + '.png');
    }
  })
});

mediaRouter.post('/upload', upload.single('photo'), (req, res, next) => {
  dbMethods.changeProfilePicUrl(req.user.id, req.file.location)
    .then(function() {
      res.json(req.file.location);
    })
    .catch(function(err) {
      console.error('Error: ', err);
      res.status(500).send('Server error');
    });
});

module.exports = mediaRouter;