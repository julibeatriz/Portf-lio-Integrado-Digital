import multer from "multer"

export const multerError = (error, request, response, next)=>{

    if(error instanceof multer.MulterError){

        if(error.code === "LIMIT_FILE_SIZE"){
            return response.status(400).json({
                message: "Cada arquivo deve ter no máximo 100 MB"
            })
        }

        if(error.code === "LIMIT_UNEXPECTED_FILE" || error.code === "LIMIT_FILE_COUNT"){
            return response.status(400).json({
                message: "Campo de arquivo inválido ou limite de 10 arquivos excedido"
            })
        }

        return response.status(400).json({
            message: "Erro ao enviar arquivos"
        })
    }

    if(error.message === "Formato de arquivo inválido"){
        return response.status(400).json({
            message: "Formato de arquivo não permitido"
        })
    }

    next(error)
}