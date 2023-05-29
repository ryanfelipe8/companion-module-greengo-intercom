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
		// Listen for the variableUpdated event
		this.osc.on('variableUpdated', (variableName, value) => {
			// The variableName and value parameters contain the name and new value of the updated variable
			this.companionVariables[variableName] = value
			this.log(`Variable ${variableName} was updated to ${value}`)
		})
	}

	async init(config) {
		this.config = config
		// Initialize the variables
		let variablesModule = UpdateVariableDefinitions(this, this.companionVariables)
		this.companionVariables = variablesModule.companionVariables
		if (this.companionVariables.state_channel_talk_ch1 == undefined) {
			this.log('warning', 'Creation or initialization of variables failed')
		}

		this.log('info', `Found a variable: ${JSON.stringify(this.companionVariables.state_talk_ch1)}`)

		// Initialize OSC if the necessary configuration parameters are present
		if (this.config.host && this.config.port) {
			this.osc.init(this.config, this.companionVariables)
			this.updateStatus(InstanceStatus.Ok)
		}

		// Check each variable for the specific values
		const needsUpdate = Object.keys(this.companionVariables).some((variableName) => {
			const valueObj = this.companionVariables[variableName]
			return valueObj.value == -99 || valueObj.value == -1
		})

		if (needsUpdate) {
			this.osc.requestStateUpdate()
		}

		//this.updateActions() // export actions
		//this.updateFeedbacks() // export feedbacks
	}

	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')

		// If OSC has been initialized, try to close the OSC connection
		if (this.osc) {
			this.osc.destroy()
			delete this.osc
			this.log('debug', 'OSC connection destroyed successfully.')
		}
	}

	async configUpdated(config) {
		this.config = config
		this.log('info', 'Updating')
		// Update missing or delete unused variables
		let variablesModule = UpdateVariableDefinitions(this, this.companionVariables)
		this.companionVariables = variablesModule.companionVariables
		if (this.companionVariables.state_channel_talk_ch1 == undefined) {
			this.log('warning', 'Re-initialization of variables failed')
		}
		this.log('info', `Found a variable: ${JSON.stringify(this.companionVariables.state_talk_ch1)}`)

		// Reinitialize OSC if the configuration has been updated and the necessary parameters are present
		if (this.config.host && this.config.port) {
			this.osc.init(this.config, this.companionVariables)
			this.updateStatus(InstanceStatus.Ok)
		} else {
			this.updateStatus(InstanceStatus.Warning)
			this.log('warn', 'Cannot reinitialize OSC: Check configuration for remote host and port.')
		}

		// Check each variable for the specific values
		const needsUpdate = Object.keys(this.companionVariables).some((variableName) => {
			const value = this.companionVariables[variableName].value
			this.log('debug', `Checking variable for default value: ${variableName} is ${JSON.stringify(value)}`)
			return value == -99 || value == -1
		})

		if (needsUpdate) {
			this.osc.requestStateUpdate()
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
