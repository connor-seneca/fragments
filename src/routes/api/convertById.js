const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const markdown = require('markdown-it')();
const sharp = require('sharp');

module.exports = async (req, res) => {
  logger.info(`inside the getById route owner:${req.user} id:${req.params.id}`);
  const ext = req.params.ext;

  try {
    const fragment = await Fragment.byId(req.user, req.params.id);

    if (!fragment) {
      return res.status(404).json(createErrorResponse('Fragment not found'));
    }

    const data = await fragment.getData();

    if (fragment.extension == ext) {
      res.status(200).send(data);
      return;
    }

    if (fragment.type.includes('text/markdown')) {
      if (ext == 'html') {
        const html = markdown.render(data.toString());

        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Content-Length', String(html.length));
        res.status(200).send(html);

        return;
      } else if (ext === 'txt') {
        const plainText = markdown.render(data.toString()).replace(/<[^>]*>/g, '');

        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Length', String(plainText.length));
        res.status(200).send(plainText);

        return;
      }
    }

    if (fragment.type.includes('text/html')) {
      if (ext == 'txt') {
        const plainText = data.toString().replace(/<[^>]*>/g, '');

        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Length', String(plainText.length));
        res.status(200).send(plainText);

        return;
      }
    }

    if (fragment.type.includes('application/json')) {
      if (ext == 'txt') {
        const plainText = JSON.stringify(data);

        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Length', String(plainText.length));
        res.status(200).send(plainText);

        return;
      }
    }

    if (fragment.type.includes('image')) {
      if (ext == 'jpg') {
        sharp(data)
          .toFormat('jpeg')
          .toBuffer()
          .then((jpegData) => {
            logger.info('Conversion to JPG successful');
            res.setHeader('Content-Type', 'image/jpg');
            res.setHeader('Content-Length', jpegData.length);
            res.status(200).send(jpegData);
            return;
          })
          .catch((err) => {
            res.status(400).json(createErrorResponse(err, 'conversion to jpg failed'));
          });
      } else if (ext == 'webp') {
        sharp(data)
          .toFormat('webp')
          .toBuffer()
          .then((webpData) => {
            logger.info('Conversion to Webp successful');
            res.setHeader('Content-Type', 'image/webp');
            res.setHeader('Content-Length', webpData.length);
            res.status(200).send(webpData);
            return;
          })
          .catch((err) => {
            res.status(400).json(createErrorResponse(err, 'conversion to webp failed'));
          });
      } else if (ext == 'gif') {
        sharp(data)
          .toFormat('gif')
          .toBuffer()
          .then((gifData) => {
            logger.info('Conversion to GIF successful');
            res.setHeader('Content-Type', 'image/gif');
            res.setHeader('Content-Length', gifData.length);
            res.status(200).send(gifData);
            return;
          })
          .catch((err) => {
            res.status(400).json(createErrorResponse(err, 'conversion to GIF failed'));
          });
      } else if (ext == 'png') {
        sharp(data)
          .toFormat('png')
          .toBuffer()
          .then((pngData) => {
            logger.info('Conversion to PNG successful');
            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Content-Length', pngData.length);
            res.status(200).send(pngData);
            return;
          })
          .catch((err) => {
            res.status(400).json(createErrorResponse(err, 'conversion to PNG failed'));
          });
      }
    }
  } catch (err) {
    res.status(400).json(createErrorResponse(err, 'converting fragment failed in convertById'));
  }
};
