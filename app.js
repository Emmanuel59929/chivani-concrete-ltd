const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const MONGO_URI = process.env.MONGO_URI || 'YOUR_MONGODB_ATLAS_LINK_HERE';

mongoose.connect(MONGO_URI).then(()=>console.log('✅ MongoDB Connected - Data will sync!')).catch(e=>console.log('Mongo Error', e));

const Schema = new mongoose.Schema({}, {strict:false, timestamps:true});
const Sale = mongoose.model('Sale', Schema);
const Prod = mongoose.model('Prod', Schema);
const Exp = mongoose.model('Exp', Schema);
const Item = mongoose.model('Item', Schema);
const Worker = mongoose.model('Worker', Schema);

app.get('/api/data', async (req,res)=>{
  const sales = await Sale.find();
  const prods = await Prod.find();
  const exps = await Exp.find();
  const items = await Item.find();
  const workers = await Worker.find();
  res.json({sales, prods, exps, items, workers});
});

app.post('/api/sale', async (req,res)=>{ const s = new Sale(req.body); await s.save(); res.json(s); });
app.post('/api/prod', async (req,res)=>{ const p = new Prod(req.body); await p.save(); res.json(p); });
app.post('/api/exp', async (req,res)=>{ const e = new Exp(req.body); await e.save(); res.json(e); });

app.delete('/api/:type/:id', async (req,res)=>{
  const models = {sale:Sale, prod:Prod, exp:Exp};
  if(models[req.params.type]) await models[req.params.type].findByIdAndDelete(req.params.id);
  res.json({ok:true});
});

app.put('/api/:type/:id', async (req,res)=>{
  const models = {sale:Sale, prod:Prod, exp:Exp};
  const updated = await models[req.params.type].findByIdAndUpdate(req.params.id, req.body, {new:true});
  res.json(updated);
});

app.get('/', (req,res)=>res.sendFile(path.join(__dirname, 'chivani.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log('CHIVANI ONLINE on '+PORT));