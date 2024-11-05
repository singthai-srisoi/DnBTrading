import getBackendURL from "$lib/utils/getBackendURL"
import { redirect, type Actions } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ fetch }) => {
	let end_date = new Date()
	let start_date = new Date(end_date.getFullYear(), end_date.getMonth(), 1)

	let end_date_str = end_date.toLocaleDateString("en-CA")
	let start_date_str = start_date.toLocaleDateString("en-CA")

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
		let json_data = JSON.parse(
			JSON.stringify(Object.fromEntries(data.entries()))
		)

		json_data["ticket_no"] = json_data["ticket_no"] || "empty"
		json_data["vehicle"] = json_data["vehicle"] || null
		json_data["driver"] = json_data["driver"] || null
		json_data["supplier"] = json_data["supplier"] || null
		json_data["customer"] = json_data["customer"] || null
		json_data["product"] = json_data["product"] || null
		json_data["destination"] = json_data["destination"] || null
		json_data["bucket"] = json_data["bucket"] || 0
		json_data["deduction"] = json_data["deduction"] || 0
		// DATE IF EMPTY WILL BE TODAT IN CA-EN
		json_data["date"] = json_data["date"] || new Date().toLocaleDateString("en-CA")
		console.log(json_data)

		/**
		 * {
  ticket_no: '2344',
  date: '2024-11-05',
  vehicle: '28',
  driver: '32',
  supplier: '8',
  customer_ticket_no: '23423',
  supplier_qty: '234234',
  customer: '11',
  product: '10',
  do: '234234',
  destination: '',
  weight_in: '234234',
  weight_out: '2344',
  factory_nett: '231890',
  deduction: '0',
  nett: '231890',
  bucket: '',
  remark: ''
}
		 */

		const res = await fetch(getBackendURL("inventory"), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(json_data),
			// JSON.stringify(Object.fromEntries(data.entries())),
		})

		// return resposne from fetch
		let text = await res.text()
		console.log(text)

		if (res.ok) {
			// const json = await res.json()
			return { status: res.status, body: "success" }
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
