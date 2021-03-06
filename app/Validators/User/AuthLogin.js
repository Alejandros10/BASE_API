'use strict'

const GetHeaderLang = use('App/Services/GetHeaderLang')
const Config = use('Config')
class AuthLogin {
  get rules() {
    return {
      email: 'required',
      password: 'required',
    }
  }

  get messages() {
    const request = this.ctx.request
    const email = GetHeaderLang.setLanguage(request, 'labels.email')
    const password = GetHeaderLang.setLanguage(request, 'labels.password')
    return {
      'email.required': GetHeaderLang.setLanguageProps(request, 'validations.required', {
        name: email,
      }),
      'password.required': GetHeaderLang.setLanguageProps(request, 'validations.required', {
        name: password,
      }),
    }
  }
}

module.exports = AuthLogin
