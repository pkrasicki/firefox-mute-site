import {
	MUTE_ICON,
	UNMUTE_ICON,
	MUTE_TITLE,
	UNMUTE_TITLE,
	mutedDomains,
	toggleMuteSite
} from "./background";

// the mute/unmute button in the URL bar
export const pageAction =
{
	initialize: () =>
	{
		browser.tabs.query({}).then((tabs) =>
		{
			for (let tab of tabs)
			{
				pageAction.updatePageAction(tab);
			}
		});

		// update page action on each tab update
		browser.tabs.onUpdated.addListener((id, changeInfo, tab) =>
		{
			if (changeInfo?.audible != undefined)
				pageAction.updatePageAction(tab);

			if (changeInfo?.url != undefined) // url has changed
			{
				const domainName = new URL(tab.url).hostname;

				// mute tab if the domain is on muted list
				if (mutedDomains.includes(domainName))
				{
					browser.tabs.update(tab.id, {
						muted: true
					});
				}
			}
		});

		// toggle mute when the page action is clicked
		browser.pageAction.onClicked.addListener(toggleMuteSite);
	},

	updatePageAction: (tab, isDomainMuted = null) =>
	{
		if (isDomainMuted == null)
		{
			const domainName = new URL(tab.url).hostname;
			isDomainMuted = mutedDomains.includes(domainName);
		}

		if (tab.audible)
		{
			const title = isDomainMuted ? UNMUTE_TITLE : MUTE_TITLE;
			const icon = isDomainMuted ? UNMUTE_ICON : MUTE_ICON;

			browser.pageAction.setTitle({tabId: tab.id, title: title});
			browser.pageAction.setIcon({tabId: tab.id, path: icon});
		}

		// show the button only for tabs that are playing audio or on muted domains
		if (tab.audible || isDomainMuted)
			browser.pageAction.show(tab.id);
		else if (!isDomainMuted)
			browser.pageAction.hide(tab.id);
	}
};