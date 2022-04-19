'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Database = use('Database')

class VirtualMachine extends Model {
  static get visible() {
    return ['id', 'user_created_id', 'user_id', 'ip', 'port', 'username', 'password', 'type', 'details']
  }

  userCreated() {
    return this.belongsTo('App/Models/User')
  }

  user() {
    return this.belongsTo('App/Models/User')
  }

  static scopeValidMachines(query, user) {
    if (user.isTeacher()) {
      return query.where('user_created_id', user.id)
    } else if (user.isStudent()) {
      return query.where('user_id', user.id)
    }

    return query
  }

  static async registerData({ user_created_id, user_id, ip, port, username, password, type, details }) {
    let res = false
    const trx = await Database.beginTransaction()
    const store = {
      user_created_id,
      user_id,
      ip,
      port,
      username,
      password,
      type,
      details,
    }

    try {
      const result = await this.create(store, trx)
      await trx.commit()

      res = result
    } catch (e) {
      await trx.rollback()
    }

    return res
  }
}

module.exports = VirtualMachine
