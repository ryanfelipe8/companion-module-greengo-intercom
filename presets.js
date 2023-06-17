const { combineRgb } = require('@companion-module/base')

module.exports = function (self) {
	const white = combineRgb(255, 255, 255)
	const red = combineRgb(204, 0, 0)
	const black = combineRgb(0, 0, 0)
	const green = combineRgb(0, 153, 0)
	const yellow = combineRgb(255, 213, 0)
	const orange = combineRgb(255, 102, 0)
	const blue = combineRgb(0, 0, 255)

	const presetsForDeviceType = (deviceType) => {
		// Definition of commonly available button presets across device types
		const defaultPresets = {}
		for (let i = 1; i <= self.config.channels; i++) {
			defaultPresets[`talk_ch${i}`] = {
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
								actionId: 'channelTalk',
								options: {
									cycle: true,
									chId: i,
								},
							},
						],
						up: [],
						// Add duration group to simulate latch/mom behavior
						350: [
							{
								actionId: 'channelTalk',
								options: {
									cycle: false,
									chId: i,
									talkState: 0,
								},
							},
						],
					},
				],
				feedbacks: [
					{
						feedbackId: 'talkState',
						options: {
							chId: i,
							talkState: 2,
						},
						style: {
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
							bgcolor: green,
						},
					},
					{
						feedbackId: 'channelState',
						options: {
							chId: i,
							channelState: 3,
						},
						style: {
							color: yellow,
						},
					},
				],
			}
			defaultPresets[`call_ch${i}`] = {
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
								actionId: 'channelCall',
								options: {
									chId: i,
									callState: 1,
								},
							},
						],
						up: [
							{
								actionId: 'channelCall',
								options: {
									chId: i,
									callState: 0,
								},
							},
						],
						// Add a 2000ms duration group with the runWhileHeld property set
						2000: {
							options: {
								runWhileHeld: true,
							},
							actions: [
								{
									actionId: 'channelCall',
									options: {
										chId: i,
										callState: 2,
									},
								},
							],
						},
						2001: [
							{
								actionId: 'channelCall',
								options: {
									chId: i,
									callState: 0,
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
			defaultPresets[`cue_ch${i}`] = {
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
							text: `CH${i}\\nATT`,
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
							text: `CH${i}\\nRDY`,
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
							text: `CH${i}\\nGO`,
						},
					},
				],
			}
			defaultPresets[`listen_ch${i}`] = {
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
						feedbackId: 'channelState',
						options: {
							chId: i,
							channelState: 3,
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
							text: `CH${i}\\nMuted`,
						},
					},
					{
						feedbackId: 'voxStateMuted',
						options: {
							chId: i,
						},
						style: {
							color: yellow,
							bgcolor: red,
							text: `CH${i}\\nMuted`,
						},
					},
				],
			}
			defaultPresets[`level_ch${i}_up`] = {
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
								actionId: 'channelLevel',
								options: {
									cycle: true,
									chId: i,
									stepSize: 3,
								},
							},
						],
						up: [],
						1000: {
							options: {
								runWhileHeld: true,
							},
							actions: [
								{
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
							color: yellow,
							bgcolor: black,
						},
					},
					{
						feedbackId: 'channelLevel',
						options: {
							chId: i,
							channelLevel: -17,
						},
						style: {
							color: green,
							bgcolor: black,
						},
					},
					{
						feedbackId: 'channelLevel',
						options: {
							chId: i,
							channelLevel: 3,
						},
						style: {
							color: orange,
							bgcolor: black,
						},
					},
					{
						feedbackId: 'channelLevel',
						options: {
							chId: i,
							channelLevel: 8,
						},
						style: {
							color: red,
							bgcolor: black,
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
			defaultPresets[`level_ch${i}_down`] = {
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
								actionId: 'channelLevel',
								options: {
									cycle: true,
									chId: i,
									stepSize: -3,
								},
							},
						],
						up: [],
						1000: {
							options: {
								runWhileHeld: true,
							},
							actions: [
								{
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
							color: yellow,
							bgcolor: black,
						},
					},
					{
						feedbackId: 'channelLevel',
						options: {
							chId: i,
							channelLevel: -17,
						},
						style: {
							color: green,
							bgcolor: black,
						},
					},
					{
						feedbackId: 'channelLevel',
						options: {
							chId: i,
							channelLevel: 3,
						},
						style: {
							color: orange,
							bgcolor: black,
						},
					},
					{
						feedbackId: 'channelLevel',
						options: {
							chId: i,
							channelLevel: 8,
						},
						style: {
							color: red,
							bgcolor: black,
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
		defaultPresets[`audio_gain_up`] = {
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
		defaultPresets[`audio_gain_down`] = {
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
		defaultPresets[`main_level_up`] = {
			type: 'button',
			category: 'Audio Controls',
			name: `Increase Main output level`,
			style: {
				text: `Main ⬆️\\n$(GGO_Device:state_level_main) dB`,
				size: '18',
				color: white,
				bgcolor: black,
			},
			steps: [
				{
					down: [
						{
							actionId: 'mainLevel',
							options: {
								cycle: true,
								stepSize: 3,
							},
						},
					],
					up: [],
					1000: {
						options: {
							runWhileHeld: true,
						},
						actions: [
							{
								actionId: 'mainLevel',
								options: {
									mainLevel: 0,
								},
							},
						],
					},
				},
			],
			feedbacks: [
				{
					feedbackId: 'mainLevel',
					options: {
						mainLevel: -63,
					},
					style: {
						color: white,
						bgcolor: red,
						text: `Main ⬆️\\nMuted`,
					},
				},
				{
					feedbackId: 'mainLevel',
					options: {
						mainLevel: -40,
					},
					style: {
						color: yellow,
						bgcolor: black,
						text: `Main ⬆️\\n$(GGO_Device:state_level_main) dB`,
					},
				},
				{
					feedbackId: 'mainLevel',
					options: {
						mainLevel: -17,
					},
					style: {
						color: green,
						bgcolor: black,
					},
				},
				{
					feedbackId: 'mainLevel',
					options: {
						mainLevel: 3,
					},
					style: {
						color: orange,
						bgcolor: black,
					},
				},
				{
					feedbackId: 'mainLevel',
					options: {
						mainLevel: 8,
					},
					style: {
						color: red,
						bgcolor: black,
					},
				},
			],
		}
		defaultPresets[`main_level_down`] = {
			type: 'button',
			category: 'Audio Controls',
			name: `Decrease Main output level`,
			style: {
				text: `Main ⬇️\\n$(GGO_Device:state_level_main) dB`,
				size: '18',
				color: white,
				bgcolor: black,
			},
			steps: [
				{
					down: [
						{
							actionId: 'mainLevel',
							options: {
								cycle: true,
								stepSize: -3,
							},
						},
					],
					up: [],
					1000: {
						options: {
							runWhileHeld: true,
						},
						actions: [
							{
								actionId: 'mainLevel',
								options: {
									mainLevel: -63,
								},
							},
						],
					},
				},
			],
			feedbacks: [
				{
					feedbackId: 'mainLevel',
					options: {
						mainLevel: -63,
					},
					style: {
						color: white,
						bgcolor: red,
						text: `Main ⬇️\\nMuted`,
					},
				},
				{
					feedbackId: 'mainLevel',
					options: {
						mainLevel: -40,
					},
					style: {
						color: yellow,
						bgcolor: black,
						text: `Main ⬇️\\n$(GGO_Device:state_level_main) dB`,
					},
				},
				{
					feedbackId: 'mainLevel',
					options: {
						mainLevel: -17,
					},
					style: {
						color: green,
						bgcolor: black,
					},
				},
				{
					feedbackId: 'mainLevel',
					options: {
						mainLevel: 3,
					},
					style: {
						color: orange,
						bgcolor: black,
					},
				},
				{
					feedbackId: 'mainLevel',
					options: {
						mainLevel: 8,
					},
					style: {
						color: red,
						bgcolor: black,
					},
				},
			],
		}
		defaultPresets[`pgm_level_up`] = {
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
							actionId: 'pgmLevel',
							options: {
								cycle: true,
								stepSize: 3,
							},
						},
					],
					up: [],
					1000: {
						options: {
							runWhileHeld: true,
						},
						actions: [
							{
								actionId: 'pgmLevel',
								options: {
									pgmLevel: 0,
								},
							},
						],
					},
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
						color: yellow,
						bgcolor: black,
						text: `PGM ⬆️\\n$(GGO_Device:state_level_pgm) dB`,
					},
				},
				{
					feedbackId: 'pgmLevel',
					options: {
						pgmLevel: -17,
					},
					style: {
						color: green,
						bgcolor: black,
					},
				},
				{
					feedbackId: 'pgmLevel',
					options: {
						pgmLevel: 3,
					},
					style: {
						color: orange,
						bgcolor: black,
					},
				},
				{
					feedbackId: 'pgmLevel',
					options: {
						pgmLevel: 8,
					},
					style: {
						color: red,
						bgcolor: black,
					},
				},
			],
		}
		defaultPresets[`pgm_level_down`] = {
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
							actionId: 'pgmLevel',
							options: {
								cycle: true,
								stepSize: -3,
							},
						},
					],
					up: [],
					1000: {
						options: {
							runWhileHeld: true,
						},
						actions: [
							{
								actionId: 'pgmLevel',
								options: {
									pgmLevel: -63,
								},
							},
						],
					},
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
						color: yellow,
						bgcolor: black,
						text: `PGM ⬇️\\n$(GGO_Device:state_level_pgm) dB`,
					},
				},
				{
					feedbackId: 'pgmLevel',
					options: {
						pgmLevel: -17,
					},
					style: {
						color: green,
						bgcolor: black,
					},
				},
				{
					feedbackId: 'pgmLevel',
					options: {
						pgmLevel: 3,
					},
					style: {
						color: orange,
						bgcolor: black,
					},
				},
				{
					feedbackId: 'pgmLevel',
					options: {
						pgmLevel: 8,
					},
					style: {
						color: red,
						bgcolor: black,
					},
				},
			],
		}
		defaultPresets[`direct_level_up`] = {
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
						color: yellow,
						bgcolor: black,
						text: `Direct ⬆️\\n$(GGO_Device:state_level_direct) dB`,
					},
				},
				{
					feedbackId: 'directLevel',
					options: {
						directLevel: -17,
					},
					style: {
						color: green,
						bgcolor: black,
					},
				},
				{
					feedbackId: 'directLevel',
					options: {
						directLevel: 3,
					},
					style: {
						color: orange,
						bgcolor: black,
					},
				},
				{
					feedbackId: 'mainLevel',
					options: {
						directLevel: 8,
					},
					style: {
						color: red,
						bgcolor: black,
					},
				},
			],
		}
		defaultPresets[`direct_level_down`] = {
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
						color: yellow,
						bgcolor: black,
						text: `Direct ⬇️\\n$(GGO_Device:state_level_direct) dB`,
					},
				},
				{
					feedbackId: 'directLevel',
					options: {
						directLevel: -17,
					},
					style: {
						color: green,
						bgcolor: black,
					},
				},
				{
					feedbackId: 'directLevel',
					options: {
						directLevel: 3,
					},
					style: {
						color: orange,
						bgcolor: black,
					},
				},
				{
					feedbackId: 'mainLevel',
					options: {
						directLevel: 8,
					},
					style: {
						color: red,
						bgcolor: black,
					},
				},
			],
		}
		defaultPresets[`isolate_mode`] = {
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
		defaultPresets[`device_identify`] = {
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
		defaultPresets[`device_heartbeat`] = {
			type: 'button',
			category: 'Others',
			name: `Device connection indicator`,
			style: {
				text: `Device Status`,
				size: 'auto',
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
						text: `${self.config.deviceType}\\nOnline`,
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
						text: `${self.config.deviceType}\\nOffline`,
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
						text: `${self.config.deviceType}\\nMissing`,
					},
				},
			],
		}
		// Definitions of device specific button presets
		switch (deviceType) {
			case 'BPX':
			case 'MCX':
			case 'WPX':
				const devicePresets = {
					...defaultPresets,
					[`cough_mute`]: {
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
										actionId: 'inputSource',
										options: {
											activeInput: 4,
										},
									},
								],
								up: [
									{
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
					},
				}
				return devicePresets
			default:
				return defaultPresets
		}
	}

	const deviceType = self.config.deviceType
	const presets = presetsForDeviceType(deviceType)
	self.setPresetDefinitions(presets)
}
