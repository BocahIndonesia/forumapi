const ClientErrorAbstract = require('./ClientErrorAbstract')

module.exports = class AuthenticationError extends ClientErrorAbstract {
  constructor (message) {
    super(message, 401)
  }
}
