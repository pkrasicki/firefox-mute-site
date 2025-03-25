import { storage } from "./storage";
import { mutedDomains } from "./background";

const defaultConfig =
{
	isPersistenceEnabled: false // if true, muted domains will be saved to storage
};

export const settings =
{
	config: null,

	load: async () =>
	{
		settings.config = await storage.loadSettings();
		console.log("config loaded", settings.config);

		if (!settings.config)
		{
			settings.config = {...defaultConfig};
			storage.updateSettings(settings.config);

			const yyy = await storage.loadSettings();
			console.log("config loaded", yyy);
		}
	},

	enablePersistence: () =>
	{
		settings.config.isPersistenceEnabled = true;
		storage.updateSettings(settings.config);
		storage.updateMutedDomains(mutedDomains);
	},

	disablePersistence: () =>
	{
		settings.config.isPersistenceEnabled = false;
		storage.updateSettings(settings.config);
		storage.clearMutedDomains();
	}
};