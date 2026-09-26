import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const pathname = url.pathname;
	const isAuthRoute = pathname === '/login';

	// if (!locals.user && !isAuthRoute) {
	// 	throw redirect(303, '/login');
	// }

	// if (locals.user && isAuthRoute) {
	// 	throw redirect(303, '/');
	// }

	return {
		user: locals.user ?? null,
		isAuthRoute
	};
};
