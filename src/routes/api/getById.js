const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  logger.info(`inside the getById route owner:${req.user} id:${req.params.id}`);

  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    logger.debug('fragment inside getById:', JSON.stringify(fragment, null, 2));

    if (!fragment) {
      return res.status(404).json(createErrorResponse('Fragment not found'));
    }

    const data = await fragment.getData();
    logger.debug('data inside getById: ', JSON.stringify(data, null, 2));

    //setting response header
    res.setHeader('Content-Type', fragment.type);

    logger.debug('this is the fragment type: ', fragment.type);
    res.status(200).send(data);
  } catch (err) {
    res.status(400).json(createErrorResponse(err, 'getting fragment by id failed in getById.js'));
  }
};
