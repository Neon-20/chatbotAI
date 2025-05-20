import { FileItemChunk } from "@/types"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { encode } from "gpt-tokenizer"
import * as XLSX from "xlsx"

const CHUNK_SIZE = 400
const CHUNK_OVERLAP = 50

export const processXlsx = async (file: Blob): Promise<FileItemChunk[]> => {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: "buffer" })
  let fullText = ""

  workbook.SheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName]
    // Convert sheet to CSV, then to text. This is a simple way to get all cell values.
    // For more complex data extraction, a row-by-row, cell-by-cell iteration might be needed.
    const csvData = XLSX.utils.sheet_to_csv(worksheet)
    fullText += csvData + "\n\n" // Add a separator between sheets
  })

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP
  })
  const splitDocs = await splitter.createDocuments([fullText.trim()])

  let chunks: FileItemChunk[] = []
  for (const doc of splitDocs) {
    chunks.push({
      content: doc.pageContent,
      tokens: encode(doc.pageContent).length
    })
  }

  return chunks
}
