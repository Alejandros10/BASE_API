'use strict'

const VirtualMachine = use('App/Models/VirtualMachine')
const rdp = use('node-rdpjs-2')

let connections = {}
const SINGLE_CONNECTION = true // controls if only one concurrent connection to a vm
const CTRL_KEY_CODE = 29
const ALT_KEY_CODE = 56
const SUPR_KEY_CODE = 57427

class RdpController {
  constructor({ socket, request }) {
    this.socket = socket
    this.request = request
  }

  async onConnect({ id, width = 800, height = 600, locale = 'es' }) {
    try {
      if (!connections) connections = {}

      const vm = await VirtualMachine.find(id)

      const { topic } = this.socket

      // FIRST CONNECTION TO THE TOPIC
      if (!connections[topic]) {
        connections[topic] = {
          client: null,
          sockets: [this.socket.id],
        }
      } else {
        // ONLY ONE CONCURRENT CONNECTION
        if (SINGLE_CONNECTION) {
          if (connections[topic].sockets.length) {
            this.emit('rdp-close', {}, connections[topic].sockets)
          }
          connections[topic].sockets = [this.socket.id]
        } else {
          connections[topic].sockets.push(this.socket.id)
          if (connections[topic].client.connected) {
            this.emit('rdp-connect', {}, [this.socket.id])
            return
          }
        }
      }

      connections[topic].client = rdp
        .createClient({
          userName: vm.username,
          password: vm.password,
          enablePerf: true,
          autoLogin: true,
          decompress: false,
          screen: {
            width,
            height,
          },
          locale: locale,
          logLevel: 'INFO',
        })
        .on('connect', () => {
          this.emit('rdp-connect')
        })
        .on('close', () => {
          this.emit('rdp-close')
        })
        .on('error', (err) => {
          this.emit('rdp-error', err)
        })
        .on('bitmap', (bitmap) => {
          this.emit('rdp-bitmap', bitmap)
        })
        .connect(vm.ip, vm.port)

      // console.log('connecting...', this.socket.topic, vm.ip, vm.port)
    } catch (e) {
      console.error('ERROR ', e)
    }
  }

  emit(key, data = {}, to = null) {
    try {
      if (!this.socket) return

      const { topic } = this.socket

      if (!to && !connections[topic]) {
        return
      }

      const emitTo = to ? to : connections[topic].sockets

      if (!emitTo.length) {
        return
      }

      if (key !== 'rdp-bitmap') {
        // console.log('emit', key, key !== 'rdp-bitmap' ? data : {}, emitTo.length ? emitTo.join(', ') : 'no sockets')
      }

      this.socket.emitTo(key, data, emitTo)
    } catch (e) {
      console.error(e)
    }
  }

  onClose() {
    this.disconnect()
  }

  onDisconnect() {
    this.disconnect()
  }

  onError() {
    // this emits a close to the client and then the client emits a close to the server,
    // means that gets to onClose()
    this.socket.close()
  }

  disconnect() {
    const { topic } = this.socket

    const socketIndex = connections[topic].sockets.findIndex((s) => s === this.socket.id)
    if (socketIndex !== -1) {
      connections[topic].sockets.splice(socketIndex, 1)
    }

    if (!connections[topic].sockets.length) {
      this.disconnectClient()
    }
  }

  disconnectClient() {
    const { topic } = this.socket

    if (!connections[topic]) return

    if (connections[topic].client.connected) {
      connections[topic].client.close()
    }

    delete connections[topic]
  }

  onMouse({ x, y, button, isPressed }) {
    if (!this.isClientConnected() || x < 0 || y < 0) return

    connections[this.socket.topic].client.sendPointerEvent(x, y, button, isPressed)
  }

  onWheel({ x, y, step, isNegative, isHorizontal }) {
    if (!this.isClientConnected()) return

    connections[this.socket.topic].client.sendWheelEvent(x, y, step, isNegative, isHorizontal)
  }

  onScancode({ code, isPressed }) {
    if (!this.isClientConnected() || !code) return

    connections[this.socket.topic].client.sendKeyEventScancode(code, isPressed)
  }

  onUnicode({ code, isPressed }) {
    if (!this.isClientConnected()) return

    connections[this.socket.topic].client.sendKeyEventUnicode(code, isPressed)
  }

  onCtrlaltsupr() {
    this.onScancode({ code: CTRL_KEY_CODE, isPressed: true })
    this.onScancode({ code: ALT_KEY_CODE, isPressed: true })
    this.onScancode({ code: SUPR_KEY_CODE, isPressed: true })
  }

  isClientConnected() {
    return (
      this.socket &&
      this.socket.topic &&
      connections[this.socket.topic] &&
      connections[this.socket.topic].client &&
      connections[this.socket.topic].client.connected &&
      connections[this.socket.topic].sockets.length
    )
  }
}

module.exports = RdpController
