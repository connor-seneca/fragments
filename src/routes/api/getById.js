const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  logger.info(`inside the getById route owner:${req.user} id:${req.params.id}`);
  const fragment = await Fragment.byId(req.user, req.params.id);
  if (!fragment) {
    logger.info('inside bad fragment');
    res.status(404).json(createErrorResponse(404, 'invalid content type'));
  } else {
    logger.info('inside good fragment');
    res.status(200).json(createSuccessResponse({ fragment }));
  }
};
