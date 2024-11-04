// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		type StyleClass =
			| "primary"
			| "success"
			| "info"
			| "danger"
			| "warning"
			| ""
		type Size = "sm" | "md" | "lg" | "xl" | "xxl" | "free"
		type HandlerFunc = ((e?: Event) => void) | ((e?: Event) => Promise<void>)
		type SelectInputType = {value: string, label: string, selected?: boolean}[]
		interface InputProps {
			placeholder?: string
			name: string
			type?: string
			required?: boolean
			disabled?: boolean
			autocomplete?: string
			classes?: StyleClass
			value?: string
		}
		interface ButtonProps {
			classes?: StyleClass
			disabled?: boolean
			onClick?: HandlerFunc
		}
		interface DateInputProps extends InputProps {
			valueDate: Date | string
			min: string
			max: string
		}
	}
	namespace Model {
		interface LoginCredentials {
			username: string
			password: string
		}
		interface LogoutToken {
			refresh: string
		}
	}
	namespace DataGrid {
		interface column {
			name: string // key to access the data
			label: string // column header
			classes?: App.StyleClass
			hidden?: boolean
			align?: "left" | "center" | "right"
			details?: boolean
		}
	}
}

export {}
