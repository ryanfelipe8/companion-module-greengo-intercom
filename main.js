const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdateVariableDefinitions = require('./variables')
const UpdatePresets = require('./presets.js')
const OscManager = require('./osc')

class GreenGoModule extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	// Async function to initialize the OSC server and client
	async initializeOsc() {
		if (this.config.host && this.config.port) {
			try {
				// Passing companionVariables
				await this.osc.init(this.config, this.companionVariables)

				this.log(
					'info',
					'Main: Initialized OSC Manager using configuration: ' +
						JSON.stringify({
							host: this.config.host,
							port: this.config.port,
						})
				)
				this.updateStatus(InstanceStatus.Ok)
			} catch (error) {
				this.log(
					'error',
					'Main: Could not initialize OSC Manager using configuration: ' +
						JSON.stringify({
							host: this.config.host,
							port: this.config.port,
						})
				)
				this.updateStatus(InstanceStatus.Error, error.message)
			}
		} else {
			let msg = 'IP or port configuration not found'
			this.updateStatus(InstanceStatus.BadConfig, msg)
		}
	}

	// Async function to check all variables for default variables. If one is found, a state request is issued
	async updateVariables() {
		// Check each variable for the default values
		for (const variableName of Object.keys(this.companionVariables)) {
			const value = this.companionVariables[variableName].value
			if (value == -99 || value == -1) {
				// Initiate update request
				this.log('info', `Main: Found variable (${variableName}) using a default value (${value}), requesting update`)
				this.osc.requestStateUpdate()
				// Break loop after first match to avoid sending multiple requests
				break
			}
		}
	}
	async init(config) {
		// Initialize Config
		this.config = config
		// Initialize OSC Server
		this.osc = new OscManager(this)
		// Initialize the variables
		const variablesModule = UpdateVariableDefinitions(this)
		// Mount internal variables & check a value
		this.companionVariables = variablesModule.companionVariables
		if (this.companionVariables.state_channel_talk_ch1 == undefined) {
			this.log('warning', 'Main: Definitions are empty')
		}

		await this.initializeOsc()

		// Listen for the variableUpdated emit function from updateVariableValues
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

		await this.updateVariables()

		this.updateActions()
		this.updateFeedbacks()
		await this.updatePresets()
	}

	// Destroy when module gets deleted
	async destroy() {
		this.log('debug', 'Main: Issued destroy command')

		// OSC destroy
		if (this.osc) {
			this.osc.destroy()
			delete this.osc
			this.log('debug', 'Main: Destroyed OSC Manager')
		}
	}

	async configUpdated(config) {
		// Recording previous configuration
		const oldConfig = this.config
		this.config = config
		// Re-initialize variables if module configuration has been updated (deviceType or channels)
		if (oldConfig.deviceType !== this.config.deviceType || oldConfig.channels !== this.config.channels) {
			if (oldConfig.deviceType !== this.config.deviceType) {
				this.log('info', 'Main: Configuration change detected (device type), resetting all variables')
			} else {
				this.log('info', 'Main: Configuration change detected (channel count), resetting all variables')
			}
			const variablesModule = UpdateVariableDefinitions(this)
			this.companionVariables = variablesModule.companionVariables
			if (this.companionVariables.state_channel_talk_ch1 == undefined) {
				this.log('warning', 'Main: Initialization of variables failed')
			}
			await this.initializeOsc()
		}
		// Re-initialize OSC if the configuration has been updated (host or port)
		if (oldConfig.host !== this.config.host || oldConfig.port !== this.config.port) {
			{
				this.log('info', 'Main: Configuration change detected (IP address or port), restarting OSC Manger.')
				await this.initializeOsc()
			}
		}
		await this.updateVariables()
		this.updateActions()
		this.updateFeedbacks()
		await this.updatePresets()
	}

	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Device IP',
				width: 8,
				required: true,
				regex: Regex.IP,
				tooltip: 'Select the IPv4 address your Green-GO device is using.',
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Script Port',
				width: 4,
				required: true,
				regex: Regex.PORT,
				tooltip: 'Select the port the Green-GO "osc-remote" script is using.',
			},
			{
				type: 'dropdown',
				id: 'deviceType',
				label: 'Device Type',
				width: 8,
				required: true,
				default: 'BPX',
				choices: [
					{ id: 'BPX', label: 'BPX' },
					{ id: 'MCX', label: 'MCX(D)' },
					{ id: 'WPX', label: 'WPX' },
					{ id: 'RDX', label: 'RDX' },
					{ id: 'SIWR', label: 'Si2WR/Si4WR' },
					{ id: 'INTX', label: 'INTX' },
				],
				minChoicesForSearch: 0,
				tooltip: 'Select the type of Green-GO device you are connecting to (only placholder, has no real function).',
			},
			{
				type: 'number',
				id: 'channels',
				label: 'Channel Count',
				width: 4,
				required: true,
				default: 6,
				min: 1,
				max: 6,
				regex: Regex.number,
				tooltip: 'Define the amount of channels to control (1 - 6) via this module.',
			},
			{
				type: 'static-text',
				id: 'info',
				width: 12,
				label: 'Important Notice',
				value:
					'Before using the Green-GO module for Bitfocus Companion, make sure to load the "osc-remote.gg5t" script file onto your Green-GO device. This plugin will not function without that script running!<br><br>If you have any questions, please consult our <a href="https://companion.greengo.digital">documentation</a> for further details or contact our <a href="https://companion.greengo.digital">community</a>.',
			},
		]
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}

	updateActions() {
		UpdateActions(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updatePresets() {
		UpdatePresets(this)
	}
}

runEntrypoint(GreenGoModule, UpgradeScripts)
