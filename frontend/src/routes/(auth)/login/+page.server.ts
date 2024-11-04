import getBackendURL from "$lib/utils/getBackendURL"
import { redirect, type Actions } from "@sveltejs/kit"

export const actions = {
	default: async ({ request, cookies, fetch }) => {
		const data = await request.formData()

		const res = await fetch(getBackendURL('login'), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(Object.fromEntries(data.entries())),
		})

		if (res.ok) {
			const json = await res.json()
			cookies.set("access", json["access"], {
				path: "/",
				httpOnly: true,
			})
			cookies.set("refresh", json["refresh"], {
				path: "/",
				httpOnly: true,
			})
			redirect(301, "/home")
		}

		redirect(301, "/login")
	},
} satisfies Actions
