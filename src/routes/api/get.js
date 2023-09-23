const createSuccessResponse = require('../../response');
/**
 * Get a list of fragments for the current user
 */
module.exports = (req, res) => {
  // TODO: this is just a placeholder to get something working...
  createSuccessResponse(
    res.status(200).json({
      status: 'ok',
      fragments: [],
    })
  );
};
