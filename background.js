const MUTE_ICON = "icons/mute.svg";
const UNMUTE_ICON = "icons/unmute.svg";
const MUTE_TITLE = "Mute Site";
const UNMUTE_TITLE = "Unmute Site";

const toggleMuteSite = async () =>
{
	try
	{
		const activeTabs = await browser.tabs.query({active: true, currentWindow: true});
		const curTab = activeTabs[0];
		const isCurTabMuted = curTab.mutedInfo.muted;
		const domainName = new URL(curTab.url).hostname;

		const tabs = await browser.tabs.query({
			url: `*://*.${domainName}/*`
		});

		tabs.forEach((tab) =>
		{
			browser.tabs.update(tab.id, {
				muted: !isCurTabMuted
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