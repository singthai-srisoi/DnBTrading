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
