const { combineRgb } = require('@companion-module/base')

function UpdatePresets(self) {
	const white = combineRgb(255, 255, 255)
	const red = combineRgb(204, 0, 0)
	const black = combineRgb(0, 0, 0)
	const green = combineRgb(0, 153, 0)
	const yellow = combineRgb(255, 213, 0)
	const orange = combineRgb(255, 102, 0)
	const blue = combineRgb(0, 0, 255)

	const presets = {}
	for (let i = 1; i <= self.config.channels; i++) {
		presets[`talk_ch${i}`] = {
			type: 'button',
			category: 'Channel Talk',
			name: `Set talk state on channel ${i}`,
			style: {
				text: `CH${i}\\nTalk`,
				size: '18',
				color: white,
				bgcolor: black,
			},
			steps: [
				{
					down: [
						{
							// add an action on down press
							actionId: 'channelTalk',
							options: {
								cycle: true,
								chId: i,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'voxState',
					options: {
						chId: i,
						voxState: 3,
					},
					style: {
						color: black,
						bgcolor: yellow,
					},
				},
				{
					feedbackId: 'talkState',
					options: {
						chId: i,
						talkState: 2,
					},
					style: {
						color: white,
						bgcolor: green,
					},
				},
				{
					feedbackId: 'talkState',
					options: {
						chId: i,
						talkState: 3,
					},
					style: {
						color: white,
						bgcolor: green,
					},
				},
			],
		}
		presets[`call_ch${i}`] = {
			type: 'button',
			category: 'Channel Call',
			name: `Set call state on channel ${i}`,
			style: {
				text: `CH${i}\\nCall`,
				size: '18',
				color: white,
				bgcolor: black,
			},
			steps: [
				{
					down: [
						{
							// add an action on down press
							actionId: 'channelCall',
							options: {
								chId: i,
								callType: 1,
							},
						},
					],
					up: [
						{
							// add an action on down press
							actionId: 'channelCall',
							options: {
								chId: i,
								callType: 0,
							},
						},
					],
					2000: {
						options: {
							runWhileHeld: true,
						},
						actions: [
							{
								// add an action on down press
								actionId: 'channelCall',
								options: {
									chId: i,
									callType: 2,
								},
							},
						],
					},
					2001: [
						{
							// add an action on down press
							actionId: 'channelCall',
							options: {
								chId: i,
								callType: 0,
							},
						},
					],
				},
			],
			feedbacks: [
				{
					feedbackId: 'callSendState',
					options: {
						chId: i,
						callState: 1,
					},
					style: {
						color: white,
						bgcolor: red,
					},
				},
				{
					feedbackId: 'callReceiveState',
					options: {
						chId: i,
						callState: 1,
					},
					style: {
						color: white,
						bgcolor: red,
					},
				},
				{
					feedbackId: 'callSendState',
					options: {
						chId: i,
						callState: 2,
					},
					style: {
						color: red,
						bgcolor: white,
					},
				},
				{
					feedbackId: 'callReceiveState',
					options: {
						chId: i,
						callState: 2,
					},
					style: {
						color: red,
						bgcolor: white,
					},
				},
			],
		}
		presets[`cue_ch${i}`] = {
			type: 'button',
			category: 'Channel Cue',
			name: `Set cue state on channel ${i}`,
			style: {
				text: `CH${i}\\nCue`,
				size: '18',
				color: white,
				bgcolor: black,
			},
			steps: [
				{
					down: [
						{
							// add an action on down press
							actionId: 'channelCue',
							options: {
								cycle: true,
								chId: i,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'cueState',
					options: {
						chId: i,
						cueState: 2,
					},
					style: {
						color: black,
						bgcolor: yellow,
					},
				},
				{
					feedbackId: 'cueState',
					options: {
						chId: i,
						cueState: 3,
					},
					style: {
						color: white,
						bgcolor: orange,
					},
				},
				{
					feedbackId: 'cueState',
					options: {
						chId: i,
						cueState: 4,
					},
					style: {
						color: white,
						bgcolor: green,
					},
				},
			],
		}
		presets[`listen_ch${i}`] = {
			type: 'button',
			category: 'Channel Listen',
			name: `Set listen state on channel ${i}`,
			style: {
				text: `CH${i}\\nListen`,
				size: '18',
				color: white,
				bgcolor: black,
			},
			steps: [
				{
					down: [
						{
							// add an action on down press
							actionId: 'channelListen',
							options: {
								cycle: true,
								chId: i,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'voxState',
					options: {
						chId: i,
						voxState: 3,
					},
					style: {
						color: black,
						bgcolor: yellow,
					},
				},
				{
					feedbackId: 'listenState',
					options: {
						chId: i,
						listenState: 0,
					},
					style: {
						color: white,
						bgcolor: red,
						text: 'CH1\\nMuted',
					},
				},
				{
					feedbackId: 'voxStateMuted',
					options: {
						chId: i,
						voxState: 3,
					},
					style: {
						color: yellow,
						bgcolor: red,
						text: 'CH1\\nMuted',
					},
				},
			],
		}
		presets[`level_ch${i}_up`] = {
			type: 'button',
			category: 'Channel Level',
			name: `Increase output level of channel ${i}`,
			style: {
				text: `CH${i} ⬆️\\n$(GGO_Device:state_level_ch${i}) dB`,
				size: '18',
				color: white,
				bgcolor: black,
			},
			steps: [
				{
					down: [
						{
							// add an action on down press
							actionId: 'channelLevel',
							options: {
								cycle: true,
								chId: i,
								stepSize: 3,
							},
						},
					],
					up: [],
					// Add duration group to unmute the channel
					1000: {
						options: {
							runWhileHeld: true,
						},
						actions: [
							{
								// add an action on down press
								actionId: 'channelListen',
								options: {
									chId: i,
									listenState: 1,
								},
							},
						],
					},
				},
			],
			feedbacks: [
				{
					feedbackId: 'channelLevel',
					options: {
						chId: i,
						channelLevel: -40,
					},
					style: {
						color: black,
						bgcolor: yellow,
					},
				},
				{
					feedbackId: 'channelLevel',
					options: {
						chId: i,
						channelLevel: -20,
					},
					style: {
						color: white,
						bgcolor: green,
					},
				},
				{
					feedbackId: 'channelLevel',
					options: {
						chId: i,
						channelLevel: 1,
					},
					style: {
						color: white,
						bgcolor: orange,
					},
				},
				{
					feedbackId: 'listenState',
					options: {
						chId: i,
						listenState: 0,
					},
					style: {
						color: white,
						bgcolor: red,
					},
				},
			],
		}
		presets[`level_ch${i}_down`] = {
			type: 'button',
			category: 'Channel Level',
			name: `Decrease output level of channel ${i}`,
			style: {
				text: `CH${i} ⬇️\\n$(GGO_Device:state_level_ch${i}) dB`,
				size: '18',
				color: white,
				bgcolor: black,
			},
			steps: [
				{
					down: [
						{
							// add an action on down press
							actionId: 'channelLevel',
							options: {
								cycle: true,
								chId: i,
								stepSize: -3,
							},
						},
					],
					up: [],
					// Add duration group to unmute the channel
					1000: {
						options: {
							runWhileHeld: true,
						},
						actions: [
							{
								// add an action on down press
								actionId: 'channelListen',
								options: {
									chId: i,
									listenState: 0,
								},
							},
						],
					},
				},
			],
			feedbacks: [
				{
					feedbackId: 'channelLevel',
					options: {
						chId: i,
						channelLevel: -40,
					},
					style: {
						color: black,
						bgcolor: yellow,
					},
				},
				{
					feedbackId: 'channelLevel',
					options: {
						chId: i,
						channelLevel: -20,
					},
					style: {
						color: white,
						bgcolor: green,
					},
				},
				{
					feedbackId: 'channelLevel',
					options: {
						chId: i,
						channelLevel: 1,
					},
					style: {
						color: white,
						bgcolor: orange,
					},
				},
				{
					feedbackId: 'listenState',
					options: {
						chId: i,
						listenState: 0,
					},
					style: {
						color: white,
						bgcolor: red,
					},
				},
			],
		}
	}
	presets[`audio_gain_up`] = {
		type: 'button',
		category: 'Audio Controls',
		name: `Increase input gain`,
		style: {
			text: `Gain ⬆️\\n$(GGO_Device:state_audio_gain) dB`,
			size: '18',
			color: white,
			bgcolor: black,
		},
		steps: [
			{
				down: [
					{
						// add an action on down press
						actionId: 'inputGain',
						options: {
							cycle: true,
							stepSize: 2,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'inputSource',
				options: {
					activeInput: 4,
				},
				style: {
					color: white,
					bgcolor: red,
					text: `Gain ⬆️\\nMuted`,
				},
			},
		],
	}
	presets[`audio_gain_down`] = {
		type: 'button',
		category: 'Audio Controls',
		name: `Decrease input gain`,
		style: {
			text: `Gain ⬇️\\n$(GGO_Device:state_audio_gain) dB`,
			size: '18',
			color: white,
			bgcolor: black,
		},
		steps: [
			{
				down: [
					{
						// add an action on down press
						actionId: 'inputGain',
						options: {
							cycle: true,
							stepSize: -2,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'inputSource',
				options: {
					activeInput: 4,
				},
				style: {
					color: white,
					bgcolor: red,
					text: `Gain ⬇️\\nMuted`,
				},
			},
		],
	}
	presets[`pgm_level_up`] = {
		type: 'button',
		category: 'Special Channels',
		name: `Increase PGM output level`,
		style: {
			text: `PGM ⬆️\\n$(GGO_Device:state_level_pgm) dB`,
			size: '18',
			color: white,
			bgcolor: black,
		},
		steps: [
			{
				down: [
					{
						// add an action on down press
						actionId: 'pgmLevel',
						options: {
							cycle: true,
							stepSize: 3,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'pgmLevel',
				options: {
					pgmLevel: -63,
				},
				style: {
					color: white,
					bgcolor: red,
					text: `PGM ⬆️\\nMuted`,
				},
			},
			{
				feedbackId: 'pgmLevel',
				options: {
					pgmLevel: -40,
				},
				style: {
					color: black,
					bgcolor: yellow,
					text: `PGM ⬆️\\n$(GGO_Device:state_level_pgm) dB`,
				},
			},
			{
				feedbackId: 'pgmLevel',
				options: {
					pgmLevel: -20,
				},
				style: {
					color: white,
					bgcolor: green,
				},
			},
			{
				feedbackId: 'pgmLevel',
				options: {
					pgmLevel: 1,
				},
				style: {
					color: white,
					bgcolor: orange,
				},
			},
		],
	}
	presets[`pgm_level_down`] = {
		type: 'button',
		category: 'Special Channels',
		name: `Decrease PGM output level`,
		style: {
			text: `PGM ⬇️\\n$(GGO_Device:state_level_pgm) dB`,
			size: '18',
			color: white,
			bgcolor: black,
		},
		steps: [
			{
				down: [
					{
						// add an action on down press
						actionId: 'pgmLevel',
						options: {
							cycle: true,
							stepSize: -3,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'pgmLevel',
				options: {
					pgmLevel: -63,
				},
				style: {
					color: white,
					bgcolor: red,
					text: `PGM ⬇️\\nMuted`,
				},
			},
			{
				feedbackId: 'pgmLevel',
				options: {
					pgmLevel: -40,
				},
				style: {
					color: black,
					bgcolor: yellow,
					text: `PGM ⬇️\\n$(GGO_Device:state_level_pgm) dB`,
				},
			},
			{
				feedbackId: 'pgmLevel',
				options: {
					pgmLevel: -20,
				},
				style: {
					color: white,
					bgcolor: green,
				},
			},
			{
				feedbackId: 'pgmLevel',
				options: {
					pgmLevel: 1,
				},
				style: {
					color: white,
					bgcolor: orange,
				},
			},
		],
	}
	presets[`direct_level_up`] = {
		type: 'button',
		category: 'Special Channels',
		name: `Increase direct channel output level`,
		style: {
			text: `Direct ⬆️\\n$(GGO_Device:state_level_pgm) dB`,
			size: '18',
			color: white,
			bgcolor: black,
		},
		steps: [
			{
				down: [
					{
						// add an action on down press
						actionId: 'directLevel',
						options: {
							cycle: true,
							stepSize: 3,
						},
					},
				],
				up: [],
				// Add duration group to unmute the channel
				1000: {
					options: {
						runWhileHeld: true,
					},
					actions: [
						{
							// add an action on down press
							actionId: 'directLevel',
							options: {
								directLevel: 0,
							},
						},
					],
				},
			},
		],
		feedbacks: [
			{
				feedbackId: 'directLevel',
				options: {
					directLevel: -63,
				},
				style: {
					color: white,
					bgcolor: red,
					text: `Direct ⬆️\\nMuted`,
				},
			},
			{
				feedbackId: 'directLevel',
				options: {
					directLevel: -40,
				},
				style: {
					color: black,
					bgcolor: yellow,
					text: `Direct ⬆️\\n$(GGO_Device:state_level_direct) dB`,
				},
			},
			{
				feedbackId: 'directLevel',
				options: {
					directLevel: -20,
				},
				style: {
					color: white,
					bgcolor: green,
				},
			},
			{
				feedbackId: 'directLevel',
				options: {
					directLevel: 1,
				},
				style: {
					color: white,
					bgcolor: orange,
				},
			},
		],
	}
	presets[`direct_level_down`] = {
		type: 'button',
		category: 'Special Channels',
		name: `Decrease direct channel output level`,
		style: {
			text: `Direct ⬇️\\n$(GGO_Device:state_level_pgm) dB`,
			size: '18',
			color: white,
			bgcolor: black,
		},
		steps: [
			{
				down: [
					{
						// add an action on down press
						actionId: 'directLevel',
						options: {
							cycle: true,
							stepSize: -3,
						},
					},
				],
				up: [],
				// Add duration group to mute the channel
				1000: {
					options: {
						runWhileHeld: true,
					},
					actions: [
						{
							// add an action on down press
							actionId: 'directLevel',
							options: {
								directLevel: -63,
							},
						},
					],
				},
			},
		],
		feedbacks: [
			{
				feedbackId: 'directLevel',
				options: {
					directLevel: -63,
				},
				style: {
					color: white,
					bgcolor: red,
					text: `Direct ⬇️\\nMuted`,
				},
			},
			{
				feedbackId: 'directLevel',
				options: {
					directLevel: -40,
				},
				style: {
					color: black,
					bgcolor: yellow,
					text: `Direct ⬇️\\n$(GGO_Device:state_level_direct) dB`,
				},
			},
			{
				feedbackId: 'directLevel',
				options: {
					directLevel: -20,
				},
				style: {
					color: white,
					bgcolor: green,
				},
			},
			{
				feedbackId: 'directLevel',
				options: {
					directLevel: 1,
				},
				style: {
					color: white,
					bgcolor: orange,
				},
			},
		],
	}
	presets[`cough_mute`] = {
		type: 'button',
		category: 'Audio Controls',
		name: `Temporarily mute the microphone`,
		style: {
			text: `Cough\\nMute`,
			size: '18',
			color: white,
			bgcolor: black,
		},
		steps: [
			{
				down: [
					{
						// add an action on down press
						actionId: 'inputSource',
						options: {
							activeInput: 4,
						},
					},
				],
				up: [
					{
						// add an action on down press
						actionId: 'inputSource',
						options: {
							activeInput: 0,
						},
					},
				],
			},
		],
		feedbacks: [
			{
				feedbackId: 'inputSource',
				options: {
					activeInput: 4,
				},
				style: {
					color: white,
					bgcolor: blue,
				},
			},
		],
	}
	presets[`isolate_mode`] = {
		type: 'button',
		category: 'Audio Controls',
		name: `Set the isolate mode`,
		style: {
			text: `Isolate`,
			size: '18',
			color: white,
			bgcolor: black,
		},
		steps: [
			{
				down: [
					{
						// add an action on down press
						actionId: 'modeIsolate',
						options: {
							cycle: true,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'isolateState',
				options: {
					isolateState: 1,
				},
				style: {
					color: black,
					bgcolor: yellow,
					text: 'Isolate\\nActive',
				},
			},
		],
	}
	presets[`device_identify`] = {
		type: 'button',
		category: 'Others',
		name: `Identify the device`,
		style: {
			text: `Identify`,
			size: '18',
			color: white,
			bgcolor: black,
		},
		steps: [
			{
				down: [
					{
						// add an action on down press
						actionId: 'identifyDevice',
						options: {
							identifyState: 1,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`device_heartbeat`] = {
		type: 'button',
		category: 'Others',
		name: `Device connection indicator`,
		style: {
			text: `Device Status`,
			size: '18',
			color: white,
			bgcolor: black,
		},
		steps: [
			{
				down: [],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'heartbeatState',
				options: {
					heartbeat: 1,
				},
				style: {
					color: white,
					bgcolor: green,
					text: 'Device\\nOnline',
				},
			},
			{
				feedbackId: 'heartbeatState',
				options: {
					heartbeat: 0,
				},
				style: {
					color: white,
					bgcolor: red,
					text: 'Device\\nOffline',
				},
			},
			{
				feedbackId: 'heartbeatState',
				options: {
					heartbeat: -1,
				},
				style: {
					color: white,
					bgcolor: blue,
					text: 'Device\\nMissing',
				},
			},
		],
	}
	self.setPresetDefinitions(presets)
}

module.exports = UpdatePresets
