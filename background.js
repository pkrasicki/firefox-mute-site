/*
Mute Site - a Firefox addon
Copyright (C) 2025 pkrasicki

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { settings } from "./settings";
import { storage } from "./storage";
import { pageAction } from "./pageAction";
import { menu } from "./menu";

export const MUTE_ICON = "icons/mute.svg";
export const UNMUTE_ICON = "icons/unmute.svg";
export const MUTE_TITLE = "Mute Site";
export const UNMUTE_TITLE = "Unmute Site";
export const CUSTOM_MENU_ID = "mute-site";

export let mutedDomains = [];

const start = async () =>
{
	await settings.load();

	if (settings.config.isPersistenceEnabled)
		mutedDomains = await storage.loadMutedDomains() || [];

	pageAction.initialize();
	menu.initialize();
};

export const toggleMuteSite = async (selectedTab = null) =>
{
	try
	{
		if (!selectedTab)
		{
			const activeTabs = await browser.tabs.query({active: true, currentWindow: true});
			selectedTab = activeTabs[0];
		}

		const domainName = new URL(selectedTab.url).hostname;
		const domainIndex = mutedDomains.indexOf(domainName);
		const wasDomainMuted = domainIndex > -1;

		if (wasDomainMuted) // it just got unmuted, so remove it from the list
		{
			mutedDomains.splice(domainIndex, 1);
		} else // it just got muted, so add it to the list
		{
			mutedDomains.push(domainName);
		}

		const tabs = await browser.tabs.query({
			url: `*://*.${domainName}/*`
		});

		// mute/unmute all tabs that match this domain
		tabs.forEach((tab) =>
		{
			browser.tabs.update(tab.id, {
				muted: !wasDomainMuted
			});

			pageAction.update(tab, !wasDomainMuted); // update the mute button
		});

		if (settings.config.isPersistenceEnabled)
			storage.updateMutedDomains(mutedDomains); // save changes

	} catch (error)
	{
		console.error(`Error: ${error}`);
	}
};

start();