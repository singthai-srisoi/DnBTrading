import { command, form, getRequestEvent } from '$app/server';
import { invalid } from '@sveltejs/kit';
import * as v from 'valibot';
import { auth } from '$lib/server/auth';
import { APIError } from 'better-auth/api';

const signInSchema = v.object({
	email: v.pipe(v.string(), v.email('Please enter a valid email address')),
	password: v.pipe(v.string(), v.minLength(1, 'Password is required'))
});

export const signIn = form(signInSchema, async ({ email, password }, issue) => {
	const event = getRequestEvent();
	try {
		const res = await auth.api.signInEmail({
			body: {
				email,
				password
			},
			headers: event.request.headers
		});
		return res;
	} catch (err) {
		if (err instanceof APIError) {
			invalid(issue.password(err.message || 'Invalid email or password'));
		}
		if (err instanceof Error) {
			invalid(issue.password(err.message || 'Invalid email or password'));
		}
		invalid(issue.password('Invalid email or password'));
	}
});

export const signOut = command(async () => {
	const event = getRequestEvent();
	await auth.api.signOut({ headers: event.request.headers });
	return { success: true };
});
