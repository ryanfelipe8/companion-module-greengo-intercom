module.exports = function (module) {
	const actions = {}

	// Store instance and config for later use
	const self = module
	const config = self.config
	const osc = self.osc

	// Load in companionVariable from main.js
	const companionVariable = self.companionVariables

	// This function will be called every time a variable is updated
	osc.on('variableUpdated', function (variableName, value) {
		companionVariable[variableName] = value
	})

	// Define your actions here
	// Each action must have a name, an optional list of options, and a callback function
	actions['my_action'] = {
		name: 'My action',
		options: [
			{
				type: 'textinput',
				label: 'Input',
				id: 'my_input',
				default: '',
			},
			// Add more options as needed
		],
		callback: function (action) {
			// Use osc.sendCommand to send an OSC command
			// You can access the action's options using action.options
			const command = 'my/command ' + action.options.my_input
			osc.sendCommand(command)

			// Access and use companionVariable as needed
			const myVariableValue = companionVariable['my_variable']
			console.log('Value of my_variable: ' + myVariableValue)
		},
	}

	// Add more actions as needed

	// Finally, set the actions
	self.setActionDefinitions(actions)
}
