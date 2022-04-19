'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Config = use('Config')
class UsersSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table
        .enu('role', [
          Config.get('baseValueExports.admin_role_id'),
          Config.get('baseValueExports.user_role_id'),
        ])
        .notNullable()
      table.string('name').nullable()
      table.string('code').nullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.boolean('is_revoked').defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UsersSchema
