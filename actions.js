module.exports = function (self) {
	self.setActionDefinitions({
		channelTalk: {
			name: 'Set Channel Talk',
			description: 'Set the talk state of a defined channel',
			options: [
				{
					type: 'checkbox',
					id: 'cycle',
					label: 'Cycle Talk',
					default: false,
					tooltip: 'Activate to toggle the talk state (latch) of the channel',
				},
				{
					type: 'number',
					label: `Channel ID (1 - ${self.config.channels})`,
					id: 'chId',
					default: 1,
					min: 1,
					max: self.config.channels,
					tooltip: 'Define the channel ID',
				},
				{
					type: 'dropdown',
					label: 'Talk State',
					id: 'talkState',
					default: 2,
					choices: [
						{ id: '0', label: 'Disabled' },
						{ id: '2', label: 'Latch' },
						{ id: '3', label: 'Momentary' },
					],
					minChoicesForSearch: 0,
					tooltip: 'Select the talk state',
					isVisible: function (options) {
						if (options.cycle == false) {
							return true
						} else return false
					},
				},
			],
			callback: (action) => {
				let opt = action.options
				let cmd = 'channel/talk'
				if (opt.cycle) {
					// Get the variable name based on the channel ID
					let variableName = 'state_talk_ch' + opt.chId
					// Check if the variable exists
					if (self.companionVariables.hasOwnProperty(variableName)) {
						// Get the current value of the variable
						let currentValue = self.companionVariables[variableName].value
						// Switch between 0 and 2
						let newValue = currentValue === 0 ? 2 : 0
						self.osc.sendCommand(cmd, [newValue, opt.chId])
					} else {
						self.log('error', `Could not cycle state because variable ${variableName} does not exist.`)
					}
				} else {
					self.osc.sendCommand(cmd, [opt.talkState, opt.chId])
				}
			},
		},
		channelCall: {
			name: 'Send Channel Call',
			description: 'Send a call signal to the defined channel',
			options: [
				{
					type: 'number',
					label: `Channel ID (1 - ${self.config.channels})`,
					id: 'chId',
					default: 1,
					min: 1,
					max: self.config.channels,
					tooltip: 'Define the channel ID',
				},
				{
					type: 'dropdown',
					label: 'Call Type',
					id: 'callType',
					default: 1,
					choices: [
						{ id: '0', label: 'Inactive' },
						{ id: '1', label: 'Call' },
						{ id: '2', label: 'Alert Call' },
					],
					minChoicesForSearch: 0,
					tooltip: 'Select the call signal type',
				},
			],
			callback: (action) => {
				let opt = action.options
				let cmd = 'channel/call'

				self.osc.sendCommand(cmd, [opt.callType, opt.chId])
			},
		},
		channelCue: {
			name: 'Send Channel Cue',
			description: 'Send a cue signal to a defined channel',
			options: [
				{
					type: 'checkbox',
					id: 'cycle',
					label: 'Cycle Cue',
					default: false,
					tooltip: 'Activate to cycle the cue type depending on the current channel state',
				},
				{
					type: 'number',
					label: `Channel ID (1 - ${self.config.channels})`,
					id: 'chId',
					default: 1,
					min: 1,
					max: self.config.channels,
					tooltip: 'Define the channel ID',
				},
				{
					type: 'dropdown',
					label: 'Cue Type',
					id: 'cueType',
					default: 2,
					choices: [
						{ id: '0', label: 'Inactive' },
						{ id: '2', label: 'Attention' },
						{ id: '3', label: 'Ready' },
						{ id: '4', label: 'GO' },
					],
					minChoicesForSearch: 0,
					tooltip: 'Select cue signal type',
					isVisible: function (options) {
						if (options.cycle == false) {
							return true
						} else return false
					},
				},
			],
			callback: async (action) => {
				let opt = action.options
				let cmd = 'channel/cue'
				if (opt.cycle) {
					// Get the variable name based on the channel ID
					let variableName = 'state_cue_ch' + opt.chId
					// Check if the variable exists
					if (self.companionVariables.hasOwnProperty(variableName)) {
						// Get the current value of the variable
						let currentValue = self.companionVariables[variableName].value
						// Define the cycle pattern
						const cyclePattern = [0, 2, 3, 4]
						// Find the index of the current value in the cycle pattern
						let index = cyclePattern.indexOf(currentValue)
						// Increment the index, wrapping around to the start of the cycle pattern if necessary
						index = (index + 1) % cyclePattern.length
						// Get the new value from the cycle pattern
						let newValue = cyclePattern[index]
						self.osc.sendCommand(cmd, [newValue, opt.chId])
					} else {
						self.log('error', `Could not cycle state because variable ${variableName} does not exist.`)
					}
				} else {
					self.osc.sendCommand(cmd, [opt.cueType, opt.chId])
				}
			},
		},
		channelListen: {
			name: 'Set Channel Listen',
			description: 'Mute or unmute the output of a defined channel',
			options: [
				{
					type: 'checkbox',
					id: 'cycle',
					label: 'Cycle Listen',
					default: false,
					tooltip: 'Activate to toggle the current listen state of the channel',
				},
				{
					type: 'number',
					label: `Channel ID (1 - ${self.config.channels})`,
					id: 'chId',
					default: 1,
					min: 1,
					max: self.config.channels,
					tooltip: 'Define the channel ID',
				},
				{
					type: 'dropdown',
					label: 'Listen State',
					id: 'listenState',
					default: 0,
					choices: [
						{ id: '0', label: 'Mute' },
						{ id: '1', label: 'Unmute' },
					],
					minChoicesForSearch: 0,
					tooltip: 'Select listen state',
					isVisible: function (options) {
						if (options.cycle == false) {
							return true
						} else return false
					},
				},
			],
			callback: (action) => {
				let opt = action.options
				let cmd = 'channel/listen'
				if (opt.cycle) {
					// Get the variable name based on the channel ID
					let variableName = 'state_listen_ch' + opt.chId
					// Check if the variable exists
					if (self.companionVariables.hasOwnProperty(variableName)) {
						// Get the current value of the variable
						let currentValue = self.companionVariables[variableName].value
						// Switch between 1 and 0
						let newValue = currentValue === 1 ? 0 : 1
						self.osc.sendCommand(cmd, [newValue, opt.chId])
					} else {
						self.log('error', `Could not cycle state because variable ${variableName} does not exist.`)
					}
				} else {
					self.osc.sendCommand(cmd, [opt.listenState, opt.chId])
				}
			},
		},
		channelLevel: {
			name: 'Set Channel Level',
			description: 'Control the output level for a defined channel',
			options: [
				{
					type: 'checkbox',
					id: 'cycle',
					label: 'Cycle Channel Level',
					default: false,
					tooltip: 'Activate to cycle the current output level of the channel',
				},
				{
					type: 'number',
					label: `Channel ID (1 - ${self.config.channels})`,
					id: 'chId',
					default: 1,
					min: 1,
					max: self.config.channels,
					tooltip: 'Define the channel ID',
				},
				{
					type: 'number',
					label: 'Output Level (-40 - 12 dB)',
					id: 'chLevel',
					default: 0,
					min: -40,
					max: 12,
					tooltip: 'Set a specific output level for the channel',
					isVisible: function (options) {
						if (options.cycle == false) {
							return true
						} else return false
					},
				},
				{
					type: 'number',
					label: 'Step Size (-/+)',
					id: 'stepSize',
					default: 1,
					tooltip: 'The step size to increase or decrease the current channel output level',
					isVisible: function (options) {
						if (options.cycle == true) {
							return true
						} else return false
					},
				},
			],
			callback: (action) => {
				let opt = action.options
				let cmd = 'channel/level'
				if (opt.cycle) {
					// Get the variable name based on the channel ID
					let variableName = 'state_level_ch' + opt.chId
					// Set a min and max level for the channel level
					const minLevel = -40
					const maxLevel = 12
					// Check if the variable exists
					if (self.companionVariables.hasOwnProperty(variableName)) {
						// Get the current value of the variable
						let currentValue = self.companionVariables[variableName].value
						// Increment the current value by the step size
						let newValue = currentValue + opt.stepSize
						// Ensure newValue is within the allowed range
						if (newValue < minLevel) {
							newValue = minLevel
						} else if (newValue > maxLevel) {
							newValue = maxLevel
						}
						self.osc.sendCommand(cmd, [newValue, opt.chId])
					} else {
						self.log('error', `Could not cycle state because variable ${variableName} does not exist.`)
					}
				} else {
					self.osc.sendCommand(cmd, [opt.chLevel, opt.chId])
				}
			},
		},
		directLevel: {
			name: 'Set Direct Channel Level',
			description: 'Control the output level for the temporary direct channel',
			options: [
				{
					type: 'checkbox',
					id: 'cycle',
					label: 'Cycle Direct Channel Level',
					default: false,
					tooltip: 'Activate to cycle the current output level of the channel',
				},
				{
					type: 'number',
					label: 'Output Level (-40 - 12 dB)',
					id: 'chLevel',
					default: 0,
					min: -40,
					max: 12,
					tooltip: 'Set a specific output level for the channel',
					isVisible: function (options) {
						if (options.cycle == false) {
							return true
						} else return false
					},
				},
				{
					type: 'number',
					label: 'Step Size (-/+)',
					id: 'stepSize',
					default: 1,
					tooltip: 'The step size to increase or decrease the direct channel output level',
					isVisible: function (options) {
						if (options.cycle == true) {
							return true
						} else return false
					},
				},
			],
			callback: (action) => {
				let opt = action.options
				let cmd = 'level/direct'
				if (opt.cycle) {
					// Get the variable name based on the channel ID
					let variableName = 'state_level_direct'
					// Set a min and max level for the channel level
					const minLevel = -40
					const maxLevel = 12
					// Check if the variable exists
					if (self.companionVariables.hasOwnProperty(variableName)) {
						// Get the current value of the variable
						let currentValue = self.companionVariables[variableName].value
						// Increment the current value by the step size
						let newValue = currentValue + opt.stepSize
						// Ensure newValue is within the allowed range
						if (newValue < minLevel) {
							newValue = minLevel
						} else if (newValue > maxLevel) {
							newValue = maxLevel
						}
						self.osc.sendCommand(cmd, [newValue])
					} else {
						self.log('error', `Could not cycle state because variable ${variableName} does not exist.`)
					}
				} else {
					self.osc.sendCommand(cmd, [opt.chLevel])
				}
			},
		},
		identifyDevice: {
			name: 'Identify Device',
			description: 'Control the identify function of a device',
			options: [
				{
					type: 'dropdown',
					label: 'Identify State',
					id: 'identifyState',
					default: 1,
					choices: [
						{ id: '0', label: 'Idle' },
						{ id: '1', label: 'Identify' },
					],
					minChoicesForSearch: 0,
					tooltip: 'Select identify state',
				},
			],
			callback: (action) => {
				let opt = action.options
				let cmd = 'identify'
				self.osc.sendCommand(cmd, [opt.identifyState])
			},
		},
		inputGain: {
			name: 'Set Input Gain',
			description: 'Control the gain of the active user input',
			options: [
				{
					type: 'checkbox',
					id: 'cycle',
					label: 'Cycle Input Gain',
					default: false,
					tooltip: 'Activate to cycle the current input gain',
				},
				{
					type: 'number',
					label: 'Gain Level',
					id: 'gainLevel',
					tooltip: 'Set a specific input gain',
					isVisible: function (options) {
						if (options.cycle == false) {
							return true
						} else return false
					},
				},
				{
					type: 'number',
					label: 'Step Size (-/+)',
					id: 'stepSize',
					default: 1,
					tooltip: 'The step size to increase or decrease the current input gain',
					isVisible: function (options) {
						if (options.cycle == true) {
							return true
						} else return false
					},
				},
			],
			callback: (action) => {
				let opt = action.options
				let cmd = 'audio/gain'
				if (opt.cycle) {
					// Get the variable name based on the channel ID
					let variableName = 'state_audio_gain'
					// Check if the variable exists
					if (self.companionVariables.hasOwnProperty(variableName)) {
						// Get the current value of the variable
						let currentValue = self.companionVariables[variableName].value
						// Increment the current value by the step size
						let newValue = currentValue + opt.stepSize
						// Ensure newValue is within the allowed range
						if (newValue < minLevel) {
							newValue = minLevel
						} else if (newValue > maxLevel) {
							newValue = maxLevel
						}
						self.osc.sendCommand(cmd, [newValue])
					} else {
						self.log('error', `Could not cycle state because variable ${variableName} does not exist.`)
					}
				} else {
					self.osc.sendCommand(cmd, [gainLevel])
				}
			},
		},
		mainLevel: {
			name: 'Set Main Level',
			description: 'Control the main output level of the devicelevel',
			options: [
				{
					type: 'checkbox',
					id: 'cycle',
					label: 'Cycle Main Level',
					default: false,
					tooltip: 'Activate to cycle the current main output level of the device',
				},
				{
					type: 'number',
					label: 'Output Level (-40 - 12, -63 is mute)',
					id: 'mainLevel',
					default: 0,
					min: -40,
					max: 12,
					tooltip: 'Set a specific output level for the device',
					isVisible: function (options) {
						if (options.cycle == false) {
							return true
						} else return false
					},
				},
				{
					type: 'number',
					label: 'Step Size (-/+)',
					id: 'stepSize',
					default: 1,
					tooltip: 'The step size to increase or decrease the current main output level',
					isVisible: function (options) {
						if (options.cycle == true) {
							return true
						} else return false
					},
				},
			],
			callback: (action) => {
				let opt = action.options
				let cmd = 'level/main'
				if (opt.cycle) {
					// Get the variable name based on the channel ID
					let variableName = 'state_level_main'
					// Set a min and max level for main level
					const minLevel = -40
					const maxLevel = 12
					// Check if the variable exists
					if (self.companionVariables.hasOwnProperty(variableName)) {
						// Get the current value of the variable
						let currentValue = self.companionVariables[variableName].value
						// Increment the current value by the step size
						let newValue = currentValue + opt.stepSize
						// Ensure newValue is within the allowed range
						if (newValue < minLevel) {
							newValue = minLevel
						} else if (newValue > maxLevel) {
							newValue = maxLevel
						}
						self.osc.sendCommand(cmd, [newValue])
					} else {
						self.log('error', `Could not cycle state because variable ${variableName} does not exist.`)
					}
				} else {
					self.osc.sendCommand(cmd, [opt.mainLevel])
				}
			},
		},
		modeIsolate: {
			name: 'Set Isolate State',
			description: 'Set the isolate mode of the device',
			options: [
				{
					type: 'checkbox',
					id: 'cycle',
					label: 'Cycle Isolate',
					default: false,
					tooltip: 'Activate to toggle the current isolate state of the device',
				},
				{
					type: 'dropdown',
					label: 'Listen State',
					id: 'isolateState',
					default: 0,
					choices: [
						{ id: '0', label: 'Idle' },
						{ id: '1', label: 'Isolate' },
					],
					minChoicesForSearch: 0,
					tooltip: 'Choose isolate state',
					isVisible: function (options) {
						if (options.cycle == false) {
							return true
						} else return false
					},
				},
			],
			callback: (action) => {
				let opt = action.options
				let cmd = 'mode/isolate'
				if (opt.cycle) {
					// Get the variable name based on the channel ID
					let variableName = 'state_mode_isolate'
					// Check if the variable exists
					if (self.companionVariables.hasOwnProperty(variableName)) {
						// Get the current value of the variable
						let currentValue = self.companionVariables[variableName].value
						// Switch between 1 and 0
						let newValue = currentValue === 1 ? 0 : 1
						self.osc.sendCommand(cmd, [newValue, opt.chId])
					} else {
						self.log('error', `Could not cycle state because variable ${variableName} does not exist.`)
					}
				} else {
					self.osc.sendCommand(cmd, [opt.isolateState])
				}
			},
		},
		pgmLevel: {
			name: 'Set PGM Level',
			description: 'Control the output level of the PGM special channel',
			options: [
				{
					type: 'checkbox',
					id: 'cycle',
					label: 'Cycle PGM Level',
					default: false,
					tooltip: 'Activate to cycle the output level of PGM special channel, depending on its current state',
				},
				{
					type: 'number',
					label: 'Output Level (-40 - 12, -63 is mute)',
					id: 'pgmLevel',
					default: 0,
					min: -40,
					max: 12,
					tooltip: 'Set a specific output level for the PGM special channel',
					isVisible: function (options) {
						if (options.cycle == false) {
							return true
						} else return false
					},
				},
				{
					type: 'number',
					label: 'Step Size (-/+)',
					id: 'stepSize',
					default: 1,
					tooltip: 'The step size to increase or decrease the current PGM output level',
					isVisible: function (options) {
						if (options.cycle == true) {
							return true
						} else return false
					},
				},
			],
			callback: (action) => {
				let opt = action.options
				let cmd = 'level/pgm'
				if (opt.cycle) {
					// Get the variable name based on the channel ID
					let variableName = 'state_level_pgm'
					// Define the min and max level for a channel
					const minLevel = -40
					const maxLevel = 12
					// Check if the variable exists
					if (self.companionVariables.hasOwnProperty(variableName)) {
						// Get the current value of the variable
						let currentValue = self.companionVariables[variableName].value
						// Increment the current value by the step size
						let newValue = currentValue + opt.stepSize
						// Ensure newValue is within the allowed range
						if (newValue < minLevel) {
							newValue = minLevel
						} else if (newValue > maxLevel) {
							newValue = maxLevel
						}
						self.osc.sendCommand(cmd, [newValue])
					} else {
						self.log('error', `Could not cycle state because variable ${variableName} does not exist.`)
					}
				} else {
					self.osc.sendCommand(cmd, [opt.pgmLevel])
				}
			},
		},
	})
}
