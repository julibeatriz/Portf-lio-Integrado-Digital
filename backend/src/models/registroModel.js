import { DataTypes } from "sequelize";
import { conn } from "../config/conn.js";

export const registroModel = conn.define(
    "registros",
    {
        id_registro:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },

        id_area:{
            type: DataTypes.INTEGER,
            allowNull: false
        },

        id_usuario:{
            type: DataTypes.UUID,
            allowNull: false
        },

        secao:{
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                isIn: {
                    args: [[
                        "Quem Sou Eu",
                        "Fundamentos Teóricos",
                        "Participação em Sala de Aula",
                        "Projetos e Trabalhos Desenvolvidos",
                        "Reflexão Crítica",
                        "Conexões Interdisciplinares",
                        "Aprendizados da Escola para a Vida"
                    ]],
                    msg: "Seção inválida"
                }
            }
        },

        bimestre:{
            type: DataTypes.ENUM("1º Bimestre", "2º Bimestre", "3º Bimestre", "4º Bimestre"),
            allowNull: true
        },

        titulo:{
            type: DataTypes.TEXT,
            allowNull: false,
            validate:{
                len: {
                    args: [3, 200],
                    msg: "O título deve ter entre 3 a 200 caracteres"
                }
            }
        },

        descricao:{
            type: DataTypes.TEXT,
            allowNull: false,
            validate:{
                len: {
                    args: [5, 1000],
                    msg: "A descrição deve ter entre 5 a 1000 caracteres"
                }
            }
        },

        aprendizado:{
            type: DataTypes.TEXT,
            allowNull: true,
            validate:{
                len: {
                    args: [10, 1200],
                    msg: "O aprendizado deve ter entre 10 a 1200 caracteres"
                }
            }
        },

        reflexao_pratica:{
            type: DataTypes.TEXT,
            allowNull: true
        },

        autoavaliacao:{
            type: DataTypes.TEXT,
            allowNull: true
        },

        melhorias_necessarias:{
            type: DataTypes.TEXT,
            allowNull: true
        },

        data_registro:{
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },

        evidencia_visual:{
            type: DataTypes.JSON,
            allowNull: true
        },

        links_evidencias:{
            type: DataTypes.JSON,
            allowNull: true
        }
    }
)