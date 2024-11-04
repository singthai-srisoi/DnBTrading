import getBackendURL from "$lib/utils/getBackendURL";
import type { PageServerLoad } from "./$types";


export const load: PageServerLoad = async ({ fetch }) => {
    let res = await fetch(getBackendURL("report"))

    let data = await res.json()

    let options: {[k: string]: any} = {}
    let product_options = await fetch(getBackendURL("product", "get_options"))
	let data_ = await product_options.json()
	options.product_options = data_

	let customer_options = await fetch(getBackendURL("person_options_customer"))
	data_ = await customer_options.json()
	options.customer_options = data_

	let supplier_options = await fetch(getBackendURL("person_options_supplier"))
	data_ = await supplier_options.json()
	options.supplier_options = data_

	// driver_options
	let driver_options = await fetch(getBackendURL("person_options_driver"))
	data_ = await driver_options.json()
	options.driver_options = data_

	// destination and vehicle options
	let destination_options = await fetch(
		getBackendURL("destination", "get_options")
	)
	data_ = await destination_options.json()
	options.destination_options = data_

	let vehicle_options = await fetch(getBackendURL("vehicle", "get_options"))
	data_ = await vehicle_options.json()
	options.vehicle_options = data_


    return {
        scheme: data,
        options,
        // data: data_jsn,
    }
}