import { BACKEND_BASE_URL } from "$env/static/private"
import { json } from "@sveltejs/kit"

export async function POST({ request, fetch }) {
	const { pathname } = await request.json()
	const res = await fetch(`${BACKEND_BASE_URL}${pathname}`)
	return json(await res.json())
}
