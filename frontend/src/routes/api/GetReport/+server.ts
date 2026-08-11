
import getBackendURL from "$lib/utils/getBackendURL.js"
import { json } from "@sveltejs/kit"
import { formatReportRows } from "./pdf/helper"

export async function POST({ request, fetch }) {
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
	if (data.data) {
		data.data = formatReportRows(data.data)
	}
	return json(data)
}
