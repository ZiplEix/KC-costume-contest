import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const userAgent = event.request.headers.get('user-agent') || '';

	const isMobile = /Mobile|Android|iP(hone|od|ad)|BlackBerry|IEMobile|Silk/.test(userAgent);

	if (!isMobile) {
		return new Response('This site is only available on mobile devices.', {
			status: 403
		});
	}

	return resolve(event, {
		maxBodySize: 10_000_000, // 10MB
	});
};
