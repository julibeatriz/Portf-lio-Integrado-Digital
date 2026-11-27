import { areaModel } from "../models/areaModel.js";
import { registroModel } from "../models/registroModel.js";

export const listarAreas = async(request, response)=>{
    try {
        const areas = await areaModel.findAll()

        return response.status(200).json(areas)

    } catch (error) {
        console.log(error)
        response.status(500).json({message: "Erro ao listar áreas"})
    }
}

export const cadastrarArea = async(request, response)=>{
    try {
        const { instituicao, nome, descricao } = request.body

        if(!instituicao || !nome){
            return response.status(400).json({
                message: "Preencha os campos obrigatórios"
            })
        }

        const area = await areaModel.create({
            instituicao,
            nome,
            descricao
        })

        return response.status(201).json(area)

    } catch (error) {
        console.log(error)
        response.status(500).json({message: "Erro ao cadastrar área"})
    }
}

export async function buscarAreaPorId(request, response) {
    try {
        const { id } = request.params

        const area = await areaModel.findByPk(id)

        if (!area) {
            return response.status(404).json({
                message: "Área não encontrada"
            })
        }

        return response.status(200).json(area)

    } catch (error) {
        console.log(error)
        return response.status(500).json({message: "Erro ao buscar área"})
    }
}

export const editarArea = async (request, response)=>{
    try {
        const { id } = request.params
        const { instituicao, nome, descricao } = request.body

        const area = await areaModel.findByPk(id)

        if (!area) {
            return response.status(404).json({
                message: "Área não encontrada"
            })
        }

        if (!instituicao || typeof nome !== "string" || !nome.trim()) {
            return response.status(400).json({
                message: "Preencha os campos obrigatórios"
            })
        }

        if (instituicao !== "Sesi" && instituicao !== "Senai") {
            return response.status(400).json({
                message: "Instituição inválida"
            })
        }

        await area.update({
            instituicao,
            nome,
            descricao
        })

        return response.status(200).json(area)

    } catch (error) {
        console.log(error)
         return response.status(500).json({message: "Erro ao buscar área"})
    }
}

export async function excluirArea(request, response) {
    try {
        const { id } = request.params

        const area = await areaModel.findByPk(id)

        if (!area) {
            return response.status(404).json({
                message: "Área não encontrada"
            })
        }

        const registro = await registroModel.findOne({
            where: { id_area: id }
        })

        if (registro) {
            return response.status(409).json({
                message: "A área possui registros vinculados"
            })
        }

        await area.destroy()

        return response.status(200).json({
            message: "Área excluída com sucesso"
        })

    } catch (error) {
        console.log(error)
        return response.status(500).json({message: "Erro ao excluir área"})
    }
}