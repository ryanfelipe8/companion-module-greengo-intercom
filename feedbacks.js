const { combineRgb } = require('@companion-module/base')
module.exports = function (self) {
	const white = combineRgb(255, 255, 255)
	const red = combineRgb(204, 0, 0)
	const black = combineRgb(0, 0, 0)
	const green = combineRgb(0, 153, 0)
	const yellow = combineRgb(255, 213, 0)
	const orange = combineRgb(255, 102, 0)
	const blue = combineRgb(0, 0, 255)

	self.setFeedbackDefinitions({
		callSendState: {
			type: 'boolean',
			name: 'Check Call Signal (Sending)',
			description: `Change button styles depending on a channel's outgoing call signal state`,
			defaultStyle: {
				bgcolor: red,
				color: white,
			},
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
					tooltip: 'Select the call signal type for your style',
					default: 1,
					choices: [
						{ id: 0, label: 'Idle' },
						{ id: 1, label: 'Call' },
						{ id: 2, label: 'Alert Call' },
					],
					minChoicesForSearch: 0,
				},
			],
			callback: (feedback) => {
				let opt = feedback.options
				let variableName = `state_call_ch${opt.chId}`
				if (self.companionVariables.hasOwnProperty(variableName)) {
					let var_state = self.companionVariables[variableName].value
					if (var_state === opt.callState) {
						return true
					} else {
						return false
					}
				} else {
					self.log('error', `Feedbacks: The variable ${variableName} is not defined in companionVariables`)
					return false
				}
			},
		},
		callReceiveState: {
			type: 'boolean',
			name: 'Check Call Signal (Receiving)',
			description: `Change button styles depending on a channel's incoming call signal state`,
			defaultStyle: {
				bgcolor: red,
				color: white,
			},
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
					tooltip: 'Select the call signal type for your style',
					default: 1,
					choices: [
						{ id: 0, label: 'Idle' },
						{ id: 1, label: 'Call' },
						{ id: 2, label: 'Alert Call' },
					],
					minChoicesForSearch: 0,
				},
			],
			callback: (feedback) => {
				let opt = feedback.options
				let variableName = `state_input_call_ch${opt.chId}`
				if (self.companionVariables.hasOwnProperty(variableName)) {
					let var_state = self.companionVariables[variableName].value
					if (var_state === opt.callState) {
						return true
					} else {
						return false
					}
				} else {
					self.log('error', `Feedbacks: The variable ${variableName} is not defined in companionVariables`)
					return false
				}
			},
		},
		channelLevel: {
			type: 'boolean',
			name: 'Check Channel Output Level',
			description: `Change button styles depending on a channel's output level`,
			defaultStyle: {
				bgcolor: red,
				color: white,
			},
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
					type: 'number',
					label: 'Channel Level (-40 - 12)',
					id: 'channelLevel',
					default: 0,
					min: -40,
					max: 12,
					tooltip: `Define the channel's output level`,
				},
			],
			callback: (feedback) => {
				let opt = feedback.options
				let variableName = `state_level_ch${opt.chId}`
				if (self.companionVariables.hasOwnProperty(variableName)) {
					let var_state = self.companionVariables[variableName].value
					if (var_state >= opt.channelLevel) {
						return true
					} else {
						return false
					}
				} else {
					self.log('error', `Feedbacks: The variable ${variableName} is not defined in companionVariables`)
					return false
				}
			},
		},
		cueState: {
			type: 'advanced',
			name: 'Check Cue Signal',
			description: `Change button styles depending on a channel's cue signal state.`,
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
			],
			callback: (feedback) => {
				let opt = feedback.options
				let variableName = `state_cue_ch${opt.chId}`
				if (self.companionVariables.hasOwnProperty(variableName)) {
					let var_state = self.companionVariables[variableName].value
					if (var_state === opt.cueState) {
						if (var_state === 2) {
							return {
								text: `CH${opt.chId}\nATT`,
								bgcolor: yellow,
								color: black,
							}
						} else if (var_state === 3) {
							return {
								text: `CH${opt.chId}\nRDY`,
								bgcolor: orange,
								color: white,
							}
						} else if (var_state === 4) {
							return {
								text: `CH${opt.chId}\nGO`,
								bgcolor: green,
								color: white,
							}
						}
					} else {
						return false
					}
				} else {
					self.log('error', `Feedbacks: The variable ${variableName} is not defined in companionVariables`)
					return false
				}
			},
		},
		directLevel: {
			type: 'boolean',
			name: 'Check Direct Channel Level',
			description: `Change button styles depending on the temporary direct output level`,
			defaultStyle: {
				bgcolor: red,
				color: white,
			},
			options: [
				{
					type: 'number',
					label: 'Main Level (-40 - 12, mute: -63)',
					id: 'directLevel',
					default: 0,
					tooltip: 'Define the direct output level',
				},
			],
			callback: (feedback) => {
				let opt = feedback.options
				let variableName = `state_level_direct`
				if (self.companionVariables.hasOwnProperty(variableName)) {
					let var_state = self.companionVariables[variableName].value
					if (var_state >= opt.directLevel) {
						return true
					} else {
						return false
					}
				} else {
					self.log('error', `Feedbacks: The variable ${variableName} is not defined in companionVariables`)
					return false
				}
			},
		},
		heartbeatState: {
			type: 'boolean',
			name: 'Check Device Heartbeat',
			description: `Checks every 5 seconds if the device is online`,
			defaultStyle: {
				bgcolor: green,
				color: white,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Heartbeat State',
					id: 'heartbeat',
					default: 1,
					choices: [
						{ id: 0, label: 'Offline' },
						{ id: 1, label: 'Online' },
					],
					minChoicesForSearch: 0,
					tooltip: 'Select the heartbeat state',
				},
			],
			callback: (feedback) => {
				let opt = feedback.options
				let variableName = `state_heartbeat`
				if (self.companionVariables.hasOwnProperty(variableName)) {
					let var_state = self.companionVariables[variableName].value
					if (var_state === opt.heartbeat) {
						return true
					} else {
						return false
					}
				} else {
					self.log('error', `Feedbacks: The variable ${variableName} is not defined in companionVariables`)
					return false
				}
			},
		},
		inputGain: {
			type: 'boolean',
			name: 'Check Input Gain',
			description: `Change button styles depending on a device's input gain`,
			defaultStyle: {
				bgcolor: yellow,
				color: black,
			},
			options: [
				{
					type: 'number',
					label: 'Input Gain',
					id: 'inputGain',
					tooltip: 'Define the input gain (available range depends on source)',
				},
			],
			callback: (feedback) => {
				let opt = feedback.options
				let variableName = `state_audio_gain`
				if (self.companionVariables.hasOwnProperty(variableName)) {
					let var_state = self.companionVariables[variableName].value
					if (var_state === opt.inputGain) {
						return true
					} else {
						return false
					}
				} else {
					self.log('error', `Feedbacks: The variable ${variableName} is not defined in companionVariables`)
					return false
				}
			},
		},
		inputSource: {
			type: 'boolean',
			name: 'Check Input Source',
			description: `Change button styles depending on a device's input source`,
			defaultStyle: {
				bgcolor: red,
				color: white,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Active Input',
					id: 'activeInput',
					default: 4,
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
					tooltip: 'Select input source that should be muted',
				},
			],
			callback: (feedback) => {
				let opt = feedback.options
				let variableName = `state_audio_source`
				if (self.companionVariables.hasOwnProperty(variableName)) {
					let var_state = self.companionVariables[variableName].value
					if (var_state === opt.activeInput) {
						return true
					} else {
						return false
					}
				} else {
					self.log('error', `Feedbacks: The variable ${variableName} is not defined in companionVariables`)
					return false
				}
			},
		},
		isolateState: {
			type: 'boolean',
			name: 'Check Isolate State',
			description: `Change button styles depending on a device's isolate state.`,
			defaultStyle: {
				bgcolor: yellow,
				color: black,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Channel Isolate State',
					id: 'isolateState',
					default: 0,
					choices: [
						{ id: 0, label: 'Idle' },
						{ id: 1, label: 'Isolate' },
					],
					minChoicesForSearch: 0,
					tooltip: 'Select the isolate signal type for your style',
				},
			],
			callback: (feedback) => {
				let opt = feedback.options
				let variableName = `state_mode_isolate`
				if (self.companionVariables.hasOwnProperty(variableName)) {
					let var_state = self.companionVariables[variableName].value
					if (var_state === opt.isolateState) {
						return true
					} else {
						return false
					}
				} else {
					self.log('error', `Feedbacks: The variable ${variableName} is not defined in companionVariables`)
					return false
				}
			},
		},
		listenState: {
			type: 'boolean',
			name: 'Check Listen State',
			description: `Change button styles depending on a channel's listen state.`,
			defaultStyle: {
				bgcolor: red,
				color: white,
			},
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
					label: 'Channel Listen State',
					id: 'listenState',
					default: 0,
					choices: [
						{ id: 0, label: 'Mute' },
						{ id: 1, label: 'Unmute' },
					],
					minChoicesForSearch: 0,
					tooltip: 'Select the listen signal type for your style',
				},
			],
			callback: (feedback) => {
				let opt = feedback.options
				let variableName = `state_listen_ch${opt.chId}`
				if (self.companionVariables.hasOwnProperty(variableName)) {
					let var_state = self.companionVariables[variableName].value
					if (var_state === opt.listenState) {
						return true
					} else {
						return false
					}
				} else {
					self.log('error', `Feedbacks: The variable ${variableName} is not defined in companionVariables`)
					return false
				}
			},
		},
		mainLevel: {
			type: 'boolean',
			name: 'Check Main Level',
			description: `Change button styles depending on the main output level.`,
			defaultStyle: {
				bgcolor: red,
				color: white,
			},
			options: [
				{
					type: 'number',
					label: 'Main Level (-40 - 12, mute: -63)',
					id: 'mainLevel',
					default: 0,
					tooltip: 'Define the main output level',
				},
			],
			callback: (feedback) => {
				let opt = feedback.options
				let variableName = `state_level_main`
				if (self.companionVariables.hasOwnProperty(variableName)) {
					let var_state = self.companionVariables[variableName].value
					if (var_state >= opt.mainLevel) {
						return true
					} else {
						return false
					}
				} else {
					self.log('error', `Feedbacks: The variable ${variableName} is not defined in companionVariables`)
					return false
				}
			},
		},
		pgmLevel: {
			type: 'boolean',
			name: 'Check PGM Level',
			description: `Change button styles depending on the PGM output level.`,
			defaultStyle: {
				bgcolor: red,
				color: white,
			},
			options: [
				{
					type: 'number',
					label: 'PGM Level (-40 - 12, mute: -63)',
					id: 'pgmLevel',
					default: 0,
					tooltip: 'Define the pgm output level',
				},
			],
			callback: (feedback) => {
				let opt = feedback.options
				let variableName = `state_level_pgm`
				if (self.companionVariables.hasOwnProperty(variableName)) {
					let var_state = self.companionVariables[variableName].value
					if (var_state >= opt.pgmLevel) {
						return true
					} else {
						return false
					}
				} else {
					self.log('error', `Feedbacks: The variable ${variableName} is not defined in companionVariables`)
					return false
				}
			},
		},
		talkState: {
			type: 'boolean',
			name: 'Check Talk State',
			description: `Change button styles depending on a channel's talk state.`,
			defaultStyle: {
				bgcolor: green,
				color: black,
			},
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
					label: 'Talk State',
					id: 'talkState',
					tooltip: 'Select the talk state for your style',
					default: 2,
					choices: [
						{ id: 0, label: 'Idle' },
						{ id: 2, label: 'Latch' },
						{ id: 3, label: 'Momentary' },
					],
					minChoicesForSearch: 0,
				},
			],
			callback: (feedback) => {
				let opt = feedback.options
				let variableName = `state_talk_ch` + opt.chId
				if (self.companionVariables.hasOwnProperty(variableName)) {
					let var_state = self.companionVariables[variableName].value
					if (var_state === opt.talkState) {
						return true
					} else {
						return false
					}
				} else {
					self.log('error', `Feedbacks: The variable ${variableName} is not defined in companionVariables`)
					return false
				}
			},
		},
		voxState: {
			type: 'boolean',
			name: 'Check VOX State',
			description: `Change button styles depending on a channel's VOX state (incoming audio).`,
			defaultStyle: {
				bgcolor: yellow,
				color: black,
			},
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
					label: 'Talk State',
					id: 'voxState',
					tooltip: 'Select the VOX state for your style',
					default: 3,
					choices: [
						{ id: 0, label: 'Idle' },
						{ id: 1, label: 'Talk Active' },
						{ id: 3, label: 'VOX Active' },
					],
					minChoicesForSearch: 0,
				},
			],
			callback: (feedback) => {
				let opt = feedback.options
				let variableName = `state_input_vox_ch` + opt.chId
				if (self.companionVariables.hasOwnProperty(variableName)) {
					let var_state = self.companionVariables[variableName].value
					if (var_state === opt.voxState) {
						return true
					} else {
						return false
					}
				} else {
					self.log('error', `Feedbacks: The variable ${variableName} is not defined in companionVariables`)
					return false
				}
			},
		},
		voxStateMuted: {
			type: 'boolean',
			name: 'Check VOX State (Muted)',
			description: `Change button styles depending on a channel's VOX state (incoming audio)`,
			defaultStyle: {
				bgcolor: yellow,
				color: black,
			},
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
					label: 'Talk State',
					id: 'voxState',
					tooltip: 'Select the VOX state for your style',
					default: 3,
					choices: [
						{ id: 0, label: 'Idle' },
						{ id: 1, label: 'Talk Active' },
						{ id: 3, label: 'VOX Active' },
					],
					minChoicesForSearch: 0,
				},
			],
			callback: (feedback) => {
				let opt = feedback.options
				let variableName = `state_input_vox_ch` + opt.chId
				if (self.companionVariables.hasOwnProperty(variableName)) {
					let var_state = self.companionVariables[variableName].value
					let listenVariableName = 'state_listen_ch' + opt.chId
					if (self.companionVariables[listenVariableName].value === 0) {
						if (var_state === opt.voxState) {
							return true
						} else {
							return false
						}
					}
				} else {
					self.log('error', `Feedbacks: The variable ${variableName} is not defined in companionVariables`)
					return false
				}
			},
		},
	})
}
