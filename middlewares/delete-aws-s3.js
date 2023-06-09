const aws = require('aws-sdk');
const { awsConfig } = require('../configs/aws-config');

const s3 = new aws.S3(awsConfig);

const deleteS3 = async (keys) => {
  if (Array.isArray(keys) === false || keys.length <= 0)
    throw new Error('Please provide a keys list!');

  const deleteParams = {
    Bucket: process.env.BUTKET_AWS_S3,
    Delete: {
      Objects: keys,
    },
  };
  console.log(
    '🚀 ~ file: delete-aws-s3.js ~ line 17 ~ deleteS3 ~ deleteParams',
    deleteParams
  );

  try {
    await s3.deleteObjects(deleteParams).promise();
    return 'file deleted Successfully';
  } catch (error) {
    return Promise.reject(
      new Error(`ERROR in file Deleting: ${error.message}`)
    );
  }
};

module.exports = { deleteS3 };
