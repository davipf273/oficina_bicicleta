const express = require('express')
const app = express()
const cors = require('cors')

const PORT = 3000
const hostname = 'localhost'

const conn = require('./db/conn')

require('./models/rel')

const authMiddleware = require('./middleware/auth.middleware')
const authController = require('./controller/auth.controller')
const clienteCrontroller = require('./controller/cliente.controller')
const veiculoCrontroller = require('./controller/veiculo.controller')
const agendamentoCrontroller = require('./controller/agendamento.controller')

// middleware
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())

// rotas publicas
app.post('/cliente', clienteCrontroller.cadastrar)
app.post('/login', authController.login)

app.get('/', (req,res)=>{
    res.status(200).json({message: 'Aplicação rodando'})
})

// rotas privadas
app.use(authMiddleware)

app.get('/clientes',clienteCrontroller.listar)
app.get('/cliente/buscarNome/:nome',clienteCrontroller.consultar)
app.put('/cliente/:id',clienteCrontroller.atualizar)
app.delete('/cliente/:id',clienteCrontroller.apagar)

app.post('/veiculo',veiculoCrontroller.cadastrar)
app.post('/agendamento',agendamentoCrontroller.cadastrar)
app.put('/agendamento/:id',agendamentoCrontroller.atualizar)
app.get('/agendamentos',agendamentoCrontroller.listarAgenda)

conn.sync()
    .then(()=>{
        app.listen(PORT, hostname,()=>{
            console.log(`Servidor rodando em http://${hostname}:${PORT}`)
        })
    })
    .catch((err)=>{
        console.error('Erro ao conectar com o banco de dados!',err)
    })