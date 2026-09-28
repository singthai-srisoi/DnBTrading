import { query } from '$app/server';
import { requireAuthenticatedUser } from '$lib/helper';
import { db } from '$lib/server/db';
import { lastSelectedUnit } from '$lib/server/lastSelectedUnit';

export const getLastSelectedUnit = query(async () => {
	requireAuthenticatedUser();
	return db.transaction((tx) => lastSelectedUnit(tx));
});
