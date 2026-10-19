const CryptoJS = require('crypto-js')
const CHAVE_SEGRETA = 'segredo'

function authMiddleware(req,res,next){
    const token = req.headers['authorization']
    console.log(token)

    if(!token){
        return res.status(401).json({message: 'Acesso negado! Token não fornecido'})
    }

    try{
        const bytes = CryptoJS.AES.decrypt(token,CHAVE_SEGRETA)
        const dadosDecriptografados = bytes.toString(CryptoJS.enc.Utf8)

        if(!dadosDecriptografados){
            return res.status(401).json({message: 'Token inválido!'})
        }
        
        const payload = JSON.parse(dadosDecriptografados)

        if(Date.now() > payload.expiraEm){
            return res.status(401).json({message: 'Sessão expirada! Faça login novamente'})
        }

        req.usuario = payload
        next()
    }catch(err){
        return res.status(401).json({message: 'falha na autenticação do token!'})
    }
}   

module.exports = authMiddleware