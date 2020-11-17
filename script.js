const express=require('express');
const body = require('body-parser');
const bcrypt =require('bcrypt-nodejs');
const cors=require('cors');
const app=express();
app.use(body.urlencoded({
  extended: true
}));
app.use(body.json());
app.use(cors());
console.log("mmmmm");
var knex = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'jayaswini',
    database : 'smartbrain'
  }

});
 console.log("kk");
app.post('/register',(req,res)=>{
var hash = bcrypt.hashSync(req.body.password);
knex.transaction(trx=>{
      trx.insert({
        hash:hash,
        email:req.body.email
      }).into('login1').returning('email').then(loginemail=>{
        return trx('people1')
  .returning('*')
  .insert({
    name: req.body.name,
    email: loginemail[0],
    joined: new Date()
  })
  .then(response=>{
  res.json(response)
   })
})
      .then(trx.commit)
      .catch(trx.rollback)
  })
      .catch(err=>res.status(200).json("unable to register"));
});
app.post('/signin',(req,res)=>{
  knex.select('email', 'hash').from('login1')
    .where('email', '=', req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      console.log(isValid);
      if (isValid) {
        return knex.select('*').from('people1')
          .where('email', '=', req.body.email)
          .then(user => {
            res.json('yes')
          })
          .catch(err => res.status(400).json('unable to get user'))
      } else {
        res.status(400).json('wrong credentials')
      }
    })
    .catch(err => res.status(400).json('wrong credentials'))
  //bcrypt.compare("veggie", hash, function(err, res) {
    // res == true
//});

});
app.post('/blog',(req,res)=>{
    knex('blog').insert({
      title: req.body.title,
      description: req.body.description

  }).then(console.log);
    knex.select('*').from('blog').then(data=>{
      console.log(data);
    });
  
    res.json("yes");
});


app.listen(3000);