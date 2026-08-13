import getBackendURL from "$lib/utils/getBackendURL"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ fetch }) => {
	const [schemaRes, lastSelectedUnitRes] = await Promise.all([
		fetch(getBackendURL("dashboard")),
		fetch(getBackendURL("last_selected_unit")),
	])
	let schema = await schemaRes.json();
	let lastSelectedUnit = await lastSelectedUnitRes.json();
	let end_date = new Date();
	let start_date = new Date(end_date.getFullYear(), end_date.getMonth(), 1);

	let end_date_str = end_date.toLocaleDateString("en-CA");
	let start_date_str = start_date.toLocaleDateString("en-CA");

	schema.group_by = "customer";
	schema.start_date = start_date_str;
	schema.end_date = end_date_str;
	schema.use_unit = lastSelectedUnit.unit;

	const res = await fetch(getBackendURL("dashboard"), {
		method: "POST",
		headers: {
		"Content-Type": "application/json",
		},
		body: JSON.stringify(schema),
	});
	let data = await res.json();

	return { schema, data };
};
