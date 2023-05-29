const osc = require('osc')
const EventEmitter = require('events')

// The OSC Manager handles all communication and variable updates
class OscModule extends EventEmitter {
	constructor(module) {
		super()
		this.module = module
		this.oscServer = null
		this.oscClient = null
		this.updatesCollector = new VariableUpdatesCollector(this.updateVariableValues.bind(this))
	}

	init(config, companionVariables) {
		this.companionVariables = companionVariables
		if (!this.companionVariables) {
			this.module.log('warn', `OSC Manager: No variables defined`)
		}
		this.config = config
		// Ensure config is initialized
		if (!this.config) {
			this.module.log('error', `OSC Manager: Config not initialized`)
			return
		}
		if (this.oscServer || this.oscClient) {
			this.module.log('debug', 'OSC Manager: Running instance found, restarting the OSC listeners')
			this.closeOSCListeners()
		}

		// Initialize OSC server
		this.oscServer = new osc.UDPPort({
			localAddress: '0.0.0.0',
			localPort: this.config.port,
			metadata: true,
		})

		// Initialize OSC client
		this.oscClient = new osc.UDPPort({
			localAddress: '0.0.0.0',
			remoteAddress: this.config.host,
			remotePort: this.config.port,
			metadata: true,
		})

		// Add listeners for OSC messages and errors
		this.oscServer.on('message', (oscMsg) => this.onMessage(oscMsg))
		this.oscServer.on('error', (error) => this.onError(error))
		this.oscClient.on('error', (error) => this.onError(error))

		// Open the OSC port
		this.oscServer.open()
		this.oscClient.open()
	}

	// Helper function to close existing connections
	closeOSCListeners() {
		if (this.oscServer) {
			this.oscServer.close()
			this.oscServer = null
			this.module.log('debug', 'OSC Manager: Closed OSC server')
		}
		if (this.oscClient) {
			this.oscClient.close()
			this.oscClient = null
			this.module.log('debug', 'OSC Manager: Closed OSC client')
		}
	}

	onMessage(oscMsg) {
		// Ignore state update messages
		if (oscMsg.address === '/ggo/state/update') {
			return
		}
		// this.module.log('debug', `OSC Manager: Received message for ${oscMsg.address}: ${JSON.stringify(oscMsg.args)}`)
		// Handle command and state messages
		if (oscMsg.address.startsWith('/ggo/state/')) {
			let variableName = this.parsePathToVariable(oscMsg)
			if (variableName in this.companionVariables) {
				let isFlooding = oscMsg.address.includes('level') || oscMsg.address.includes('gain')
				this.updatesCollector.collect(variableName, oscMsg.args[0].value, isFlooding)
			} else {
				this.module.log(
					'warn',
					`OSC Manager: Received message using unsupported path (${oscMsg.address}). Generated variable "${variableName}" not found`
				)
			}
		}
	}

	parsePathToVariable(oscMsg) {
		// Split the path into segments
		let segments = oscMsg.address.split('/')
		// Ignore the first segment if it's empty (paths starting with '/')
		if (segments[0] === '') {
			segments = segments.slice(2)
		}
		// Remove the "channel" string from the segments array
		segments = segments.filter((segment) => segment !== 'channel')
		// Convert the segments into a variable name
		let variableName = segments.join('_')
		if (oscMsg.address.includes('/channel/')) {
			// Append "_ch+ID" to the variable name
			variableName += '_ch' + oscMsg.args[1].value
		}
		// this.module.log('debug', `OSC Manager: Returning variable ${variableName} extracted from ${oscMsg.address}`)
		return variableName
	}

	updateVariableValues(updates) {
		// Apply updates in bulk
		this.module.setVariableValues(updates)
		// Update local variables' values
		for (let [variableName, value] of Object.entries(updates)) {
			// Restore the structure of companionVariables
			this.companionVariables[variableName] = {
				name: this.companionVariables[variableName].name,
				value: value,
			}

			this.emit('variableUpdated', variableName, value)
		}
		this.module.log('debug', `OSC Manager: Received updates for ${Object.keys(updates).length} variables`)
	}

	sendCommand(cmd, value) {
		// Send command to Green-GO device
		this.oscClient.send({
			address: '/ggo/cmd/' + cmd,
			args: [{ type: 'i', value: value }],
		})
		this.module.log(
			'debug',
			`OSC Manager: Sent command to ${this.config.host}:${this.config.port}/ggo/cmd/${cmd}: ${value}`
		)
	}

	requestStateUpdate() {
		if (this.oscClient) {
			// Request state update from Green-GO device
			this.oscClient.send({
				address: '/ggo/state/update',
				args: [{ type: 'i', value: 1 }],
			})
			this.module.log('debug', `OSC Manager: Requested state update from ${this.config.host}`)
		} else {
			this.module.log('debug', `OSC Manager: OSC client not initialized, cannot request update`)
		}
	}

	async close() {
		this.closeOSCListeners()
	}

	onError(error) {
		// Log errors
		this.module.log('error', `OSC Manager: ${error.message}`)
	}

	destroy() {
		this.closeOSCListeners()
	}
}

// Class to handle variable updates and manage timers
class VariableUpdatesCollector {
	constructor(updateVariableValueCallback) {
		this.updateVariableValueCallback = updateVariableValueCallback
		this.updateQueue = new Map()
		this.levelQueue = new Map()
		this.timer = null
		this.levelTimer = null
	}

	collect(variableName, value, isFlooding = false) {
		if (isFlooding) {
			this.levelQueue.set(variableName, value)
			if (!this.levelTimer) {
				this.levelTimer = setTimeout(this.flushFloodingUpdates.bind(this), 350)
			}
		} else {
			this.updateQueue.set(variableName, value)
			if (this.timer) clearTimeout(this.timer)
			this.timer = setTimeout(this.flushUpdates.bind(this), 3)
		}
	}

	flushUpdates() {
		this.flushQueue(this.updateQueue)
		this.timer = null
	}

	flushFloodingUpdates() {
		this.flushQueue(this.levelQueue)
		this.levelTimer = null
	}

	flushQueue(queue) {
		let updates = {}
		for (let [variableName, value] of queue.entries()) {
			updates[variableName] = value
		}
		this.updateVariableValueCallback(updates)
		queue.clear()
	}
}

module.exports = OscModule
