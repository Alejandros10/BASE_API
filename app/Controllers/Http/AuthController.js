'use strict'

const User = use('App/Models/User')
const GetHeaderLang = use('App/Services/GetHeaderLang')
const Config = use('Config')
// const ResponseService = use('App/Services/ResponseService')

class AuthController {
  async register({ request, auth, response }) {
    const { user: authUser } = auth

    let allow = false
    switch (authUser.role) {
      case Config.get('elvira.admin_role_id'):
        allow = true
        break
      case Config.get('elvira.teacher_role_id'):
        allow = role === Config.get('elvira.teacher_role_id') || Config.get('elvira.user_role_id')
        break
      case Config.get('elvira.user_role_id'):
        allow = role === Config.get('elvira.user_role_id')
        break
    }

    try {
      const user = await User.registerData(request.all())

      let accessToken

      if (user) {
        accessToken = await auth.generate(user)

        return response.status(200).json({ user, access_token: accessToken })
      }
    } catch (e) {
      console.error(e)
    }

    return response.status(400).json({ message: GetHeaderLang.setLanguage(request, 'messages.noStored') })
  }

  async login({ request, auth, response }) {
    const email = request.input('email')
    const password = request.input('password')
    try {
      if (await auth.attempt(email, password)) {
        const user = await User.findBy('email', email)
        const accessToken = await auth.generate(user)
        return response.json({ user, access_token: accessToken })
      }
    } catch (e) {
      return response.status(400).json({
        message: GetHeaderLang.setLanguage(request, 'validations.invalidCredentials'),
      })
    }
  }
}

module.exports = AuthController
