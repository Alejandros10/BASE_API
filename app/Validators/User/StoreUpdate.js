'use strict'

const GetHeaderLang = use('App/Services/GetHeaderLang')
const Config = use('Config')

class StoreUpdate {
  get rules() {
    const id = this.ctx.params.id
    const updating = !!id

    return {
      name: 'required|max:255',
      email: 'required|email|max:255|unique:users,email' + (updating ? `,id,${id}` : ''),
      password: 'max:100' +'|'+ (updating ? '' : 'required'),
      role: `required|in:${Config.get('baseValueExports.admin_role_id')},${Config.get(
        'baseValueExports.user_role_id'
      )}`,
    }
  }
  get messages() {
    const request = this.ctx.request
    const name = GetHeaderLang.setLanguage(request, 'labels.name')
    const email = GetHeaderLang.setLanguage(request, 'labels.email')
    const password = GetHeaderLang.setLanguage(request, 'labels.password')
    const role = GetHeaderLang.setLanguage(request, 'labels.role')

    const superadmin = GetHeaderLang.setLanguage(request, 'labels.superAdmin')
    const user = GetHeaderLang.setLanguage(request, 'labels.user')

    return {
      'name.required': GetHeaderLang.setLanguageProps(request, 'validations.required', { name }),
      'name.max': GetHeaderLang.setLanguageProps(request, 'validations.max', { name, number: 255 }),
      'email.required': GetHeaderLang.setLanguageProps(request, 'validations.required', {
        name: email,
      }),
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
    }
  }
}

module.exports = StoreUpdate
