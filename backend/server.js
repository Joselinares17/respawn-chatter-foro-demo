import express from "express";
import bodyParser from "body-parser"
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Simulación de una base de datos con un array
let comments = [];

// Controlador de comentarios
const commentController = {
  getAll: (req, res) => {
    res.json(comments);
  },

  create: (req, res) => {
    const newComment = {
      id: Date.now(),
      text: req.body.text
    };
    comments.push(newComment);
    res.status(201).json(newComment);
  },

  update: (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    const commentIndex = comments.findIndex(comment => comment.id === parseInt(id));

    if (commentIndex > -1) {
      comments[commentIndex].text = text;
      res.json(comments[commentIndex]);
    } else {
      res.status(404).json({ message: 'Comentario no encontrado' });
    }
  },

  delete: (req, res) => {
    const { id } = req.params;
    const commentIndex = comments.findIndex(comment => comment.id === parseInt(id));

    if (commentIndex > -1) {
      comments.splice(commentIndex, 1);
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Comentario no encontrado' });
    }
  }
};

// Rutas
app.get('/comments', commentController.getAll);
app.post('/comments', commentController.create);
app.put('/comments/:id', commentController.update);
app.delete('/comments/:id', commentController.delete);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});