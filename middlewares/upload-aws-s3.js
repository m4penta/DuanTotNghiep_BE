const aws = require('aws-sdk');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const multerS3 = require('multer-s3');
const { awsConfig } = require('../configs/aws-config');

const s3 = new aws.S3(awsConfig);

const uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUTKET_AWS_S3,
    acl: 'public-read',
    metadata: function (req, file, cb, next) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb, next) {
      cb(null, `${uuidv4()}-${file.originalname}`);
    },
  }),
});

module.exports = { uploadS3 };
