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

	async initializeOsc() {
		if (this.config.host && this.config.port) {
			try {
				await this.osc.init(this.config, this.companionVariables)

				this.log(
					'info',
					'Main: Initialized OSC Manager using configuration: ' +
						JSON.stringify({
							host: this.config.host,
							port: this.config.port,
						})
				)
			} catch (error) {
				this.log(
					'warn',
					'Main: Could not initialize OSC Manager using configuration: ' +
						JSON.stringify({
							host: this.config.host,
							port: this.config.port,
						})
				)
				this.updateStatus(InstanceStatus.Warning)
			}
			this.updateStatus(InstanceStatus.Ok)
		}
	}

	async updateVariables() {
		// Check each variable for the default values
		for (const variableName of Object.keys(this.companionVariables)) {
			const value = this.companionVariables[variableName].value
			if (value == -99 || value == -1) {
				// Initiate update request
				this.osc.requestStateUpdate()
				this.log('info', `Main: Found variable(s) using intial values: "${variableName}", requested update`)
				// Break loop after first match to avoid sending multiple requests
				break
			}
		}
	}

	async init(config) {
		this.config = config
		// Initialize the variables
		let variablesModule = UpdateVariableDefinitions(this)
		this.companionVariables = variablesModule.companionVariables
		if (this.companionVariables.state_channel_talk_ch1 == undefined) {
			this.log('warning', 'Main: Definitions are empty')
		}

		// Initialize OSC
		await this.initializeOsc()

		// Listen for the variableUpdated event
		this.osc.on('variableUpdated', (variableName, value) => {
			if (this.companionVariables[variableName]) {
				this.companionVariables[variableName].value = value
				// this.log('debug', `Received update for variable ${variableName}, new value: ${value}`)
			} else {
				this.log(
					'warn',
					`Main: Received update for unkown variable ${variableName} ${JSON.stringify(
						this.companionVariables[variableName]
					)}`
				)
			}
		})
		this.updateStatus(InstanceStatus.Ok)

		// Update variable values
		await this.updateVariables()

		this.updateActions()
		//this.updateFeedbacks() // export feedbacks
	}

	// When module gets deleted
	async destroy() {
		this.log('debug', 'Main: Issued destroy command')

		// If OSC has been initialized, try to close the OSC connection
		if (this.osc) {
			this.osc.destroy()
			delete this.osc
			this.log('debug', 'Main: Destroyed OSC Manager')
		}
	}

	async configUpdated(config) {
		this.log('info', 'Main: Config reload detected')
		// Recording previous configuration
		const oldConfig = this.config
		this.config = config
		// Re-initialize variables
		if (oldConfig.deviceType !== this.config.deviceType) {
			let variablesModule = UpdateVariableDefinitions(this)
			this.companionVariables = variablesModule.companionVariables
			if (this.companionVariables.state_channel_talk_ch1 == undefined) {
				this.log('warning', 'Main: Re-initialization of variables failed')
			}
		}
		// Reinitialize OSC if the configuration has been updated
		if (oldConfig.host !== this.config.host || oldConfig.port !== this.config.port) {
			{
				await this.initializeOsc()
			}
		}
		// Update variable values
		await this.updateVariables()
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
				tooltip: 'Select the IPv4 address your Green-GO device is using.',
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Target Port',
				width: 4,
				regex: Regex.PORT,
				tooltip: 'Select the port the Green-GO "osc-remote" script is using.',
			},
			{
				type: 'dropdown',
				id: 'deviceType',
				label: 'Device Type',
				choices: [
					{ id: 1, label: 'BPX' },
					{ id: 2, label: 'MCX(D)' },
					{ id: 3, label: 'WPX' },
					{ id: 4, label: 'RDX' },
					{ id: 5, label: 'Si2WR/Si4WR' },
					{ id: 6, label: 'INTX' },
				],
				tooltip: 'Select the type of Green-GO device you are connecting to',
				minChoicesForSearch: 1, // make the dropdown searchable
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
