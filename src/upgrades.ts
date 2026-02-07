import type {
	CompanionStaticUpgradeScript,
	CompanionUpgradeContext,
	CompanionMigrationAction,
	CompanionMigrationFeedback,
	CompanionStaticUpgradeResult,
} from '@companion-module/base'
import type { ModuleConfig } from './config.js'

export const UpgradeScripts: CompanionStaticUpgradeScript<ModuleConfig>[] = [
	function (
		_context: CompanionUpgradeContext<ModuleConfig>,
		_props: { config: any; actions: CompanionMigrationAction[]; feedbacks: CompanionMigrationFeedback[] },
	): CompanionStaticUpgradeResult<ModuleConfig> {
		return {
			updatedConfig: null,
			updatedActions: [],
			updatedFeedbacks: [],
		}
	},
]
