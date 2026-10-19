const Cliente = require('../models/Cliente')
const CryptoJS = require('crypto-js')
const CHAVE_SEGRETA = 'segredo'

const cadastrar = async (req,res)=> {
    const valores = req.body

    if(!valores.nome || !valores.email || !valores.senha || !valores.cpf || !valores.endereco || !valores.telefone){
        return res.status(401).json({message: 'Todos os campos são obrigatorios!'})
    }

    if(valores.cpf.leght !== 11){
        return res.status(400).json({message: 'O CPF deve conter exatamente 11 digitos'})
    }

    try{
        const cpfCriptografado = CryptoJS.AES.encrypt(valores.cpf, CHAVE_SEGRETA).toString()
        const senhaCriptografada = CryptoJS.AES.encrypt(valores.senha, CHAVE_SEGRETA).toString()

        await Cliente.create({
            nome: valores.nome,
            email: valores.email,
            senha: senhaCriptografada,
            cpf: cpfCriptografado,
            endereco: valores.endereco,
            telefone: valores.telefone
        })

        return res.status(201).json({message: 'Cliente cadastrado com sucesso'})
    }catch(err){
        console.error('Erro ao cadastrar!',err)
        return res.status(500).json({message: 'Erro ao cadastrar!'})
    }
}

const listar = async(req,res)=>{
    try {
        const clientes = await Cliente.findAll()
        let resultado =[]

        clientes.forEach((el)=>{
            let cpfCriptografado = ''
            try{
                const bytes = CryptoJS.AES.decrypt(el.cpf, CHAVE_SEGRETA)
                cpfCriptografado = bytes.toString(CryptoJS.enc.Utf8)
            }catch(err){
                cpfCriptografado = 'Erro ao descriptografar'
                console.error(cpfCriptografado,err)
            }
            resultado.push({
                codCliente: el.codCliente,
                nome: el.nome,
                email: el.email,
                cpf: cpfCriptografado,
                endereco: el.endereco,
                celular: el.celular
            })
        })
        return res.status(200).json(resultado)
    }catch(err){
        console.error('Erro ao listar clientes',err)
        return res.status(500).json({message: 'Erro ao listar clientes'})
    }
}

const consultar = async(req,res)=>{
    const nome = req.params.nome
    try{
        const cliente = await Cliente.findOne({ where: { nome: nome}})
        if(!cliente){
            return res.status(404).json({message: 'Cliente não encontrado'})
        }

        const bytes = CryptoJS.AES.decrypt(cliente.cpf,CHAVE_SEGRETA)
        console.log('bytes = ',bytes)
        const cpfCriptografado = bytes.toString(CryptoJS.enc.Utf8)
        console.log('cpf descriptografado = ',cpfCriptografado)

        return res.status(200).json({
            codCliente: cliente.codCliente,
            nome: cliente.nome,
            email: cliente.email,
            cpf: cpfCriptografado,
            endereco: cliente.endereco,
            celular: cliente.celular
        })
    }catch(err){
        console.error('Erro ao consultar cliente',err)
        return res.status(500).json({message: 'Erro ao consultar cliente'})
    }
}

const atualizar = async(req,res)=>{
    const id = req.params.id
    const valores = req.body

    try{
        const cliente = await Cliente.findByPk(id)
        if(!cliente){
            return res.status(404).json({message: 'Cliente não encontrado' })
        }
        const dadosAtualizados = {...valores}
        if(valores.cpf){
            if(valores.cpf.length != 11){
                return res.status(400).json({message: 'O cpf deve conter exatamente 12 digitos'})
            }
            dadosAtualizados.cpf = CryptoJS.AES.encrypt(valores.cpf,CHAVE_SEGRETA).toString()
        }

        if(valores.senha){
            dadosAtualizados.senha = CryptoJS.AES.encrypt(valores.senha,CHAVE_SEGRETA).toString()
        }

        await Cliente.update(dadosAtualizados,{where:{codCliente:id}})
        return res.status(200).json({message: 'Cliente atualizado com sucesso'})
    }catch(err){
        
    }
}