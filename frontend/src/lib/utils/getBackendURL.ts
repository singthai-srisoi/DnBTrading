import { BACKEND_BASE_URL } from "$env/static/private"

export const URLS = {
	login: `${BACKEND_BASE_URL}token/`,
	refresh: `${BACKEND_BASE_URL}token/refresh/`,
	logout: `${BACKEND_BASE_URL}token/logout/`,

	// === Product ===
	product: `${BACKEND_BASE_URL}products/`,
	product_type: `${BACKEND_BASE_URL}product-types/`,

	// === Vehicle ===
	vehicle: `${BACKEND_BASE_URL}vehicles/`,

	// === Person ===
	person: `${BACKEND_BASE_URL}persons/`,
	
	customer: `${BACKEND_BASE_URL}person/customer/`,
	driver: `${BACKEND_BASE_URL}person/driver/`,
	supplier: `${BACKEND_BASE_URL}person/supplier/`,

	person_options_customer: `${BACKEND_BASE_URL}person_options/customer/`,
	person_options_driver: `${BACKEND_BASE_URL}person_options/driver/`,
	person_options_supplier: `${BACKEND_BASE_URL}person_options/supplier/`,


	//  === Inventory ===
	inventory: `${BACKEND_BASE_URL}inventories/`,

	// === Report ===
	report: `${BACKEND_BASE_URL}report/`,

	// === Dashboard ===
	dashboard: `${BACKEND_BASE_URL}dashboard/`,
}

type URL_KEYS = keyof typeof URLS

export default function getBackendURL(key: URL_KEYS, id?: string, param?: string): string {
	return `${URLS[key]}${id ? id + "/" : ""}${param ? "?" + param : ""}`
}
