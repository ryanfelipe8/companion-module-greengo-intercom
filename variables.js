function generateChannelVariables(prefix, count) {
	const variables = []
	for (let i = 1; i <= count; i++) {
		variables.push({
			variableId: `${prefix}_ch${i}`,
			name: `CH${i}: ${prefix.charAt(0).toUpperCase() + prefix.slice(1).replace(/_/g, ' ')}`,
		})
	}
	return variables
}

module.exports = function () {
	let variableDefinitions = []

	// Generate multiple-instance variables
	variableDefinitions = variableDefinitions.concat(generateChannelVariables('state_channel_talk', 32))
	variableDefinitions = variableDefinitions.concat(generateChannelVariables('state_channel_call', 32))
	variableDefinitions = variableDefinitions.concat(generateChannelVariables('state_channel_cue', 32))
	variableDefinitions = variableDefinitions.concat(generateChannelVariables('state_channel_listen', 32))
	variableDefinitions = variableDefinitions.concat(generateChannelVariables('state_channel_listen_mode', 32))
	variableDefinitions = variableDefinitions.concat(generateChannelVariables('state_channel_output', 32))
	variableDefinitions = variableDefinitions.concat(generateChannelVariables('state_channel_level', 32))
	variableDefinitions = variableDefinitions.concat(generateChannelVariables('state_channel_input_vox', 32))
	variableDefinitions = variableDefinitions.concat(generateChannelVariables('state_channel_input_call', 32))

	variableDefinitions.push({ variableId: 'state_audio_gain', name: 'Audio Gain State' })
	variableDefinitions.push({ variableId: 'state_mode_isolate', name: 'Mode Isolate State' })
	variableDefinitions.push({ variableId: 'state_level_main', name: 'Level Main State' })
	variableDefinitions.push({ variableId: 'state_level_main', name: 'Level Main State' })

	return variableDefinitions
}
