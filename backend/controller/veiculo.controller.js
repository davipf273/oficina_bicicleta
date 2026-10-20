const Veiculo = require('../models/Veiculo')
const Cliente = require('../models/Cliente')
const CryptoJS = require('crypto-js')
const CHAVE_SEGRETA = 'segredo'

const cadastrar = async(req,res)=>{
    const valores = req.body

    if(!valores.modelo || !valores.marca || !valores.placa || !valores.codigoRastreador || !valores.idCliente){
        return res.status(400).json({message: 'Todos os campos são obrigatorios'})
    }

    try{
        const cliente = await Cliente.findByPk(valores.idCliente)
        if(!cliente){
            return res.status(404).json({message: 'Cliente informado não existe!'})
        }
        const codigoRastreadorCriptografado = CryptoJS.AES.encrypt(valores.codigoRastreador, CHAVE_SEGRETA).toString()

        const novoVeiculo = await Veiculo.create({
            modelo: valores.modelo,
            marca: valores.marca,
            placa: valores.placa,
            codigoRastreador: codigoRastreadorCriptografado,
            idCliente: valores.idCliente
        })
        return res.status(404).json({message: 'Veiculo cadastrado com sucesso!',veiculo: novoVeiculo})
    }catch(err){
        console.error('Erro ao cadastrar veiculo',err)
        return res.status(500).json({message: 'Erro ao cadastrar veiculo!'})
    }
}

module.exports = {cadastrar}