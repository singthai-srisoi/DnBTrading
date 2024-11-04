import getBackendURL from "$lib/utils/getBackendURL"
import { redirect, type Actions } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ fetch }) => {
	const res = await fetch(getBackendURL("product_type"))
	const data = await res.json()
	return data
}

export const actions = {
	create: async ({ fetch, request }) => {
		const data = await request.formData()

		const res = await fetch(getBackendURL("product_type"), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(Object.fromEntries(data.entries())),
		})

		if (res.ok) {
			const json = await res.json()
			return { status: 200, body: json }
		}
	},
	update: async ({ fetch, request }) => {
		const data = await request.formData()
		const code = data.get("code") as string
		if (!code) {
			return { status: 400, body: { error: "code is required" } }
		}

		const res = await fetch(getBackendURL("product_type", code), {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(Object.fromEntries(data.entries())),
		})

		if (res.ok) {
			redirect(300, "/product_type")
		}
	},
	delete: async ({ fetch, request }) => {
		const data = await request.formData()
		const code = data.get("code") as string
		if (!code) {
			return { status: 400, body: { error: "code is required" } }
		}

		const res = await fetch(getBackendURL("product_type", code), {
			method: "DELETE",
		})

		if (res.ok) {
			redirect(300, "/product_type")
		}
	},
} satisfies Actions
