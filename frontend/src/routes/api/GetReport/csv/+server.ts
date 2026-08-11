import getBackendURL from "$lib/utils/getBackendURL"
import { json } from "@sveltejs/kit"
import { mkConfig, generateCsv, asString } from "export-to-csv";
import { formatReportRows } from "../pdf/helper";

const csv_config = mkConfig({useKeysAsHeaders: true})

export async function POST({ request, setHeaders, fetch }) {
	let scheme = await request.json()
	// scheme.fields = scheme.fields.filter((field: any) => field !== "id")
	const res = await fetch(getBackendURL("report"), {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(scheme),
	})

	let data = await res.json()
	if (!data.data || data.data.length === 0) return json({ error: "No data found" })
    
	let formatted = formatReportRows(data.data)
    let csv = generateCsv(csv_config)(formatted)
    let csvBlob = new Blob([asString(csv)], { type: "application/csv" })

	setHeaders({
		"Content-Type": "application/csv",
		"Content-Disposition": "attachment; filename=report.csv",
	})

	return new Response(csvBlob)
}
