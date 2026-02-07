import {
	InstanceBase,
	runEntrypoint,
	InstanceStatus,
	SomeCompanionConfigField,
	TCPHelper,
} from '@companion-module/base'
import { GetConfigFields, type ModuleConfig } from './config.js'
import { UpdateVariableDefinitions } from './variables.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'
import { UpdatePresets } from './presets.js'
import { initTCP } from './utils.js'

export class itac_cc extends InstanceBase<ModuleConfig> {
	config!: ModuleConfig
	socket!: TCPHelper
	pollTimer: NodeJS.Timeout

	CHOICES_PORTS: { id: string; label: string }[] = [
		{ id: '1', label: 'Port 1' },
		{ id: '2', label: 'Port 2' },
		{ id: '3', label: 'Port 3' },
		{ id: '4', label: 'Port 4' },
		{ id: '5', label: 'Port 5' },
		{ id: '6', label: 'Port 6' },
	]
	DATA: { port: string; state: string }[] = [
		{ port: '1', state: '0' },
		{ port: '2', state: '0' },
		{ port: '3', state: '0' },
		{ port: '4', state: '0' },
		{ port: '5', state: '0' },
		{ port: '6', state: '0' },
	]

	constructor(internal: unknown) {
		super(internal)
	}

	async destroy(): Promise<void> {
		if (this.socket !== undefined) {
			this.socket.destroy()
		}

		if (this.pollTimer !== undefined) {
			clearInterval(this.pollTimer)
			delete this.pollTimer
		}
	}

	async init(config: ModuleConfig): Promise<void> {
		this.updateStatus(InstanceStatus.Connecting)
		void (await this.configUpdated(config))
	}

	async configUpdated(config: ModuleConfig): Promise<void> {
		// polling is running and polling has been de-selected by config change
		if (this.pollTimer !== undefined) {
			clearInterval(this.pollTimer)
			delete this.pollTimer
		}
		this.config = config

		this.CHOICES_PORTS = []
		for (let i = 1; i <= this.config.ports; i++) {
			this.CHOICES_PORTS.push({ id: i.toString(), label: `Port ${i.toString()}` })
		}

		this.updateActions()
		this.updateFeedbacks()
		this.updateVariableDefinitions()
		this.updatePresets()

		initTCP(this)
	}

	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	updateActions(): void {
		UpdateActions(this)
	}

	updateFeedbacks(): void {
		UpdateFeedbacks(this)
	}

	updatePresets(): void {
		UpdatePresets(this)
	}

	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
	}
}

runEntrypoint(itac_cc, UpgradeScripts)
