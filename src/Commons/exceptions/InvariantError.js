const ClientErrorAbstract = require('./ClientErrorAbstract')

module.exports = class InvariantError extends ClientErrorAbstract {
  constructor (message) {
    super(message, 400)
  }
}
