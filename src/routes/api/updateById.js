const { createErrorResponse, createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  logger.info(`inside the updateById route owner:${req.user} id:${req.params.id}`);

  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    logger.debug('fragment inside updateById:', JSON.stringify(fragment, null, 2));

    if (!fragment) {
      return res.status(404).json(createErrorResponse('Fragment not found'));
    }
    if (req.headers['content-type'] != fragment.type) {
      return res
        .status(400)
        .json(createErrorResponse('A fragment type can not be changed after it is created.'));
    }

    await fragment.setData(req.body);

    res.status(200).json(createSuccessResponse({ fragment }));
  } catch (err) {
    res.status(404).json(createErrorResponse(err, 'getting fragment by id failed in getById.js'));
  }
};
