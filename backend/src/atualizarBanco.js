import { DataTypes } from "sequelize";
import { conn } from "./config/conn.js";

async function atualizarBanco(){

    try{

        const queryInterface = conn.getQueryInterface();

        const tabela = await queryInterface.describeTable("registros");

        if(!tabela.reflexao_pratica){

            await queryInterface.addColumn("registros", "reflexao_pratica", {
                type: DataTypes.TEXT,
                allowNull: true
            });

        }

        if(!tabela.autoavaliacao){

            await queryInterface.addColumn("registros", "autoavaliacao", {
                type: DataTypes.TEXT,
                allowNull: true
            });

        }

        if(!tabela.melhorias_necessarias){

            await queryInterface.addColumn("registros", "melhorias_necessarias", {
                type: DataTypes.TEXT,
                allowNull: true
            });

        }

        if(!tabela.links_evidencias){

            await queryInterface.addColumn("registros", "links_evidencias", {
                type: DataTypes.JSON,
                allowNull: true
            });

        }

        console.log("Banco de dados atualizado com sucesso!");

    }catch(error){

        console.log("Erro ao atualizar o banco de dados:", error);
        process.exitCode = 1;

    }finally{

        await conn.close();

    }

}

atualizarBanco();