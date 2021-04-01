const port = 3030
const express = require('express');
const mongoose= require('mongoose');
const cors = require('cors');

require("./models/Artigo");
const Artigo = mongoose.model('artigo');

const app = express()

//poder ler em json
app.use(express.json());

//middleware, acontece antes de tudo 
//Permitir qual site pode fazer a requisição
// app.use((req, res, next)=>{
//    res.header("Acess-Control-Allow-Origin: *") ;// * significa que qualquer aplicação pode fazer requisição
//    res.header("Acess-Control-Allow-Methods", 'GET'); // As aplicações que fizerem requisição, poderam fazer isso 
//    app.use(cors());
//    next(); 
// });

 mongoose.connect('mongodb://localhost/paulo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{
   console.log("Conexão com mongodb, realizada com sucesso!")
}).catch(erro =>{
   console.log(erro+"Erro: Conexão com mongodb não realizada com sucesso!")
});

 
const corsOptions = {
   origin: '*',
   methods: "GET,PUT,POST,DELETE" // some legacy browsers (IE11, various SmartTVs) choke on 204
 }

app.get("/artigo", cors(corsOptions), (req, res) =>{
  // pegando do banco 
   Artigo.find({}).then(artigo => {
      return res.json(artigo);
  }).catch(erro => {
      return res.status(400).json({
          error: true,
          message: "Nenhum artigo encontrado!"
      })
   })
});

//Visualizar
app.get("/artigo/:id", (req, res) =>{
   // pegando do banco, com parametro o id. Sem as {} porque ambos são retornos
    Artigo.findOne({_id: req.params.id}).then(retorno => 
        res.json(retorno)
   ).catch(erro => 
        res.status(400).json({
           error: true,
           message: "Nenhum artigo encontrado!"
       })
    )
 });
//post inserir
app.post("/artigo", (req, res) =>{
      //verifica se inseriu com sucesso
   const artigo = Artigo.create(req.body,(err) => {
      if(err) return res.status(400).json({
         error:true,
         message:"Erro"
      })
      return res.status(200).json({
         error:false,
         message:"Cadastrado com sucesso"
      })
   })
});

//Editar API
app.put("/artigo/:id", (req,res) => {
   //Edita pelo id fornecido
   const artigo = Artigo.updateOne({_id: req.params.id}, req.body, (erro) =>{
         if(erro)return res.status(400).json({
         error:true,
         message:"Erro: Aritgo não editado com sucesso" 
      })
      return res.json({
         error:false,
         message:"Editado com sucesso"
      });
   });
});


//Delete na API e banco de dados 
app.delete("/artigo/delete/:id",(req,res)=>{
   const artigo = Artigo.deleteOne({_id: req.params.id}, (erro)=>{
      if(erro)return res.status(400).json({
         error:true,
         message:"Erro: Artigo não deletado" 
      })
      return res.json({
         error:false,
         message:"Artigo deletado"
      });
   })
})

app.listen(port, () =>{
   console.log(`Servidor iniciado na porta ${port}: http://localhost:${port}`);
})
