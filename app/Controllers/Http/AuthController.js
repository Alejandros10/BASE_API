'use strict'

const User = use('App/Models/User')
const GetHeaderLang = use('App/Services/GetHeaderLang')
const Config = use('Config')
// const ResponseService = use('App/Services/ResponseService')

class AuthController {
  async register({ request, auth, response }) {
    const { user: authUser } = auth
    let allow = false
    switch (request.all().role) {
      case Config.get('baseValueExports.admin_role_id'):
        allow = true
      case Config.get('baseValueExports.user_role_id'):
        allow = request.all().role === Config.get('baseValueExports.user_role_id')
        break
    }
    try {
      
      const user = await User.registerData(request.all())
      let accessToken

      if (user) {
        accessToken = await auth.generate(user)
        if (user !== undefined) {
          if (user) {
            await user.tokens().createMany([
              {
                user_id: user.id,
                token: accessToken.token,
                type: accessToken.type,
              },
            ])
          }
        }

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

        if (user !== undefined) {
          if (user) {
            await user.tokens().createMany([
              {
                user_id: user.id,
                token: accessToken.token,
                type: accessToken.type,
              },
            ])
          }
        }

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
