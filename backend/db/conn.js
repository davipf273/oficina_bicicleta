const {Sequelize} = require('sequelize')
const db = new Sequelize('db_oficina_veiculo','root','senai',{
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
})

db.authenticate()
.then(()=>{
    console.log('Banco de dados Conectado!')
})
.catch((err)=>{
    console.error('Erro de conexão com banco de dados!',err)
})

module.exports = db