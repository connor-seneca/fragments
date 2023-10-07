const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  logger.info('inside the get all fragments route');
  if (req.query.expand == 1) {
    const fragments = await Fragment.byUser(req.user, true);
    logger.info('inside the expanded get');
    //logger.debug(`fragments returned byUser in get all: ${{ fragments }}`);
    logger.error(Array.isArray(fragments));
    res.status(200).json(createSuccessResponse({ fragments }));
  } else {
    const fragments = await Fragment.byUser(req.user);
    logger.info(`fragments returned byUser in get all: ${{ fragments }}`);
    logger.error(Array.isArray(fragments));
    res.status(200).json(createSuccessResponse({ fragments }));
  }
};
