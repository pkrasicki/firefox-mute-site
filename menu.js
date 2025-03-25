import {
	CUSTOM_MENU_ID,
	MUTE_TITLE,
	UNMUTE_TITLE,
	mutedDomains,
	toggleMuteSite
} from "./background";

const onMenuCreated = () =>
{
	if (browser.runtime.lastError)
		console.error("Error creating menu item:", browser.runtime.lastError);
};

export const menu =
{
	initialize: () =>
	{
		// add a custom item to tab's right click menu
		browser.menus.create({
			id: CUSTOM_MENU_ID,
			title: MUTE_TITLE,
			contexts: ["tab"]
		}, onMenuCreated);

		// update menu item's title
		browser.menus.onShown.addListener(async (info, tab) =>
		{
			const domainName = new URL(tab.url).hostname;
			const isDomainMuted = mutedDomains.includes(domainName);

			const title = isDomainMuted ? UNMUTE_TITLE : MUTE_TITLE;
			browser.menus.update(CUSTOM_MENU_ID, {title: title});
			browser.menus.refresh();
		});

		// mute/unmute site when clicked
		browser.menus.onClicked.addListener((info, tab) =>
		{
			if (info.menuItemId === CUSTOM_MENU_ID)
				toggleMuteSite(tab);
		});
	}
};