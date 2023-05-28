const osc = require('osc')
const getVariableDefinitions = require('./variables')

class OSCServer {
	constructor(module) {
		this.module = module
		this.config = module.config
		this.oscServer = null
		this.oscClient = null
	}

	init() {
		if (this.oscServer) {
			this.module.log('warn', 'OSC already running. Restarting the osc client and server.')
			this.destroy()
		}
		// Set variable definitions
		this.module.setVariableDefinitions(getVariableDefinitions())

		// Initialize OSC server
		this.oscServer = new osc.UDPPort({
			localAddress: '0.0.0.0',
			localPort: this.config.port, // You may want to use a different port for the server
			remoteAddress: this.config.host,
			remotePort: this.config.port,
			metadata: true,
		})

		// Initialize OSC client
		this.oscClient = new osc.UDPPort({
			localAddress: '0.0.0.0',
			localPort: this.config.port,
			remoteAddress: this.config.host,
			remotePort: this.config.port,
			metadata: true,
		})

		// Add listeners for OSC messages and errors
		this.oscServer.on('message', this.onMessage.bind(this))
		this.oscServer.on('error', this.onError.bind(this))
		this.oscClient.on('error', this.onError.bind(this))

		// Add listeners for OSC messages
		this.oscServer.on('message', this.onMessage.bind(this))

		// Open the OSC port
		this.oscServer.open()
		this.oscClient.open()
	}

	onMessage(oscMsg) {
		// Ignore state update messages
		if (oscMsg.address === '/ggo/state/update') {
			return
		}
		this.module.log('debug', `Received message from ${oscMsg.address}: ${JSON.stringify(oscMsg.args)}`)

		// Handle command and state messages
		if (oscMsg.address.startsWith('/ggo/state/')) {
			// Parse message and update variables as needed
		}
	}

	sendCommand(cmd, value) {
		// Send command to Green-GO device
		this.oscClient.send({
			address: '/ggo/cmd/' + cmd,
			args: [{ type: 'i', value: value }],
		})
		this.module.log('debug', `Sent command to ${this.config.host}:${this.config.port}/ggo/cmd/${cmd}: ${value}`)
	}

	requestStateUpdate() {
		// Request state update from Green-GO device
		this.oscClient.send({
			address: '/ggo/state/update',
			args: [{ type: 'i', value: 1 }],
		})
		this.module.log('debug', `Requested state update from ${this.config.host}`)
	}

	async close() {
		// Try to close the OSC port
		await this.oscServer.close()
		await this.oscClient.close()
	}

	onError(error) {
		// Log errors
		this.module.log('error', `OSC error: ${error.message}`)
	}

	destroy() {
		// Force destroy the OSC port
		this.oscServer = null
		this.oscClient = null
	}
}

module.exports = OSCServer
