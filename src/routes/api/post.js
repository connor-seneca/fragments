const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  logger.info(`Inside the post /fragments route with ${req.user}`);
  if (!Buffer.isBuffer(req.body)) {
    logger.debug(`not valid content type`);
    res.status(415).json(createErrorResponse(415, 'invalid content type'));
  } else {
    const fragment = new Fragment({
      ownerId: req.user,
      type: 'text/plain',
    });
    await fragment.save();
    await fragment.setData(req.body);
    logger.info(
      `fragment successfully created for owner:${fragment.ownerId} - type:${fragment.type} - size:${fragment.size}`
    );
    res.setHeader('Location', `${process.env.API_URL}/v1/fragments/${fragment.id}`);
    res.status(201).json(createSuccessResponse({ fragment }));
  }
};
