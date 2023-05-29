module.exports = function (module, existingVariables = {}) {
	let companionVariables = { ...existingVariables }
	function defineVariables() {
		function addVariable(variable) {
			// module.log('info', `Checking a variable: ${JSON.stringify(variable)} it it is missing`)
			if (companionVariables[variable.variableId] == undefined) {
				const initialValue = variable.variableId.includes('level') || variable.variableId.includes('gain') ? -99 : -1
				companionVariables[variable.variableId] = {
					name: variable.name,
					value: initialValue,
				}
				module.log('debug', `Variable ${variable.variableId} not found: Defining and initializing it now`)
			}
		}
		// Generate variables for channels
		for (let i = 1; i <= 12; i++) {
			const channelVariables = [
				{ variableId: `state_talk_ch${i}`, name: `Talk State (CH${i})` },
				{ variableId: `state_call_ch${i}`, name: `Call State (CH${i})` },
				{ variableId: `state_cue_ch${i}`, name: `Cue State (CH${i})` },
				{ variableId: `state_listen_ch${i}`, name: `Listen State (CH${i})` },
				{ variableId: `state_level_ch${i}`, name: `Level (CH${i})` },
				{ variableId: `state_input_vox_ch${i}`, name: `Input VOX State (CH${i})` },
				{ variableId: `state_input_call_ch${i}`, name: `Input Call State (CH${i})` },
			]
			channelVariables.forEach(addVariable)
		}
		// Define user specific variables
		const deviceVariables = [
			{ variableId: 'state_audio_gain', name: 'Input Gain State' },
			{ variableId: 'state_mode_isolate', name: 'Isolate State' },
			{ variableId: 'state_level_main', name: 'Main Level' },
			{ variableId: 'state_level_pgm', name: 'PGM Level' },
			{ variableId: 'state_level_direct', name: 'Direct Channel Level' },
			{ variableId: 'state_level_announce', name: 'Announce Level' },
			{ variableId: 'state_level_emergency', name: 'Emergency Level' },
		]
		deviceVariables.forEach(addVariable)
		// MCXD specific variables
		if (module.config.deviceType == '2') {
			const mcxVariables = [
				{ variableId: 'state_level_headset', name: 'Headset Level (MCX)' },
				{ variableId: 'state_level_lineout', name: 'Line-Out Level (MCX)' },
				{ variableId: 'state_level_speaker', name: 'Speaker Level (MCX)' },
				{ variableId: 'state_mode_screen', name: 'Screen Mode (MCX)' },
			]
			mcxVariables.forEach(addVariable)
		}
		// WPX specific variables
		if (module.config.deviceType == '3') {
			const wpxVariables = [
				{ variableId: 'state_level_headset', name: 'Headset Level (WPX)' },
				{ variableId: 'state_level_speaker', name: 'Speaker Level (WPX)' },
				{ variableId: 'state_mode_screen', name: 'Screen Mode (WPX)' },
			]
			wpxVariables.forEach(addVariable)
		}
		const variableDefinitions = Object.entries(companionVariables).map(([variableId, { name }]) => ({
			variableId,
			name,
		}))
		module.setVariableDefinitions(variableDefinitions)
	}

	function setInitialValues() {
		const variableValues = Object.fromEntries(
			Object.entries(companionVariables).map(([variableId, { value }]) => [variableId, value])
		)

		// Set initial variable values
		module.setVariableValues(variableValues)
	}

	function deleteUnusedVariables() {
		// Get the current device type
		const deviceType = module.config.deviceType

		// Iterate over each variable in companionVariables
		for (const variableId in companionVariables) {
			// If the variable name is specific to a device type and doesn't match the current one, delete it
			if (
				(companionVariables[variableId].name.includes('MCX') && deviceType != '2') ||
				(companionVariables[variableId].name.includes('WPX') && deviceType != '3')
			) {
				delete companionVariables[variableId]
				module.log(
					'debug',
					`Removed variable ${companionVariables.variableId} as it is not in use by the current device type`
				)
			}
		}
	}

	deleteUnusedVariables()
	defineVariables()
	setInitialValues()

	module.log('info', JSON.stringify(companionVariables.state_channel_talk_ch1))

	return {
		companionVariables,
	}
}
