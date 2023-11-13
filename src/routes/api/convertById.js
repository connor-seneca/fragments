const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const markdown = require('markdown-it')();

module.exports = async (req, res) => {
  logger.info(`inside the getById route owner:${req.user} id:${req.params.id}`);
  const ext = req.params.ext;

  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    logger.debug('fragment inside convertById:', JSON.stringify(fragment, null, 2));

    if (!fragment) {
      return res.status(404).json(createErrorResponse('Fragment not found'));
    }

    const data = await fragment.getData();
    logger.debug('data inside convertById: ', JSON.stringify(data, null, 2));

    if (fragment.type == 'text/markdown' && ext == 'html') {
      logger.debug('inside the ext statement convertById.js');
      const html = markdown.render(data.toString());
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Length', String(html.length));
      res.status(200).send(html);
      return;
    }
  } catch (err) {
    res.status(400).json(createErrorResponse(err, 'getting fragment by id failed in getById.js'));
  }
};
