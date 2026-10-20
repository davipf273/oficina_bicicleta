const Cliente = require('../models/Cliente')
const CryptoJS = require('crypto-js')
const CHAVE_SEGRETA = 'segredo'

const login = async(req,res)=>{
    const valores = req.body

    if(!valores.email || !valores.senha){
        return res.status(400).json({message: 'Informe e-mail e senha para realizar o login'})
    }

    try{
        const cliente = await Cliente.findOne({where:{email: valores.email}})

        if(!cliente){
            return res.status(404).json({message:'Cliente não encontrado'})
        }

        const bytes = CryptoJS.AES.decrypt(cliente.senha,CHAVE_SEGRETA)
        const senhaBD = bytes.toString(CryptoJS.enc.Utf8)

        if(valores.senha !== senhaBD){
            return res.status(401).json({message: 'Senha incorreta!'})
        }

        const duasHorasEmMs = 2 * 60 * 60 * 1000
        const tempoExpiracao = Date.now() + duasHorasEmMs

        const payload ={
            idCliente: cliente.codCliente,
            nome: cliente.nome,
            expiraEm: tempoExpiracao
        }

        const token = CryptoJS.AES.encrypt(JSON.stringify(payload),CHAVE_SEGRETA).toString()

        return res.status(200).json({
            message: 'Login realizado com sucesso',
            token: token,
            nome: cliente.nome
        })
    }catch(err){
        console.error('Erro ao tentar fazer o login',err)
        return res.status(500).json({message: 'Erro ao tentar fazer o login'})
    }
}

module.exports = {login}