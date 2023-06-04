const { InstanceStatus } = require('@companion-module/base')
const osc = require('osc')
const EventEmitter = require('events')

// The OSC Manager handles all communication and variable updates
class OscModule extends EventEmitter {
	constructor(module) {
		super()
		this.module = module
		this.oscPort = null
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
		if (this.oscPort) {
			this.module.log('debug', 'OSC Manager: Running instance found, restarting the OSC listeners')
			this.closeOSCListeners()
		}
		// Initialize OSC listener
		this.oscPort = new osc.UDPPort({
			localAddress: '0.0.0.0',
			localPort: this.config.port,
			remoteAddress: this.config.host,
			remotePort: this.config.port,
			metadata: true,
		})
		// Add listeners for OSC messages and errors
		this.oscPort.on('message', (oscMsg) => this.onMessage(oscMsg))
		this.oscPort.on('error', (error) => this.onError(error))
		// Open the OSC port
		this.oscPort.open()
		this.module.updateStatus(InstanceStatus.Ok)
	}

	// Handle all incoming OSC messages
	onMessage(oscMsg) {
		// Check if the message is a heartbeat
		if (oscMsg.address === '/ggo/state/heartbeat') {
			// If stateUpdateTimer is running, we should initialize another state update request
			if (this.stateUpdateTimer) {
				this.requestStateUpdate()
			}
			// Clear the existing heartbeat timer if it exists
			if (this.heartbeatTimer) {
				clearTimeout(this.heartbeatTimer)
			}
			// Start a new heartbeat timer and exit function
			this.heartbeatTimer = setTimeout(() => this.handleHeartbeat(), 5000)
		}
		if (oscMsg.address === '/ggo/state/updated') {
			// Clear the timer for requestStateUpdate() as we've received confirmation that updates have been sent
			if (this.stateUpdateTimer) {
				clearInterval(this.stateUpdateTimer)
				this.stateUpdateTimer = null
			}
			this.module.log('info', `OSC Manager: Received complete state update from ${this.config.host}`)
			return
		}
		// Handle command and state messages
		if (oscMsg.address.startsWith('/ggo/state/')) {
			const variableName = this.parsePathToVariable(oscMsg)
			// Check if constructed variable name exists before handling the message
			if (variableName in this.companionVariables) {
				// Separate values that may create a message flood to treat them differently
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

	// Construct variable name from OSC message path
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
		return variableName
	}

	// Update variable values for Companion and internal uses
	updateVariableValues(updates) {
		let updatedVariables = {}
		let count = 0

		// Iterate over the updates
		for (let [variableName, value] of Object.entries(updates)) {
			// Check if variable exists and if its value has changed
			if (
				this.companionVariables.hasOwnProperty(variableName) &&
				this.companionVariables[variableName].value !== value
			) {
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
		// Apply the updates to Companion variables
		if (Object.keys(updatedVariables).length > 0) {
			this.module.setVariableValues(updatedVariables)
			this.module.checkFeedbacks()
		}
		// Log the number of variables updated
		if (count > 0) {
			this.module.log('debug', `OSC Manager: Updated values of ${count} variables`)
		}
	}

	// Helper function to sent OSC messages
	sendCommand(cmd, values) {
		// Normalize `values` to always be an array, this is needed to accept multiple values
		if (!Array.isArray(values)) {
			values = [values]
		}
		// Map values in array and prepare the arguments
		const args = values.map((value) => ({ type: 'i', value }))
		// Send command to Green-GO device
		this.oscPort.send({
			address: '/ggo/cmd/' + cmd,
			args: args,
		})
		this.module.log(
			'debug',
			`OSC Manager: Sent command to /ggo/cmd/${cmd} (${this.config.host}:${this.config.port}): ${values.join(', ')}`
		)
	}

	// Request state update from the Green-GO device. Runs as a timer to ensure we receive an update when the device comes online
	requestStateUpdate(isTimerCall = false) {
		if (this.oscPort) {
			const logMessage = isTimerCall
				? `OSC Manager: No updates received, requesting state update from ${this.config.host}`
				: `OSC Manager: Requesting state update from ${this.config.host}`

			this.module.log('debug', logMessage)
			this.sendCommand('update', 1)

			if (!this.stateUpdateTimer) {
				this.stateUpdateTimer = setInterval(() => this.requestStateUpdate(true), 30000)
			}
		} else {
			this.module.log('debug', `OSC Manager: OSC client not initialized, cannot request update`)
		}
	}

	// Helper function to reset the heartbeat
	handleHeartbeat() {
		// Set the heartbeat variable to 0
		this.updateVariableValues({ state_heartbeat: 0 })
		// Log a warning or error
		this.module.log('warn', `OSC Manager: Lost heartbet of ${this.config.host}`)
		// Start requesting state updates
		this.requestStateUpdate()
	}

	// Helper function to close existing connections
	closeOSCListeners() {
		if (this.oscPort) {
			this.oscPort.close()
			this.oscPort = null
			this.module.log('debug', 'OSC Manager: Closed OSC server')
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

// Class to collect variable updates and manage timers
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
				this.levelTimer = setTimeout(this.flushFloodingUpdates.bind(this), 250)
			}
		} else {
			this.updateQueue.set(variableName, value)
			if (this.timer) clearTimeout(this.timer)
			this.timer = setTimeout(this.flushUpdates.bind(this), 5)
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
