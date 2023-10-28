const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  logger.info('inside the get all fragments route');
  try {
    if (req.query.expand == 1) {
      const fragments = await Fragment.byUser(req.user, true);
      logger.info('inside the expanded get');
      logger.debug(
        `fragments returned byUser in get all expanded: ${JSON.stringify(fragments, null, 2)}`
      );
      res.status(200).json(createSuccessResponse({ fragments }));
    } else {
      const fragments = await Fragment.byUser(req.user);
      logger.info(`fragments returned byUser in get all: ${{ fragments }}`);
      logger.error('error in get.js expand=false: ', Array.isArray(fragments));
      res.status(200).json(createSuccessResponse({ fragments }));
    }
  } catch (err) {
    res.status(400).json(createErrorResponse(err, 'getting a fragment failed in get.js'));
  }
};
