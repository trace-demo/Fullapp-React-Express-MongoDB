
const mongoose = require('mongoose');
const express = require('express');

const cors = require('cors');
const bodyParser = require('body-parser');

const dbData = require('./data');




// database //inject your own db username & password
const dbRoute =
  'mongodb+srv://<name>:<pwd>@cluster0.nvv4d.mongodb.net/<dbname>?retryWrites=true&w=majority';


mongoose.connect(dbRoute, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

let db = mongoose.connection;


db.once('open', () => console.log('connected to the database'));

db.on('error', console.error.bind(console, 'MongoDB connection error:'));





// server
const app = express();
const router = express.Router();

const API_PORT = 3001;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());




/* api */

router.get("/", (req, res) => {
    res.json({ message: "HELLOW WORLDUUHHHH" });
  });





// add-show-delete // update

router.post('/putData', (req, res) => {
    let data = new dbData();
  
    const { id, message } = req.body;
  
    if ((!id && id !== 0) || !message) {
      return res.json({ success: false, error: 'invalid inputs'});
    }

    data.id = id;
    data.message = message;

    data.save((err) => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true });
    });
  });




router.delete('/deleteData', (req, res) => {
    const { id } = req.body;

    dbData.findByIdAndRemove(id, (err) => {
      if (err) return res.send(err);
      return res.json({ success: true });
    });
  });  




router.get('/getData', (req, res) => {
    dbData.find((err, data) => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true, data: data });
    });
  });





router.post('/updateData', (req, res) => {
  const { id, update } = req.body;

  dbData.findByIdAndUpdate(id, update, (err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success:true });
  })
})  




// launch 
app.use('/api', router);

app.listen(API_PORT, () => console.log(`listening on port ${API_PORT}`));
