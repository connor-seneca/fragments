const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  logger.info(`inside the getById route owner:${req.user} id:${req.params.id}`);
  const fragment = await Fragment.byId(req.user, req.params.id);
  logger.debug({ fragment });
  res.status(200).json(createSuccessResponse({ fragment }));
  //}
};
