const {DataTypes} = require('sequelize')
const db = require('../db/conn')

const Agendamento = db.define('agendamento',{
    codAgendamento:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    data:{
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    hora:{
        type: DataTypes.DATE    ,
        allowNull: false
    },
    tipo:{
        type: DataTypes.ENUM('Revisão','Manutenção','instalação'),
        allowNull: false
    },
    idCliente:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:'clientes',
            key:'codCliente'
        }
    },
    idVeiculo:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:'veiculos',
            key:'codVeiculo'
        }
    },
},{
    timestamps:false,
    tableName: 'agendamentos'
})

module.exports = Agendamento