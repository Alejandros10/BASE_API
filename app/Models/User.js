'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')
const Config = use('Config')

const Database = use('Database')

class User extends Model {
  static boot() {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  static get visible() {
    return ['id', 'role', 'name', 'email']
  }

  static get hidden() {
    return ['password']
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany('App/Models/Token')
  }

  static scopeValidRoles(query, user) {
    if (user.isTeacher()) {
      return query.whereIn('role', [Config.get('elvira.teacher_role_id'), Config.get('elvira.user_role_id')])
    } else if (user.isStudent()) {
      return query.where('id', user.id)
    }

    return query
  }

  static async registerData({ name, email, password, role }) {
    let res = false
    const trx = await Database.beginTransaction()
    const store = {
      name,
      email,
      password,
      role,
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

  isAdmin() {
    return this.role === Config.get('elvira.admin_role_id')
  }

  isTeacher() {
    return this.role === Config.get('elvira.teacher_role_id')
  }

  isStudent() {
    return this.role === Config.get('elvira.user_role_id')
  }
}

module.exports = User
