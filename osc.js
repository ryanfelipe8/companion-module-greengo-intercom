const osc = require('osc')
const EventEmitter = require('events')

class OscModule extends EventEmitter {
	constructor(module) {
		super()
		this.module = module
		this.oscServer = null
		this.oscClient = null
		this.generalUpdateTimer = null
		this.updateTimers = {}
		this.updateQueue = []
		this.latestValues = {}
	}

	init(config, companionVariables) {
		this.companionVariables = companionVariables
		if (!this.companionVariables) {
			this.module.log('warn', `OSC Module: No variables defined`)
		}
		this.config = config
		// Ensure config is initialized
		if (!this.config) {
			this.module.log('error', `OSC Module: Config not initialized`)
			return
		}
		if (this.oscServer || this.oscClient) {
			this.module.log('debug', 'OSC Module: Running instance found, restarting the OSC listeners')
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

		this.module.log(
			'info',
			'OSC initialized, using configuration: ' +
				JSON.stringify({
					host: this.config.host,
					port: this.config.port,
				})
		)
	}

	// Helper function to close existing connections
	closeOSCListeners() {
		if (this.oscServer) {
			this.oscServer.close()
			this.oscServer = null
		}
		if (this.oscClient) {
			this.oscClient.close()
			this.oscClient = null
		}
	}

	onMessage(oscMsg) {
		// Ignore state update messages
		if (oscMsg.address === '/ggo/state/update') {
			return
		}
		// this.module.log('debug', `OSC Module: Received message for ${oscMsg.address}: ${JSON.stringify(oscMsg.args)}`)
		// Handle command and state messages
		if (oscMsg.address.startsWith('/ggo/state/')) {
			// Parse message and update variables as needed
			let variableName = this.parsePathToVariable(oscMsg)
			if (variableName in this.companionVariables) {
				// Set individual timers for paths containing "level" or "gain"
				if (oscMsg.address.includes('level') || oscMsg.address.includes('gain')) {
					let delay = 350
					if (!this.updateTimers[variableName]) {
						this.updateTimers[variableName] = setTimeout(() => {
							this.updateVariableValue(variableName, this.latestValues[variableName])
							delete this.updateTimers[variableName]
						}, delay)
					}
					// Update the latest value for this variable
					this.latestValues[variableName] = oscMsg.args[0].value
				} else {
					this.updateQueue.push({ variableName, value: oscMsg.args[0].value })
					let delay = 3
					clearTimeout(this.generalUpdateTimer)
					this.generalUpdateTimer = setTimeout(() => {
						while (this.updateQueue.length) {
							const update = this.updateQueue.pop()
							this.updateVariableValue(update.variableName, update.value)
						}
					}, delay)
				}
			} else {
				this.module.log(
					'warn',
					`OSC Module: Received message using usupported path. Generated variable ${variableName} not found`
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
		// this.module.log('debug', `OSC Module: Returning variable ${variableName} extracted from ${oscMsg.address}`)
		return variableName
	}

	updateVariableValue(variableName, value) {
		// Check if the value is the same as the current one and return if true
		if (this.companionVariables[variableName] === value) {
			return
		}

		// If the value is different, update the Companion variable and the local variable's value
		this.module.setVariableValues({ [variableName]: value })
		this.companionVariables[variableName] = value

		this.emit('variableUpdated', variableName, value)
		this.module.log('debug', `OSC Module: Updated variable ${variableName} to value ${value}`)
	}

	sendCommand(cmd, value) {
		// Send command to Green-GO device
		this.oscClient.send({
			address: '/ggo/cmd/' + cmd,
			args: [{ type: 'i', value: value }],
		})
		this.module.log(
			'debug',
			`OSC Module: Sent command to ${this.config.host}:${this.config.port}/ggo/cmd/${cmd}: ${value}`
		)
	}

	requestStateUpdate() {
		if (this.oscClient) {
			// Request state update from Green-GO device
			this.oscClient.send({
				address: '/ggo/state/update',
				args: [{ type: 'i', value: 1 }],
			})
			this.module.log('debug', `OSC Module: Requested state update from ${this.config.host}`)
		} else {
			this.module.log('debug', `OSC Module: OSC client not initialized, cannot request state update`)
		}
	}

	async close() {
		this.closeOSCListeners()
	}

	onError(error) {
		// Log errors
		this.module.log('error', `OSC Module: ${error.message}`)
	}

	destroy() {
		this.closeOSCListeners()
	}
}

module.exports = OscModule
