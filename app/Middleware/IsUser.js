'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const InvalidAccess = use('App/Exceptions/InvalidAccessException')
const Config = use('Config')

class IsAdmin {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ auth }, next) {
    await auth.check()

    if (
      auth.user.role === Config.get('baseValueExports.admin_role_id') ||
      auth.user.role === Config.get('baseValueExports.user_role_id')
    ) {
      // request.authUser = auth.user
      await next()
    } else {
      throw new InvalidAccess()
    }
  }
}

module.exports = IsAdmin
