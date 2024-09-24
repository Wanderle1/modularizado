const { error } = require('console')
const express = require('express')
const mongoose = require('mongoose')
const app = express()
app.use(express.json())
const port = 3000

mongoose.connect("mongodb://localhost:27017/livraria").then(() => console.log('conectado ao MongoDB')).catch((erro) => console.log('erro ao conectar MongoDB', erro))

app.listen(port, () => {
    console.log(`iniciando na porta http//localhost:${port}`)
})

const schemaLivro = new mongoose.Schema({
    titulo: {type: String, required: true},
    autor: {type: String, required: true},
    ano: {type: Number, required: true},
    genero: {type: String, required: true}
})
const Livro= mongoose.model('Livro', schemaLivro)

async function criarLivro(titulo,autor,ano,genero){
    try{
    const newLivro = new Livro({titulo, autor, ano, genero})
    return await newLivro.save()
    }catch(erro){
        console.error('erro ao criar livro', erro)
        throw erro
    }
}

app.post('/livro', async(req, res)=> {
    try{
        const {titulo, autor, ano, genero}= req.body
        res.status(201).json({mensagem: 'livro criado com sucesso', livro: newLivro})
    }catch(erro){
        res.status(500).json({mensagem: 'eroo ao criar livro', erro: erro.message})
    }
})

async function listarLivros(){
    try{
        return await Livro.find()
    }catch(erro){
        console.error('erro ao listar', erro)
        throw erro
    }
}

app.get('/livros', async (req, res)=> {
    try{
        const livros= await listarLivros()
        res.status(201).json(livros)
    }catch(erro){
        res.status(500).json({mensagem:'erro ao listar', erro: erro.message})
    }
})

async function editarLivro(id, titulo, autor, ano, genero){
    try{
        const livroAtualizado= await Livro.findByIdAndUpdate(
            id,
            {titulo, autor, ano ,genero},
            {new: true, runValidators: true}
        )
        return livroAtualizado
    }catch(erro){
        console.error('erro ao editar o livro', erro)
        throw erro
    }
}

app.put('/livros/:id', async (req, res)=> {
    try{
        const{id}= req.params
        const {titulo, autor, ano, genero}= req.body
        const livroAtualizado= await editarLivro(
            id,
            titulo,
            autor,
            ano,
            genero
        )
        if(livroAtualizado){
            res.status(200).json({mensagem:'editado com sucesso', livro: livroAtualizado})
        }else{
            res.status(404).json({mensagem:'livro não encontrado'})
        }
    }catch(erro){
        res.status(500).json({mensagem: 'erro ao editar livro', erro: erro.message})
    }
})

async function deletarLivro(id){
    try{
        const livroDeletado = await Livro.findByIdAndDelete(id)
        return livroDeletado
    }catch(erro){
        console.error('erro ao deletar livro', erro)
        throw erro
    }
}

app.delete('/livros/:id', async (req, res)=> {
    try{
        const {id}= req.params
        const livroDeletado= await deletarLivro(id)
        if(livroDeletado){
            res.status(200).json({mensagem: "deletado com sucesso", livro: livroDeletado})
        }else{
            res.status(404).json({mensagem: 'livro não encontrado'})
        }
    }catch(erro){
        res.status(500).json({mensagem: 'erro ao deletar', erro: erro.message})
    }
})

