import getBackendURL from "$lib/utils/getBackendURL"
import { json } from "@sveltejs/kit"
import { mkConfig, generateCsv, asString } from "export-to-csv";

const csv_config = mkConfig({useKeysAsHeaders: true})

export async function POST({ request, setHeaders, fetch }) {
	let scheme = await request.json()
	scheme.fields = scheme.fields.filter((field: any) => field !== "id")
	const res = await fetch(getBackendURL("report"), {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(scheme),
	})

	let data = await res.json()
	if (!data.data || data.data.length === 0) return json({ error: "No data found" })
    
    // console.log(data.data)
    let csv = generateCsv(csv_config)(data.data)
    // let csvBuffer = new Uint8Array(Buffer.from(asString(csv)));
    let csvBlob = new Blob([asString(csv)], { type: "application/csv" })

	setHeaders({
		"Content-Type": "application/csv",
		"Content-Disposition": "attachment; filename=report.csv",
	})
	// console.log(doc)

	return new Response(csvBlob)
}
