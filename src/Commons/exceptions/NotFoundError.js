const ClientErrorAbstract = require('./ClientErrorAbstract')

module.exports = class NotFoundError extends ClientErrorAbstract {
  constructor (message) {
    super(message, 404)
  }
}
