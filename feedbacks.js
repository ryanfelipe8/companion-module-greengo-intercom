const { combineRgb } = require('@companion-module/base')
module.exports = function (self) {
	const white = combineRgb(255, 255, 255)
	const red = combineRgb(204, 0, 0)
	const black = combineRgb(0, 0, 0)
	const green = combineRgb(0, 204, 0)
	const yellow = combineRgb(255, 213, 0)
	const orange = combineRgb(255, 102, 0)
	const blue = combineRgb(0, 0, 255)

	self.setFeedbackDefinitions({
		callState: {
			type: 'boolean',
			name: 'Check Outgoing Call Signal',
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
		cueState: {
			type: 'boolean',
			name: 'Check Cue Signal',
			description: `Change button styles depending on a channel's cue signal state.`,
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
					label: 'Cue Signal State',
					id: 'cueState',
					tooltip: 'Select the cue signal type for your style',
					default: 2,
					choices: [
						{ id: 0, label: 'Idle' },
						{ id: 2, label: 'Attention' },
						{ id: 3, label: 'Ready' },
						{ id: 4, label: 'Go' },
					],
					minChoicesForSearch: 0,
				},
			],
			callback: (feedback) => {
				let opt = feedback.options
				let variableName = `state_cue_ch${opt.chId}`
				if (self.companionVariables.hasOwnProperty(variableName)) {
					let var_state = self.companionVariables[variableName].value
					if (var_state === opt.cueState) {
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
		deviceOnline: {
			type: 'boolean',
			name: 'Check For Device Online',
			description: `Checks every 5 seconds if the device is online`,
			defaultStyle: {
				bgcolor: green,
				color: white,
			},
			options: [],
			callback: () => {
				let variableName = `state_heartbeat`
				if (self.companionVariables.hasOwnProperty(variableName)) {
					let var_state = self.companionVariables[variableName].value
					if (var_state === 1) {
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
		deviceOffline: {
			type: 'boolean',
			name: 'Check For Device Offline',
			description: `Checks every 5 seconds if the device is offline`,
			defaultStyle: {
				bgcolor: red,
				color: white,
			},
			options: [],
			callback: () => {
				let variableName = `state_heartbeat`
				if (self.companionVariables.hasOwnProperty(variableName)) {
					let var_state = self.companionVariables[variableName].value
					if (var_state != 1) {
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
			callback: (feedback) => {},
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
			callback: (feedback) => {},
		},
	})
}
