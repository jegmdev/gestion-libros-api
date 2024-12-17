const express = require('express');
const dotenv = require('dotenv');
const Book = require('./models/book');
const sequelize = require('./config/database');

dotenv.config();

const app = express();
app.use(express.json());

// Conectar a la base de datos
sequelize.authenticate().then(() => {
  console.log('Conexión a la base de datos establecida con éxito.');
}).catch(err => {
  console.error('Error al conectar a la base de datos:', err);
});

// Endpoint para listar libros
app.get('/books', async (req, res) => {
  try {
    const books = await Book.findAll();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los libros.' });
  }
});

// Endpoint para agregar un libro
app.post('/books', async (req, res) => {
  const { title, author, year } = req.body;
  try {
    const newBook = await Book.create({ title, author, year });
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar el libro.' });
  }
});

// Endpoint para editar un libro
app.put('/books/:id', async (req, res) => {
  const { id } = req.params;
  const { title, author, year } = req.body;
  try {
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ message: 'Libro no encontrado.' });
    }
    book.title = title;
    book.author = author;
    book.year = year;
    await book.save();
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el libro.' });
  }
});

// Endpoint para eliminar un libro
app.delete('/books/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ message: 'Libro no encontrado.' });
    }
    await book.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el libro.' });
  }
});

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

sequelize.sync({ force: true }).then(() => {
    console.log('Base de datos sincronizada.');
  });
  