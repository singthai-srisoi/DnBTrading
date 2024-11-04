import getBackendURL from "$lib/utils/getBackendURL"
import { redirect, type Actions } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ fetch }) => {
	let end_date = new Date()
	let start_date = new Date(end_date.getFullYear(), end_date.getMonth(), 1)

	let end_date_str = end_date.toLocaleDateString('en-CA')
	let start_date_str = start_date.toLocaleDateString('en-CA')

	let param = `start_date=${start_date_str}&end_date=${end_date_str}`

	const res = await fetch(getBackendURL("inventory", "", param))
	let data = await res.json()

	let product_options = await fetch(getBackendURL("product", "get_options"))
	let data_ = await product_options.json()
	data.product_options = data_

	let customer_options = await fetch(getBackendURL("person_options_customer"))
	data_ = await customer_options.json()
	data.customer_options = data_

	let supplier_options = await fetch(getBackendURL("person_options_supplier"))
	data_ = await supplier_options.json()
	data.supplier_options = data_

	// driver_options
	let driver_options = await fetch(getBackendURL("person_options_driver"))
	data_ = await driver_options.json()
	data.driver_options = data_

	// destination and vehicle options
	let destination_options = await fetch(
		getBackendURL("destination", "get_options")
	)
	data_ = await destination_options.json()
	data.destination_options = data_

	let vehicle_options = await fetch(getBackendURL("vehicle", "get_options"))
	data_ = await vehicle_options.json()
	data.vehicle_options = data_

	// console.log(data)
	return data
}

export const actions = {
	create: async ({ fetch, request }) => {
		const data = await request.formData()

		const res = await fetch(getBackendURL("inventory"), {
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

		const res = await fetch(getBackendURL("inventory", id), {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(Object.fromEntries(data.entries())),
		})

		if (res.ok) {
			redirect(300, "/inventory")
		}
	},
	delete: async ({ fetch, request }) => {
		const data = await request.formData()
		const id = data.get("id") as string
		if (!id) {
			return { status: 400, body: { error: "id is required" } }
		}

		const res = await fetch(getBackendURL("inventory", id), {
			method: "DELETE",
		})

		if (res.ok) {
			redirect(300, "/inventory")
		}
	},
} satisfies Actions
