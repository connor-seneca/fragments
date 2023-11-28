const { createErrorResponse, createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { deleteFragment } = require('../../model/data');

module.exports = async (req, res) => {
  logger.info(`inside the deleteById route owner:${req.user} id:${req.params.id}`);

  try {
    const fragment = await Fragment.byId(req.user, req.params.id);

    if (!fragment) {
      return res.status(404).json(createErrorResponse('Fragment not found'));
    }
    await deleteFragment(fragment.ownerId, fragment.id);

    res.status(200).json(createSuccessResponse());
  } catch (err) {
    res
      .status(404)
      .json(createErrorResponse(err, 'deleting fragment by id failed in deleteById.js'));
  }
};
