import type { itac_cc } from './main.js'
import { CompanionPresetDefinitions } from '@companion-module/base'

export function UpdatePresets(instance: itac_cc): void {
	const presets: CompanionPresetDefinitions = {}

	for (let i = 1; i <= instance.config.ports; i++) {
		presets[i + 'close'] = {
			type: 'button',
			category: `Port ${i}`,
			name: 'Close',
			style: {
				text: `PORT ${i}\\nCLOSE`,
				size: '14',
				color: 16777215,
				bgcolor: 0,
			},
			steps: [
				{
					down: [
						{
							actionId: 'portSet',
							options: {
								portNum: i.toString(),
								setPort: '1',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets[i + 'open'] = {
			type: 'button',
			category: `Port ${i}`,
			name: 'Open',
			style: {
				text: `PORT ${i}\\nOPEN`,
				size: '14',
				color: 16777215,
				bgcolor: 0,
			},
			steps: [
				{
					down: [
						{
							actionId: 'portSet',
							options: {
								portNum: i.toString(),
								setPort: '0',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}
	}

	instance.setPresetDefinitions(presets)
}
