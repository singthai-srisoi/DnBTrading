import getBackendURL from "$lib/utils/getBackendURL"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	const refresh = cookies.get("refresh") ?? ""

	const res = await fetch(getBackendURL('logout'), {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ refresh }),
	})

	cookies.delete("access", { path: "/" })
	cookies.delete("refresh", { path: "/" })
}
