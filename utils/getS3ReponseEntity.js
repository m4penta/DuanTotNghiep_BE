const getS3ResponsenEntity = ({ key, location, size, versionId }) => ({
  key,
  location,
  size,
  versionId,
});

module.exports = { getS3ResponsenEntity };
