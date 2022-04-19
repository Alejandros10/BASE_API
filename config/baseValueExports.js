'use strict'

module.exports = {
  admin_role_id: 'S',
  user_role_id: 'U',
  basic: {
    serializer: 'lucid',
    model: 'App/Models/User',
    scheme: 'basic',
    uid: 'email',
    password: 'password'
  }
}
