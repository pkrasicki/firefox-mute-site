const MUTE_ICON = "icons/mute.svg";
const UNMUTE_ICON = "icons/unmute.svg";
const MUTE_TITLE = "Mute Site";
const UNMUTE_TITLE = "Unmute Site";
const CUSTOM_MENU_ID = "mute-site";

const toggleMuteSite = async (selectedTab = null) =>
{
	try
	{
		if (!selectedTab)
		{
			const activeTabs = await browser.tabs.query({active: true, currentWindow: true});
			selectedTab = activeTabs[0];
		}

		const isSelectedTabMuted = selectedTab.mutedInfo.muted;
		const domainName = new URL(selectedTab.url).hostname;

		const tabs = await browser.tabs.query({
			url: `*://*.${domainName}/*`
		});

		tabs.forEach((tab) =>
		{
			browser.tabs.update(tab.id, {
				muted: !isSelectedTabMuted
			});
		});
	} catch (error)
	{
		console.log(`Error: ${error}`);
	}
};

const initializePageAction = (tab) =>
{
	if (tab.audible) // if tab is playing media
	{
		const title = tab.mutedInfo.muted ? UNMUTE_TITLE : MUTE_TITLE;
		const icon = tab.mutedInfo.muted ? UNMUTE_ICON : MUTE_ICON;

		browser.pageAction.setTitle({tabId: tab.id, title: title});
		browser.pageAction.setIcon({tabId: tab.id, path: icon});
		browser.pageAction.show(tab.id);
	}
}

const menuCreated = () =>
{
	if (browser.runtime.lastError)
	  console.log("Error creating menu item:", browser.runtime.lastError);
}

// initialize for all tabs
browser.tabs.query({}).then((tabs) =>
{
	for (let tab of tabs)
	{
		initializePageAction(tab);
	}
});

// update page action on each tab update
browser.tabs.onUpdated.addListener((id, changeInfo, tab) =>
{
	initializePageAction(tab);
});

// mute/unmute site when the page action is clicked
browser.pageAction.onClicked.addListener(toggleMuteSite);

// create custom item for tab menu
browser.menus.create({
	id: CUSTOM_MENU_ID,
	title: MUTE_TITLE,
	contexts: ["tab"]
}, menuCreated);

// update menu item's title
browser.menus.onShown.addListener(async (info, tab) =>
{
	const title = tab.mutedInfo.muted ? UNMUTE_TITLE : MUTE_TITLE;
	browser.menus.update(CUSTOM_MENU_ID, {title: title});
	browser.menus.refresh();
});

browser.menus.onClicked.addListener((info, tab) =>
{
	if (info.menuItemId === CUSTOM_MENU_ID)
		toggleMuteSite(tab);
});