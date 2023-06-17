module.exports = function (self) {
	const actionsForDeviceType = (deviceType) => {
		// Definition of commonly available button actions across device types
		const defaultActions = {
			channelTalk: {
				name: 'Set Channel Talk',
				description: 'Set the talk state of a defined channel',
				options: [
					{
						type: 'checkbox',
						id: 'cycle',
						label: 'Cycle Talk',
						default: false,
						tooltip: 'Activate to toggle the current talk state of the channel (latch)',
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
					const cmd = 'channel/talk'
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
							self.log('error', `Actions: Could not cycle state because variable ${variableName} does not exist.`)
						}
					} else {
						self.osc.sendCommand(cmd, [opt.talkState, opt.chId])
					}
				},
			},
			channelCall: {
				name: 'Send Channel Call',
				description: 'Send a call signal to a defined channel',
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
						label: 'Call Signal State',
						id: 'callState',
						default: 1,
						choices: [
							{ id: '0', label: 'Inactive' },
							{ id: '1', label: 'Call' },
							{ id: '2', label: 'Alert Call' },
						],
						minChoicesForSearch: 0,
						tooltip: 'Select the call signal state',
					},
				],
				callback: (action) => {
					let opt = action.options
					const cmd = 'channel/call'

					self.osc.sendCommand(cmd, [opt.callState, opt.chId])
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
						tooltip: 'Activate to cycle the current cue signal on the channel',
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
						label: 'Cue Signal State',
						id: 'cueState',
						default: 2,
						choices: [
							{ id: '0', label: 'Inactive' },
							{ id: '2', label: 'Attention' },
							{ id: '3', label: 'Ready' },
							{ id: '4', label: 'GO' },
						],
						minChoicesForSearch: 0,
						tooltip: 'Select cue signal state',
						isVisible: function (options) {
							if (options.cycle == false) {
								return true
							} else return false
						},
					},
				],
				callback: async (action) => {
					let opt = action.options
					const cmd = 'channel/cue'
					if (opt.cycle) {
						let variableName = 'state_cue_ch' + opt.chId
						if (self.companionVariables.hasOwnProperty(variableName)) {
							let currentValue = self.companionVariables[variableName].value
							// Define the cycle pattern
							const cyclePattern = [0, 2, 3, 4]
							// Find the index of the current value in the cycle pattern
							let index = cyclePattern.indexOf(currentValue)
							// Increment the index, wrapping around to the start of the cycle pattern if necessary
							index = (index + 1) % cyclePattern.length
							let newValue = cyclePattern[index]
							self.osc.sendCommand(cmd, [newValue, opt.chId])
						} else {
							self.log('error', `Actions: Could not cycle state because variable ${variableName} does not exist.`)
						}
					} else {
						self.osc.sendCommand(cmd, [opt.cueState, opt.chId])
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
							if (options.cycle == true) {
								return false
							} else return true
						},
					},
				],
				callback: (action) => {
					let opt = action.options
					const cmd = 'channel/listen'
					if (opt.cycle) {
						let variableName = 'state_listen_ch' + opt.chId
						if (self.companionVariables.hasOwnProperty(variableName)) {
							let currentValue = self.companionVariables[variableName].value
							// Switch between 1 and 0
							let newValue = currentValue === 1 ? 0 : 1
							self.osc.sendCommand(cmd, [newValue, opt.chId])
						} else {
							self.log('error', `Actions: Could not cycle state because variable ${variableName} does not exist.`)
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
						id: 'channelLevel',
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
					const cmd = 'channel/level'
					if (opt.cycle) {
						let variableName = 'state_level_ch' + opt.chId
						// Set a min and max level for the channel level
						const minLevel = -40
						const maxLevel = 12
						if (self.companionVariables.hasOwnProperty(variableName)) {
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
							self.log('error', `Actions: Could not cycle state because variable ${variableName} does not exist.`)
						}
					} else {
						self.osc.sendCommand(cmd, [opt.channelLevel, opt.chId])
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
						tooltip: 'Activate to cycle the current output level of the direct channel',
					},
					{
						type: 'number',
						label: 'Output Level (-40 - 12 dB, mute: -63)',
						id: 'directLevel',
						default: 0,
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
					const cmd = 'level/direct'
					if (opt.cycle) {
						let variableName = 'state_level_direct'
						// Set a min, max, and mute level for the channel level
						const muteLevel = -63
						const minLevel = -40
						const maxLevel = 12
						if (self.companionVariables.hasOwnProperty(variableName)) {
							let currentValue = self.companionVariables[variableName].value
							// Increment the current value by the step size
							let newValue = currentValue + opt.stepSize
							// Ensure newValue is within the allowed range
							if (newValue < minLevel && newValue > muteLevel) {
								newValue = newValue < currentValue ? muteLevel : minLevel
							} else if (newValue > maxLevel) {
								newValue = maxLevel
							} else if (newValue < muteLevel) {
								newValue = muteLevel
							}
							self.osc.sendCommand(cmd, [newValue])
						} else {
							self.log('error', `Actions: Could not cycle state because variable ${variableName} does not exist.`)
						}
					} else {
						self.osc.sendCommand(cmd, [opt.directLevel])
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
					const cmd = 'identify'
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
					const cmd = 'audio/gain'
					if (opt.cycle) {
						let variableName = 'state_audio_gain'
						if (self.companionVariables.hasOwnProperty(variableName)) {
							let currentValue = self.companionVariables[variableName].value
							// Increment the current value by the step size
							let newValue = currentValue + opt.stepSize
							self.osc.sendCommand(cmd, [newValue])
						} else {
							self.log('error', `Actions: Could not cycle state because variable ${variableName} does not exist.`)
						}
					} else {
						self.osc.sendCommand(cmd, [opt.gainLevel])
					}
				},
			},
			mainLevel: {
				name: 'Set Main Level',
				description: 'Control the main output level of the device',
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
						label: 'Output Level (-40 - 12, mute: -63)',
						id: 'mainLevel',
						default: 0,
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
					const cmd = 'level/main'
					if (opt.cycle) {
						let variableName = 'state_level_main'
						// Set a min, max, and mute level for main level
						const muteLevel = -63
						const minLevel = -40
						const maxLevel = 12
						if (self.companionVariables.hasOwnProperty(variableName)) {
							let currentValue = self.companionVariables[variableName].value
							// Increment the current value by the step size
							let newValue = currentValue + opt.stepSize
							// Ensure newValue is within the allowed range
							if (newValue < minLevel && newValue > muteLevel) {
								newValue = newValue < currentValue ? muteLevel : minLevel
							} else if (newValue > maxLevel) {
								newValue = maxLevel
							} else if (newValue < muteLevel) {
								newValue = muteLevel
							}
							self.osc.sendCommand(cmd, [newValue])
						} else {
							self.log('error', `Actions: Could not cycle state because variable ${variableName} does not exist.`)
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
						tooltip: 'Select isolate state',
						isVisible: function (options) {
							if (options.cycle == false) {
								return true
							} else return false
						},
					},
				],
				callback: (action) => {
					let opt = action.options
					const cmd = 'mode/isolate'
					if (opt.cycle) {
						let variableName = 'state_mode_isolate'
						if (self.companionVariables.hasOwnProperty(variableName)) {
							let currentValue = self.companionVariables[variableName].value
							// Switch between 1 and 0
							let newValue = currentValue === 1 ? 0 : 1
							self.osc.sendCommand(cmd, [newValue, opt.chId])
						} else {
							self.log('error', `Actions: Could not cycle state because variable ${variableName} does not exist.`)
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
						tooltip: 'Activate to cycle the current output level of the PGM special channel',
					},
					{
						type: 'number',
						label: 'Output Level (-40 - 12, mute: -63)',
						id: 'pgmLevel',
						default: 0,
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
					const cmd = 'level/pgm'
					if (opt.cycle) {
						let variableName = 'state_level_pgm'
						// Define the min, max, and mute level for the channel
						const muteLevel = -63
						const minLevel = -40
						const maxLevel = 12
						if (self.companionVariables.hasOwnProperty(variableName)) {
							let currentValue = self.companionVariables[variableName].value
							// Increment the current value by the step size
							let newValue = currentValue + opt.stepSize
							// Ensure newValue is within the allowed range
							if (newValue < minLevel && newValue > muteLevel) {
								newValue = newValue < currentValue ? muteLevel : minLevel
							} else if (newValue > maxLevel) {
								newValue = maxLevel
							} else if (newValue < muteLevel) {
								newValue = muteLevel
							}
							self.osc.sendCommand(cmd, [newValue])
						} else {
							self.log('error', `Actions: Could not cycle state because variable ${variableName} does not exist.`)
						}
					} else {
						self.osc.sendCommand(cmd, [opt.pgmLevel])
					}
				},
			},
		}
		// Definitions of device specific button actions
		switch (deviceType) {
			case 'BPX':
			case 'MCX':
			case 'WPX':
				return {
					...defaultActions,
					inputSource: {
						name: 'Set Input Source',
						description: `Control the active input of the device`,
						options: [
							{
								type: 'dropdown',
								label: 'Active Input',
								id: 'activeInput',
								default: 0,
								choices: [
									{ id: '-4', label: '2.5 kHz' },
									{ id: '-3', label: '1.2 kHz' },
									{ id: '-2', label: '1 kHz' },
									{ id: '-1', label: '375 Hz' },
									{ id: '0', label: 'Headset' },
									{ id: '1', label: 'Front-Mic' },
									{ id: '2', label: 'Line-In' },
									{ id: '4', label: 'Muted' },
								],
								minChoicesForSearch: 0,
								tooltip: 'Select the active input source',
							},
						],
						callback: (action) => {
							let opt = action.options
							const cmd = 'audio/source'
							self.osc.sendCommand(cmd, [opt.activeInput])
						},
					},
				}
			default:
				return defaultActions
		}
	}

	const deviceType = self.config.deviceType
	const actions = actionsForDeviceType(deviceType)
	self.setActionDefinitions(actions)
}
