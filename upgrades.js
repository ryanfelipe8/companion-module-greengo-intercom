module.exports = [
	/*
	 * Place your upgrade scripts here
	 * Remember that once it has been added it cannot be removed!
	 */
	// Upgrade logic for installations using v1.0.0
	function (context, props) {
		const result = {
			updatedConfig: null,
			updatedActions: [],
			updatedFeedbacks: [],
		}
		const config = props.config
		// Convert unsupported device types to a sane default
		if (config) {
			if (config.deviceType === 'SIWR') {
				console.log(
					'Green-GO Module Upgrade: Found and updated unsupported device type in the configuration (SIWR -> SI4WR)'
				)
				config.deviceType = 'SI4WR'
				result.updatedConfig = config
			} else if (config.deviceType === 'INTX') {
				console.log(
					'Green-GO Module Upgrade: Found and updated unsupported device type in the configuration (INTX -> SI4WR)'
				)
				config.deviceType = 'SI4WR'
				result.updatedConfig = config
			}
		}
		return result
	},
]
