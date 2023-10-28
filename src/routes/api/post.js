const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  logger.info(`Inside the post /fragments route with ${req.user}`);

  if (!Buffer.isBuffer(req.body)) {
    logger.debug(`not valid content type`);
    res.status(415).json(createErrorResponse(415, 'invalid content type'));
    return;
  }

  const fragment = new Fragment({
    ownerId: req.user,
    type: 'text/plain',
  });

  try {
    await fragment.save();
    await fragment.setData(req.body);
  } catch (err) {
    res.status(400).json(createErrorResponse(err, 'saving/setting data in post.js failed'));
  }

  logger.info(
    `fragment successfully created for owner:${fragment.ownerId} - type:${fragment.type} - size:${fragment.size}`
  );
  res.setHeader(
    'Location',
    `http://${process.env.API_URL || req.headers.host}/v1/fragments/${fragment.id}`
  );

  res.status(201).json(createSuccessResponse({ fragment }));
};
