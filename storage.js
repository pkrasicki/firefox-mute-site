export const storage =
{
	loadSettings: async () =>
	{
		try
		{
			const res = await browser.storage.local.get("settings");
			return res.settings;
		} catch (error)
		{
			console.error(`Error while loading settings: ${error}`);
		}
	},

	updateSettings: async (settings) =>
	{
		try
		{
			await browser.storage.local.set({ settings });

		} catch (error)
		{
			console.error(`Error while saving settings: ${error}`);
		}
	},

	loadMutedDomains: async () =>
	{
		try
		{
			const res = await browser.storage.local.get("mutedDomains");
			return res.mutedDomains;
		} catch (error)
		{
			console.error(`Error while loading muted domains: ${error}`);
		}
	},

	updateMutedDomains: async (mutedDomains) =>
	{
		try
		{
			await browser.storage.local.set({ mutedDomains });

		} catch (error)
		{
			console.error(`Error while saving muted domains: ${error}`);
		}
	},

	clearMutedDomains: async () =>
	{
		try
		{
			await browser.storage.local.remove("mutedDomains");

		} catch (error)
		{
			console.error(`Error while clearing muted domains: ${error}`);
		}
	}
};