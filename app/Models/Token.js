'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Hash = use('Hash')
const Config = use('Config')

const Database = use('Database')

class Token extends Model {
    
    Users() {
        return this.hasMany('App/Models/User')
    } 
  static get visible() {
    return ['id', 'user_id', 'token','is_revoked']
  }

  static scopeValidToken(query, user) {
    /*         if (user.isAgent()) {
            return query.where('user_id', user.id)
        } */

    return query
  }

  static async registerData({user_id,token,is_revoked,type}) {
    let res = false
    const trx = await Database.beginTransaction()
    const store = {user_id,token,is_revoked,type}
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

module.exports = Token
