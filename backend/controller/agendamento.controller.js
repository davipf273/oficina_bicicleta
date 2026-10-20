const Agendamento = require('../models/Agendamento')
const Veiculo = require('../models/Veiculo')
const Cliente = require('../models/Cliente')

const cadastrar = async(req,res)=>{
    const valores = req.body

    if(!valores.data || !valores.hora || !valores.tipo || !valores.idCliente || !valores.idVeiculo){
        return res.status(400).json({message: 'Todos os campos são obrigatorios'})
    }

    try{
        const cliente = await Cliente.findByPk(valores.idCliente)
        if(!cliente){
            return res.status(404).json({message:'Cliente informado não existe!'})
        }

        const veiculo = await Veiculo.findByPk(valores.idVeiculo)
        if(!veiculo){
            return res.status(404).json({message:'Cliente informado não existe!'})
        }

        const novoAgendamento = await Agendamento.create(valores)
        return res.status(201).json({message: 'Agendamento registrado com sucesso!'})
    }catch(err){
        console.error('Erro ao criar agendamento ',err)
        return res.status(500).json({message: 'Erro ao registrar agendamento!'})
    }
}

const atualizar = async(req,res)=>{
    const id = req.params.id
    const valores = req.body 

    try{
        const agendamento = await Agendamento.findByPk(id)
        if(!agendamento){
            return res.status(404).json({message: 'Agendamento informado não encontrado!'})
        }

        if(valores.idCliente){
            const cliente = await Cliente.findByPk(valores.idCliente)
            if(!cliente){
                return res.status(404).json({message: 'Cliente informado não encontrado! '})
            }
        }

        if(valores.idVeiculo){
            const veiculo = await Veiculo.findByPk(valores.idVeiculo)
            if(!veiculo){
                return res.status(404).json({message: 'Veiculo informado não existe'})
            }
        }

        await Agendamento.update(valores,{where:{codAgendamento: id}})
        return res.status(200).json({message: 'Agendamento atualizado com sucesso!'})
    }catch(err){
        console.error('Erro ao atualizar o agendamento',err)
        return res.status(500).json({message: 'Erro ao atualizar agendamento!'})
    }
}

const listarAgenda = async(req,res)=>{
    try{
        const agendamentos = await Agendamento.findAll({
            order:[['data','ASC']],
            include:[
                {
                    model: Cliente,
                    as: 'clienteAgendamento',
                    attributes:['codCliente','nome','email','telefone']
                },
                {
                    model: Veiculo,
                    as: 'veiculoAgendamento',
                    attributes: ['codVeiculo','modelo','tipo','placa']
                }
            ]
        })

        return res.status(200).json(agendamentos)
    }catch(err){
        console.error('Erro ao listar agenda',err)
        return res.status(500).json({message: 'Erro ao listar agenda!'})
    }
}

module.exports = {cadastrar, atualizar,listarAgenda}

