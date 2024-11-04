import getBackendURL from "$lib/utils/getBackendURL.js";
import { json } from "@sveltejs/kit";

export async function POST({ request, fetch }) {
    let schema = await request.json()

    let res = await fetch(getBackendURL("dashboard"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(schema),
    })
    let data = await res.json()

    return json(data)
}