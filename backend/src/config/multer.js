import multer from "multer"
import path from "node:path"
import fs from "node:fs"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const publicFolder = path.resolve(__dirname, "../../public")

fs.mkdirSync(publicFolder, { recursive: true })

const tipos = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/webp": ".webp",
    "application/pdf": ".pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
    "video/mp4": ".mp4",
    "video/webm": ".webm"
}

const storage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, publicFolder)
    },

    filename: (request, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.random()
        const extensao = tipos[file.mimetype]

        cb(null, `${file.fieldname}-${uniqueSuffix}${extensao}`)
    }
})

export const upload = multer({
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024,
        files: 10
    },
    fileFilter: (request, file, cb) => {

        if(Object.hasOwn(tipos, file.mimetype)){
            cb(null, true)
        } else {
            cb(new Error("Formato de arquivo inválido"))
        }

    }
})