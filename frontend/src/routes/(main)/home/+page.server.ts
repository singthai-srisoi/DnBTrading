import getBackendURL from "$lib/utils/getBackendURL"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ fetch }) => {
    let res = await fetch(getBackendURL("dashboard"))
    let schema = await res.json()
    let end_date = new Date()
	let start_date = new Date(end_date.getFullYear(), end_date.getMonth(), 1)

	let end_date_str = end_date.toLocaleDateString('en-CA')
	let start_date_str = start_date.toLocaleDateString('en-CA')

    schema.group_by = 'customer'
    schema.start_date = start_date_str
    schema.end_date = end_date_str

    res = await fetch(getBackendURL("dashboard"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(schema),
    })
    let data = await res.json()    

    return {schema, data}
}
