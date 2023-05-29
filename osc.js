const osc = require('osc')
const EventEmitter = require('events')

// The OSC Manager handles all communication and variable updates
class OscModule extends EventEmitter {
	constructor(module) {
		super()
		this.module = module
		this.oscServer = null
		this.oscClient = null
		this.stateUpdateTimer = null
		this.heartbeatTimer = null
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
		// Check if the message is a heartbeat
		if (oscMsg.address === '/ggo/state/heartbeat') {
			// Reset the heartbeat variable to 1
			this.updateVariableValues({ state_heartbeat: 1 })

			// Clear the existing heartbeat timer if it exists
			if (this.heartbeatTimer) {
				clearTimeout(this.heartbeatTimer)
			}

			// Start a new heartbeat timer
			this.heartbeatTimer = setTimeout(() => this.handleHeartbeat(), 5000)
			return
		}
		// this.module.log('debug', `OSC Manager: Received message for ${oscMsg.address}: ${JSON.stringify(oscMsg.args)}`)
		// Handle command and state messages
		if (oscMsg.address.startsWith('/ggo/state/')) {
			// Reset the timer for checking packet arrival
			if (this.stateUpdateTimer) {
				clearInterval(this.stateUpdateTimer)
				this.stateUpdateTimer = null
			}
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
		const updatedVariables = {}
		let count = 0 // Counter to keep track of the number of variables updated

		// Iterate over the updates
		for (let [variableName, value] of Object.entries(updates)) {
			// Check if variable exists and if its value has changed
			if (this.companionVariables.hasOwnProperty(variableName) && this.companionVariables[variableName] !== value) {
				// Store updates for variables whose values have changed
				updatedVariables[variableName] = value

				// Update local variable's value
				this.companionVariables[variableName] = {
					name: this.companionVariables[variableName].name,
					value: value,
				}

				// Emit an event for the updated variable
				this.emit('variableUpdated', variableName, value)

				// Increment the counter
				count++
			}
		}

		// Apply the updates
		if (Object.keys(updatedVariables).length > 0) {
			this.module.setVariableValues(updatedVariables)
		}

		// Log the number of variables updated
		if (count > 0) {
			this.module.log('debug', `OSC Manager: Updated values of ${count} variables`)
		}
	}

	sendCommand(cmd, values) {
		// Normalize `values` to always be an array
		if (!Array.isArray(values)) {
			values = [values]
		}

		// Prepare the arguments
		const args = values.map((value) => ({ type: 'i', value }))

		// Send command to Green-GO device
		this.oscClient.send({
			address: '/ggo/cmd/' + cmd,
			args: args,
		})
		this.module.log(
			'debug',
			`OSC Manager: Sent command to /ggo/cmd/${cmd} (${this.config.host}:${this.config.port}): ${values.join(', ')}`
		)
	}

	requestStateUpdate() {
		if (this.oscClient) {
			const sendUpdateRequest = () => {
				// Request state update from Green-GO device
				this.sendCommand('update', 1)
				if (this.stateUpdateTimer) {
					this.module.log('debug', `OSC Manager: No updates received, requesting new update from ${this.config.host}`)
				} else {
					this.module.log('debug', `OSC Manager: Requested state update from ${this.config.host}`)
				}
			}

			// Send initial update request
			sendUpdateRequest()

			// Start the timer for requesting updates every 10 seconds
			this.stateUpdateTimer = setInterval(sendUpdateRequest, 30000)
		} else {
			this.module.log('debug', `OSC Manager: OSC client not initialized, cannot request update`)
		}
	}

	handleHeartbeat() {
		// Set the heartbeat variable to 0
		this.updateVariableValues({ state_heartbeat: 0 })

		// Log a warning or error
		this.module.log('warn', `OSC Manager: Heartbeat lost`)
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
