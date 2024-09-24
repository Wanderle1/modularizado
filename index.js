const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3000
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/drivelux').then(() => console.log('Conectado ao MongoDB')).catch((erro) => console.log('Erro ao conectar ao MongoDB', erro))

app.listen(port, () => {
    console.log(`iniciando na porta http//localhost:${port}`)
})


const schemaCarros = new mongoose.Schema({
    marca: {type: String, required: true},
    modelo: {type: String, required: true},
    ano: {type: Number, required: true},
    placa: {type: String, required: true}
})

const Carros= mongoose.model('Carros', schemaCarros)

async function cadastrarCarros(marca, modelo, ano, placa){
    try{
        const newCarro= new Carros({marca, modelo, ano, placa})
        return await newCarro.save()
    }catch(erro){
        console.erro('erro ao cadastrar o carro', erro)
        throw erro
    }
}

app.post('/carros', async(req, res) => {
    try{
        const {marca, modelo, ano, placa}= req.body
        res.status(200).json({mensagem:'cadastrado com sucesso', carro: newCarro})
    }catch(erro){
        res.status(500).json({mensagem: 'erro ao cadastrar carro', erro: erro.message})
    }
})

