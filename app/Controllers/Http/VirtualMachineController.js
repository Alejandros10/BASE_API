'use strict'

const VirtualMachine = use('App/Models/VirtualMachine')
const Config = use('Config')
const GetHeaderLang = use('App/Services/GetHeaderLang')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with virtualmachines
 */
class VirtualMachineController {
  /**
   * Show a list of all virtualmachines.
   * GET virtualmachines
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, auth }) {
    const { user } = auth

    const query = VirtualMachine.query().validMachines(user).with('user')

    Object.keys(request.all()).map((k) => {
      query.where(k, request.input(k))
    })

    const data = await query.fetch()
    return response.json(data)
  }

  /**
   * Create/save a new virtualmachine.
   * POST virtualmachines
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth }) {
    const rolesAllowed = [Config.get('elvira.admin_role_id'), Config.get('elvira.teacher_role_id')]

    if (rolesAllowed.includes(auth.user.role)) {
      try {
        const machine = await VirtualMachine.registerData({ ...request.all(), user_created_id: auth.user.id })
        if (machine) {
          return response.status(200).json(machine)
        }
      } catch (e) {
        console.error(e)
      }
    }

    return response.status(400).json({ message: GetHeaderLang.setLanguage(request, 'messages.noStored') })
  }

  /**
   * Display a single virtualmachine.
   * GET virtualmachines/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, auth }) {
    const { user } = auth

    const machine = await VirtualMachine.query().validMachines(user).where('id', params.id).first()

    if (machine) {
      return response.json(machine)
    }

    return response.status(400).json({
      message: GetHeaderLang.setLanguageProps(request, 'validations.exists', {
        name: GetHeaderLang.setLanguage(request, 'labels.virtualMachine'),
      }),
    })
  }

  /**
   * Update virtualmachine details.
   * PUT or PATCH virtualmachines/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response, auth }) {
    const { user } = auth

    try {
      const machine = await VirtualMachine.query().validMachines(user).where('id', params.id).first()

      if (machine) {
        machine.merge(request.all())

        await machine.save()

        return response.json(machine)
      }

      return response.status(400).json({
        message: GetHeaderLang.setLanguageProps(request, 'validations.exists', {
          name: GetHeaderLang.setLanguage(request, 'labels.virtualMachine'),
        }),
      })
    } catch (e) {
      console.error(e)
    }

    return response.status(400).json({ message: GetHeaderLang.setLanguage(request, 'messages.noStored') })
  }

  /**
   * Delete a virtualmachine with id.
   * DELETE virtualmachines/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response, auth }) {
    const { user } = auth

    try {
      const machine = await VirtualMachine.query().validMachines(user).where('id', params.id).first()
      if (machine) {
        await machine.delete()

        return response.json({
          message: GetHeaderLang.setLanguage(request, 'messages.deleted'),
        })
      }
    } catch (e) {
      console.error(e)
    }

    return response.status(400).json({ message: GetHeaderLang.setLanguage(request, 'messages.noDeleted') })
  }

  async massDestroy({ request, response, auth }) {
    const { user } = auth

    try {
      const deleted = await VirtualMachine.query().validMachines(user).whereIn('id', request.input('ids')).delete()

      if (deleted) {
        return response.json({
          message: GetHeaderLang.setLanguage(request, 'messages.deleted'),
        })
      }
    } catch (e) {
      console.error(e)
    }

    return response.status(400).json({ message: GetHeaderLang.setLanguage(request, 'messages.noDeleted') })
  }
}

module.exports = VirtualMachineController
