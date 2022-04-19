'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')
const GetHeaderLang = use('App/Services/GetHeaderLang')

class InvalidAccessException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  handle(error, { request, response }) {
    return response.status(401).json({
      message: GetHeaderLang.setLanguage(request, 'messages.error401'),
    })
  }
}

module.exports = InvalidAccessException
