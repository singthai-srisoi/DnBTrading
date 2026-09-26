import { getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';

export function requireAuthenticatedUser() {
	const event = getRequestEvent();

	if (!event.locals.user) {
		throw error(401, 'You must be signed in to continue.');
	}

	return event.locals.user;
}