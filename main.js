const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdateVariableDefinitions = require('./variables')
const OSCServer = require('./osc')

class GreenGoModule extends InstanceBase {
	constructor(internal) {
		super(internal)

		// Initialize OSC Server
		this.osc = new OSCServer(this)
	}

	async init(config) {
		this.config = config

		// Initialize OSC if the necessary configuration parameters are present
		if (this.config.host && this.config.port) {
			this.osc.init()
			this.updateStatus(InstanceStatus.Ok)
			this.log('info', 'OSC initialized with configuration: ' + JSON.stringify(this.config))
		}

		//this.updateActions() // export actions
		//this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
	}

	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')

		// If OSC has been initialized, try to close the OSC connection
		if (this.osc) {
			try {
				await this.osc.close()
				this.log('info', 'OSC connection closed successfully.')
			} catch (error) {
				this.log('error', 'Error while closing OSC connection: ' + error.message)

				// Force destroy the OSC object if closing the connection failed
				try {
					this.osc.destroy()
					this.log('info', 'OSC connection destroyed successfully.')
				} catch (destroyError) {
					this.log('error', 'Error while destroying OSC connection: ' + destroyError.message)
				}
			}
		}
	}

	async configUpdated(config) {
		this.config = config

		// Reinitialize OSC if the configuration has been updated and the necessary parameters are present
		if (this.config.host && this.config.port) {
			this.osc.init()
			this.updateStatus(InstanceStatus.Ok)
			this.log('info', 'OSC reinitialized with updated configuration: ' + JSON.stringify(this.config))
		} else {
			this.updateStatus(InstanceStatus.Warning)
			this.log('warn', 'Cannot reinitialize OSC: Check configuration for remote host and port.')
		}
	}

	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 8,
				regex: Regex.IP,
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Target Port',
				width: 4,
				regex: Regex.PORT,
			},
		]
	}

	updateActions() {
		UpdateActions(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}
}

runEntrypoint(GreenGoModule, UpgradeScripts)
