import { writable } from "svelte/store";

export type DockName = "home" | "submit" | "rules" | "votes";

function getInitialDock(): DockName {
    if (typeof window !== 'undefined') {
		const path = window.location.pathname;
		if (path.startsWith('/submit')) return 'submit';
		if (path.startsWith('/rules')) return 'rules';
		if (path.startsWith('/votes')) return 'votes';
	}
	return 'home';
}

export const dockStore = writable<DockName>(getInitialDock());
