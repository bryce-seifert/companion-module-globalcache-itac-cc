import type { itac_cc } from './main.js'
import { sendCommand } from './utils.js'
export function UpdateActions(instance: itac_cc): void {
	instance.setActionDefinitions({
		portSet: {
			name: 'Choose port and state',
			options: [
				{
					type: 'dropdown',
					label: 'Choose Port',
					id: 'portNum',
					default: instance.CHOICES_PORTS[0].id,
					choices: instance.CHOICES_PORTS,
				},
				{
					type: 'dropdown',
					label: 'Set On or Off',
					id: 'setPort',
					default: '1',
					choices: [
						{ id: '1', label: 'Turn On (Close)' },
						{ id: '0', label: 'Turn Off (Open)' },
					],
				},
			],
			callback: async (event) => {
				const opt = event.options
				const cmd = `setstate,1:${(opt.portNum as string).replace(',', '')},${opt.setPort}`
				sendCommand(instance, cmd)
			},
		},
	})
}
