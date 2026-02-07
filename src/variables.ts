import type { itac_cc } from './main.js'

export function UpdateVariableDefinitions(instance: itac_cc): void {
	const variables = []

	for (let i = 0; i < instance.config.ports; i++) {
		variables.push({
			label: `Port ${i + 1} State`,
			name: `port_${i + 1}_state`,
		})
	}

	instance.setVariableDefinitions(variables)
}

export function CheckVariables(_instance: itac_cc): void {
	try {
		const variableObj = {}

		for (let i = 0; i < this.config.ports; i++) {
			const port = i + 1
			const portObj = this.DATA.find((PORT) => PORT.port == port)
			if (portObj) {
				variableObj[`port_${port}_state`] = portObj.state
			}
		}

		this.setVariableValues(variableObj)
	} catch (error) {
		this.log('error', `Error checking variables: ${error.toString()}`)
	}
}
