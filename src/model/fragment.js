// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');
const logger = require('../logger');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  constructor({
    id = randomUUID(),
    ownerId,
    created = new Date().toISOString(),
    updated = new Date().toISOString(),
    type,
    size = 0,
  }) {
    if (ownerId == null || type == null) {
      throw new Error('ownerId and type are required');
    } else if (size < 0 || typeof size != 'number') {
      throw new Error('size must be equal to or greater than 0');
    } else if (!Fragment.isSupportedType(type)) {
      throw new Error('unsupported fragment type');
    }
    this.id = id;
    this.ownerId = ownerId;
    this.created = created;
    this.updated = updated;
    this.size = size;
    const parsedType = contentType.parse(type);
    parsedType.parameters.charset
      ? (this.type = String(parsedType.type + '; charset=' + parsedType.parameters.charset))
      : (this.type = parsedType.type);
    logger.debug(`inside the fragments constructor with ${ownerId} + ${type}`);
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns {Promise<Array<Fragment>>}
   */
  static async byUser(ownerId, expand = false) {
    const fragments = await listFragments(ownerId, expand);
    return Promise.resolve(fragments);
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns {Promise<Fragment>}
   */
  static async byId(ownerId, id) {
    const fragment = await readFragment(ownerId, id);
    logger.error(`inside byId class method. ${fragment}`);
    if (fragment) {
      return Promise.resolve(fragment);
    } else {
      return Promise.reject(new Error('fragment does not exist'));
    }
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns {Promise<void>}
   */
  static delete(ownerId, id) {
    deleteFragment(ownerId, id);
    return Promise.resolve();
  }

  /**
   * Saves the current fragment to the database
   * @returns {Promise<void>}
   */
  save() {
    writeFragment(this);
    this.updated = new Date().toISOString();
    return Promise.resolve();
  }

  /**
   * Gets the fragment's data from the database
   * @returns {Promise<Buffer>}
   */
  getData() {
    this.data = readFragmentData(this.ownerId, this.id);
    return Promise.resolve(this.data);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns {Promise<void>}
   */
  async setData(data) {
    if (!Buffer.isBuffer(data)) {
      return Promise.reject(new Error('data is not a buffer'));
    }
    await writeFragmentData(this.ownerId, this.id, data);
    this.updated = new Date().toISOString();
    this.size = data.length;
    logger.debug(`size updated to ${this.size}`);
    return Promise.resolve();
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    return this.type.startsWith('text/');
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    return ['text/plain'];
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    if (value.startsWith('text/plain')) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports.Fragment = Fragment;
