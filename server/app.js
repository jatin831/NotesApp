const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const Schema = mongoose.Schema;

const noteSchema = new Schema({
    text: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    }
  }
)

const Note = mongoose.model('Note', noteSchema);

app.post('/notes', (req, res, next) => {
  const { text, date } = req.body;

  const note = new Note({
    text: text,
    date: date
  })

  note.save()
    .then(result => {
      Note.find()
        .then(notes => {
          res.json(notes);
        })
        .catch(err => {
          next(err);
        })
    })
    .catch(err => {
      next(err);
    })
})

app.get('/notes', (req, res, next) => {
  Note.find()
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      next(err);
    })
})

app.delete('/notes', (req, res, next) => {
  const id = req.body.id;
  Note.deleteOne({_id: id})
    .then(result => {
      if (result.deletedCount == 0) {
        const error = new Error(`Note with id: ${id} not found`);
        error.statusCode = 401;
        return next(error);
      }
      Note.find()
        .then(notes => {
          res.json(notes);
        })
        .catch(err => {
          next(err);
        })
    })
    .catch(err => {
      next(err);
    })
})

app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.statusCode = 404;
    next(err);
})

app.use((err, req, res, next) => {
    console.log(err);
    const status = err.statusCode || 500;
    const message = err.message;
    res.status(status).json({message: message});
})

mongoose.connect('mongodb://localhost:27017/db', 
{ 
    useUnifiedTopology: true, 
    useNewUrlParser: true 
})
.then(result => {
    app.listen(process.env.PORT || 5000);
    console.log("Server started at port 5000");
})
.catch(err => {
    console.log(err);
})