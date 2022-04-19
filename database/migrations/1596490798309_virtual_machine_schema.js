'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Config = use('Config')

class VirtualMachineSchema extends Schema {
  up() {
    this.create('virtual_machines', (table) => {
      table.increments()
      table.integer('user_created_id').notNullable().unsigned().references('id').inTable('users')
      table.integer('user_id').nullable().unsigned().references('id').inTable('users')
      table.string('ip', 50).notNullable()
      table.string('port', 10).nullable()
      table.string('username', 50).nullable()
      table.string('password', 100).nullable()
      table
        .enu('type', [
          Config.get('elvira.virtual_machine_type.windows'),
          Config.get('elvira.virtual_machine_type.linux'),
          Config.get('elvira.virtual_machine_type.mac'),
          Config.get('elvira.virtual_machine_type.other'),
        ])
        .defaultTo(Config.get('elvira.virtual_machine_type.other'))
      table.text('details').nullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('virtual_machines')
  }
}

module.exports = VirtualMachineSchema
