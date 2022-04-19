'use strict'

const GetHeaderLang = use('App/Services/GetHeaderLang')
const Config = use('Config')

class StoreUpdate {
  get rules() {
    const id = this.ctx.params.id
    const updating = !!id

    return {
      // user_created_id: 'required|exists:users,id',
      user_id: 'exists:users,id',
      ip: 'required|max:50',
      port: 'number|max:10',
      username: 'max:50',
      password: 'max:100',
      type: `in:${Config.get('elvira.virtual_machine_type.windows')},${Config.get(
        'elvira.virtual_machine_type.linux'
      )},${Config.get('elvira.virtual_machine_type.mac')},${Config.get('elvira.virtual_machine_type.other')}`,
    }
  }
  get messages() {
    const request = this.ctx.request
    const user = GetHeaderLang.setLanguage(request, 'labels.user')
    const ip = GetHeaderLang.setLanguage(request, 'labels.ip')
    const port = GetHeaderLang.setLanguage(request, 'labels.port')
    const username = GetHeaderLang.setLanguage(request, 'labels.username')
    const password = GetHeaderLang.setLanguage(request, 'labels.password')
    const type = GetHeaderLang.setLanguage(request, 'labels.type')

    return {
      'user_id.required': GetHeaderLang.setLanguageProps(request, 'validations.required', {
        name: user,
      }),
      'user_id.exists': GetHeaderLang.setLanguageProps(request, 'validations.exists', {
        name: user,
      }),
      'ip.required': GetHeaderLang.setLanguageProps(request, 'validations.required', {
        name: ip,
      }),
      'ip.max': GetHeaderLang.setLanguageProps(request, 'validations.max', {
        name: ip,
        number: 50,
      }),
      'port.number': GetHeaderLang.setLanguageProps(request, 'validations.number', {
        name: port,
      }),
      'port.max': GetHeaderLang.setLanguageProps(request, 'validations.max', {
        name: port,
        number: 10,
      }),
      'username.max': GetHeaderLang.setLanguageProps(request, 'validations.max', {
        name: username,
        number: 50,
      }),
      'password.max': GetHeaderLang.setLanguageProps(request, 'validations.max', {
        name: password,
        number: 100,
      }),
      'type.in': GetHeaderLang.setLanguageProps(request, 'validations.in', {
        name: type,
        in: `${Config.get('elvira.virtual_machine_type.windows')} - ${Config.get(
          'elvira.virtual_machine_type.linux'
        )} - ${Config.get('elvira.virtual_machine_type.mac')} - ${Config.get('elvira.virtual_machine_type.other')}`,
      }),
    }
  }
}

module.exports = StoreUpdate
