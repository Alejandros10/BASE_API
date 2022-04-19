'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Config = use('Config')

class UserSchema extends Schema {
  up() {
    this.create('users', (table) => {
      table.increments()
      table
        .enu('role', [
          Config.get('elvira.admin_role_id'),
          Config.get('elvira.teacher_role_id'),
          Config.get('elvira.user_role_id'),
        ])
        .notNullable()
      table.string('name').nullable()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('users')
  }
}

module.exports = UserSchema
