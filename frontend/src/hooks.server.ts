import getBackendURL from "$lib/utils/getBackendURL"
import { redirect, type Handle, type HandleFetch } from "@sveltejs/kit"

export const handle: Handle = async ({ event, resolve }) => {
	const access = event.cookies.get("access")
	const isAuth = event.route.id?.includes("(auth)")
	// console.log({ access, isAuth })
	if (access === undefined && !isAuth) {
		throw redirect(303, "/login")
	}
	return await resolve(event)
}

export const handleFetch: HandleFetch = async ({ request, fetch, event }) => {
	// console.log("handling in here, adding bearer token")
	const access = event.cookies.get("access")

	let req = request.clone()

	if (access) {
		request.headers.set("Authorization", `Bearer ${access}`)
	}
	let response = await fetch(request)

	if (!response.ok && response.status === 401) {
		const refresh = event.cookies.get("refresh")
		// console.log("refreshing token")
		const res = await fetch(getBackendURL("refresh"), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${access}`,
			},
			body: JSON.stringify({ refresh }),
		})
		if (res.ok) {
			const json = await res.json()
			// console.log("refreshed: ", json)
			event.cookies.set("access", json["access"], {
				path: "/",
				httpOnly: true,
			})
			event.cookies.set("refresh", json["refresh"], {
				path: "/",
				httpOnly: true,
			})

			req.headers.set("Authorization", `Bearer ${json["access"]}`)
			response = await fetch(req)

			if (!response.ok && response.status === 401) {
				throw redirect(303, "/login")
			}
		}
	}
	return response
}
