const ClientErrorAbstract = require('./ClientErrorAbstract')

module.exports = class AuthorizationError extends ClientErrorAbstract {
  constructor (message) {
    super(message, 403)
  }
}
