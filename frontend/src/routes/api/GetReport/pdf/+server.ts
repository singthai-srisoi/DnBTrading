import getBackendURL from "$lib/utils/getBackendURL"
import { json } from "@sveltejs/kit"
import { GenerateReport } from "./helper"

export async function POST({ request, setHeaders, fetch }) {
	let scheme = await request.json()
	// scheme.fields = scheme.fields.filter((field: any) => field !== "id")
	// scheme.orient = "list"
	const res = await fetch(getBackendURL("report"), {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(scheme),
	})

	let data = await res.json()
	if (!data.data || data.data.length === 0)
		return json({ error: "No data found" })

	/**
	 * Change [{columns -> row}]
	 * into [[columns...], [row1...], [row2...], ...]
	 */
	let keys = Object.keys(data.data[0])
	let new_data = [keys]

	for (let row of data.data) {
		let new_row = []
		for (let key of keys) {
			new_row.push(row[key])
		}
		new_data.push(new_row)
	}

	let doc = await GenerateReport(new_data)
	setHeaders({
		"Content-Type": "application/pdf",
		"Content-Disposition": "attachment; filename=report.pdf",
	})
	// console.log(doc)

	return new Response(doc)
}
