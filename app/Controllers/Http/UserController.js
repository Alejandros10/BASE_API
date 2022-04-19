'use strict'

const User = use('App/Models/User')
const Config = use('Config')
const GetHeaderLang = use('App/Services/GetHeaderLang')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with users
 */
class UserController {
  /**
   * Show a list of all users.
   * GET users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, auth }) {
    const { user } = auth

    const query = User.query().validRoles(user)

    Object.keys(request.all()).map((k) => {
      query.where(k, request.input(k))
    })

    return response.json(await query.fetch())
  }

  /**
   * Create/save a new user.
   * POST users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth }) {
    let allow = false
    const role = request.input('role')

    switch (auth.user.role) {
      case Config.get('baseValueExports.admin_role_id'):
        allow = true
        break
      case Config.get('baseValueExports.user_role_id'):
        allow = role === Config.get('baseValueExports.user_role_id')
        break
    }

    if (allow) {
      try {
        const user = await User.registerData(request.all())
        if (user) {
          return response.status(200).json(user)
        }
      } catch (e) {
        console.error(e)
      }
    }

    return response.status(400).json({ message: GetHeaderLang.setLanguage(request, 'messages.noStored') })
  }

  /**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ request, params, response, auth }) {
    const { user: authUser } = auth

    const user = await User.query().validRoles(authUser).where('id', params.id).first()

    if (user) {
      return response.json(user)
    }

    return response.status(400).json({
      message: GetHeaderLang.setLanguageProps(request, 'validations.exists', {
        name: GetHeaderLang.setLanguage(request, 'labels.user'),
      }),
    })
  }

  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response, auth }) {
    const { user: authUser } = auth

    try {
      const user = await User.query().validRoles(authUser).where('id', params.id).first()

      if (user) {
        user.name = request.input('name')
        user.email = request.input('email')
        user.code = request.input('code')
        user.is_revoked  = request.input('is_revoked')
        if (request.input('password')) {
          user.password = request.input('password')
        }

        await user.save()

        return response.json(user)
      }

      return response.status(400).json({
        message: GetHeaderLang.setLanguageProps(request, 'validations.exists', {
          name: GetHeaderLang.setLanguage(request, 'labels.user'),
        }),
      })
    } catch (e) {
      console.error(e)
    }

    return response.status(400).json({ message: GetHeaderLang.setLanguage(request, 'messages.noStored') })
  }

  /**
   * Delete a user with id.
   * DELETE users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response, auth }) {
    const { user: authUser } = auth

    try {
      const user = await User.query().validRoles(authUser).where('id', params.id).first()
      if (user) {
        await user.delete()

        return response.json({
          message: GetHeaderLang.setLanguage(request, 'messages.deleted'),
        })
      }
    } catch (e) {
      console.error(e)
    }

    return response.status(400).json({ message: GetHeaderLang.setLanguage(request, 'messages.noDeleted') })
  }

  async massDestroy({ request, response, auth }) {
    const { user: authUser } = auth

    try {
      const deleted = await User.query().validRoles(authUser).whereIn('id', request.input('ids')).delete()

      if (deleted) {
        return response.json({
          message: GetHeaderLang.setLanguage(request, 'messages.deleted'),
        })
      }
    } catch (e) {
      console.error(e)
    }

    return response.status(400).json({ message: GetHeaderLang.setLanguage(request, 'messages.noDeleted') })
  }
}

module.exports = UserController
