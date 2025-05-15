import PdfPrinter from "pdfmake"
import type { TDocumentDefinitions, TFontDictionary } from "pdfmake/interfaces"
import blobStream from "blob-stream"

let fonts: TFontDictionary = {
	Inter: {
		normal: "static/Inter/static/Inter_18pt-Regular.ttf",
		bold: "static/Inter/static/Inter_18pt-Bold.ttf",
	},
}

let printer = new PdfPrinter(fonts)

export async function GenerateReport(data: string[][]): Promise<Blob> {
	let dd: TDocumentDefinitions = {
		content: {
            layout: 'lightHorizontalLines',
			table: {
				widths: "auto",
				headerRows: 1,
				body: data,
			},
		},
		defaultStyle: {
			font: "Inter",
			fontSize: 16,
		},
		pageOrientation: "landscape",
		pageSize: "A2",
	}
	return new Promise((resolve, reject) => {
		let pdf = printer.createPdfKitDocument(dd)
		pdf.pipe(blobStream())
			.on("finish", function (this: any) {
				resolve(this.toBlob("application/pdf"))
			})
			.on("error", (err: any) => {
				reject(err)
			})
		pdf.end()
	})
}

type ReportRow = {
	vehicle: string
	driver: string
	supplier: string
	customer: string
	product: string
	date: string
	customer_ticket_no: string
	supplier_qty: number
	ticket_no: string
	do: string
	weight_in: number
	weight_out: number
	factory_nett: number
	nett: number
	deduction: number
	bucket: number
	remark: string
}

function transformDataWithSubtotals(data: ReportRow[]): string[][] {
	const headers = [
		"Date", "Vehicle", "Driver", "Supplier", "Customer", "Product", "Ticket No",
		"Customer Ticket No", "DO", "Weight In", "Weight Out", "Supplier Qty",
		"Factory Nett", "Nett", "Deduction", "Bucket", "Remark"
	]

	const body: string[][] = [headers]
	const suppliers = new Map<string, ReportRow[]>()

	// Group by supplier
	for (const row of data) {
		if (!suppliers.has(row.supplier)) {
			suppliers.set(row.supplier, [])
		}
		suppliers.get(row.supplier)!.push(row)
	}

	let grandTotals = {
		supplier_qty: 0,
		factory_nett: 0,
		nett: 0,
		deduction: 0,
	}

	for (const [supplier, rows] of suppliers) {
		for (const row of rows) {
			body.push([
				row.date,
				row.vehicle,
				row.driver,
				row.supplier,
				row.customer,
				row.product,
				row.ticket_no,
				row.customer_ticket_no,
				row.do,
				row.weight_in.toString(),
				row.weight_out.toString(),
				row.supplier_qty.toString(),
				row.factory_nett.toString(),
				row.nett.toString(),
				row.deduction.toString(),
				row.bucket.toString(),
				row.remark,
			])

			grandTotals.supplier_qty += row.supplier_qty
			grandTotals.factory_nett += row.factory_nett
			grandTotals.nett += row.nett
			grandTotals.deduction += row.deduction
		}

		// Subtotal row
		const subtotal = rows.reduce(
			(acc, row) => ({
				supplier_qty: acc.supplier_qty + row.supplier_qty,
				factory_nett: acc.factory_nett + row.factory_nett,
				nett: acc.nett + row.nett,
				deduction: acc.deduction + row.deduction,
			}),
			{ supplier_qty: 0, factory_nett: 0, nett: 0, deduction: 0 }
		)

		body.push([
			"", "", "", `Subtotal for ${supplier}`, "", "", "", "", "", "", "",
			subtotal.supplier_qty.toString(),
			subtotal.factory_nett.toString(),
			subtotal.nett.toString(),
			subtotal.deduction.toString(),
			"", ""
		])
	}

	// Final total row
	body.push([
		"", "", "", "Grand Total", "", "", "", "", "", "", "",
		grandTotals.supplier_qty.toString(),
		grandTotals.factory_nett.toString(),
		grandTotals.nett.toString(),
		grandTotals.deduction.toString(),
		"", ""
	])

	return body
}

// const tableData = transformDataWithSubtotals(reportData)
// const pdfBlob = await GenerateReport(tableData)