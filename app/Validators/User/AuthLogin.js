'use strict'

const GetHeaderLang = use('App/Services/GetHeaderLang')
const Config = use('Config')
class AuthLogin {
  get rules() {
    return {
      email: 'required|email|unique:users,email',
      password: 'required',
      role : 'required'
    }
  }

  get messages() {
    const request = this.ctx.request
    
    const name = GetHeaderLang.setLanguage(request, 'labels.name')
    const email = GetHeaderLang.setLanguage(request, 'labels.email')
    const password = GetHeaderLang.setLanguage(request, 'labels.password')
    const role = GetHeaderLang.setLanguage(request, 'labels.role')
    const code = GetHeaderLang.setLanguage(request, 'labels.code')
    const superadmin = GetHeaderLang.setLanguage(request, 'labels.superAdmin')
    const user = GetHeaderLang.setLanguage(request, 'labels.user')

    return {
      'name.max': GetHeaderLang.setLanguageProps(request, 'validations.max', { name, number: 255 }),
      'email.required': GetHeaderLang.setLanguageProps(request, 'validations.required', {
        name: email,
      }),
      'email.unique': 'This email is already registered.',
      'email.email': GetHeaderLang.setLanguageProps(request, 'validations.email', { name: email }),
      'email.max': GetHeaderLang.setLanguageProps(request, 'validations.max', {
        name: email,
        number: 255,
      }),
      'email.unique': GetHeaderLang.setLanguageProps(request, 'validations.unique', {
        name: email,
      }),
      'password.required': GetHeaderLang.setLanguageProps(request, 'validations.required', {
        name: password,
      }),
      'password.max': GetHeaderLang.setLanguageProps(request, 'validations.max', {
        name: password,
        number: 100,
      }),
      'role.required': GetHeaderLang.setLanguageProps(request, 'validations.required', {
        name: role,
      }),
      'role.in': GetHeaderLang.setLanguageProps(request, 'validations.in', {
        name: role,
        in: `${superadmin} - ${user}`,
      }),
      'code.unique': 'This email is already registered.',
    }
  }
}

module.exports = AuthLogin
