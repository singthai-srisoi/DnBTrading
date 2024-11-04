import getBackendURL from "$lib/utils/getBackendURL"
import { redirect, type Actions } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ fetch }) => {
	const res = await fetch(getBackendURL("supplier"))
	const data = await res.json()
	return data
}

export const actions = {
	create: async ({ fetch, request }) => {
		const data = await request.formData()

		const res = await fetch(getBackendURL("person"), {
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
		const id = data.get("id") as string
		if (!id) {
			return { status: 400, body: { error: "id is required" } }
		}

		const res = await fetch(getBackendURL("person", id), {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(Object.fromEntries(data.entries())),
		})

		if (res.ok) {
			redirect(300, "/person/supplier")
		}
	},
	delete: async ({ fetch, request }) => {
		const data = await request.formData()
		const id = data.get("id") as string
		if (!id) {
			return { status: 400, body: { error: "id is required" } }
		}

		const res = await fetch(getBackendURL("person", id), {
			method: "DELETE",
		})

		if (res.ok) {
			redirect(300, "/person/supplier")
		}
	},
} satisfies Actions
