import { writable } from "svelte/store";

export type PublicDockName = "home" | "rules" | "votes";
export type ManagmentDockName = "dashboard" | "submit";

function getInitialPublicDock(): PublicDockName {
    if (typeof window !== 'undefined') {
		const path = window.location.pathname;
		if (path.startsWith('/rules')) return 'rules';
		if (path.startsWith('/votes')) return 'votes';
	}
	return 'home';
}

function getInitialManagmentDock(): ManagmentDockName {
	if (typeof window !== 'undefined') {
		const path = window.location.pathname;
		if (path.startsWith('/dashboard')) return 'dashboard';
		if (path.startsWith('/submit')) return 'submit';
	}
	return 'dashboard';
}

export const publicDockStore = writable<PublicDockName>(getInitialPublicDock());
export const managmentDockStore = writable<ManagmentDockName>(getInitialManagmentDock());
