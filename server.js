const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const connect = require('knex');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const fileUpload = require('express-fileupload');
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());
app.use('/public',express.static(__dirname + '/public'));


const postgres = connect({

client:'pg',
connection:{
	host :'localhost',
	user : 'vishal',
	password : 'vishal0789',
	database : 'database'
}
})
//sign.......................................................................................................................................
app.post('/sign',(req,res)=>{

const {email,password} = req.body;
postgres.select('email','password','name','id').from('register').where({email:email}).then(data=>{
if(password === ""){
	res.json('error');
}else{
isValid =bcrypt.compareSync(password, data[0].password);
if(isValid){
	postgres.insert({email:data[0].email,sid:data[0].id}).into("sessiont").returning('*').then(data=>{
		res.json(data);
	})
} else{
  res.json('error');

}
}

})
})
//..........................get Register
app.get('/res',(req,res)=>{
	postgres.select('*').from('register').then(data=>{



			res.json(data);


})
})
//register................................................................................................................................................
app.post('/register',(req,res)=>{

const {name,email,password} = req.body;
const hash = bcrypt.hashSync(password);
console.log(hash);
postgres.select('email').from('register').where({email:email}).then(data=>{
	if(data.length >0){
		res.json("already exist");
	}else{
		postgres.insert({name:name,email:email,password:hash})
		.into('register')
		.returning('*').then(data=>{
		  res.json(data);

		})
	}
})

})
var array = [];
//post submit........................................................................................................................................
app.post('/post',(req,res,next)=>{

const {filename,uid} = req.body;
console.log(parseInt(req.body.uid));
const time = new Date();
const h = time.getHours();
const m = time.getMinutes();
const s = time.getSeconds();
const change = h+":"+m+":"+s;
let imageFile = req.files.file;
name = imageFile.name;

imageFile.mv(`${__dirname}/public/${name}`, function(err) {
	if (err) {
		return res.status(500).send(err);
		`public/${data[0].img}`
	}else{
	postgres.insert({likes:0,user_id:uid,des:filename,time:change,img:`public/${name}`})
	.into('feed')
	.returning('*').then(data=>{
		res.json({file:data[0].img,value:data[0].des});

	  console.log(data[0].user_id);
	})





}

})
})

app.post("/upload",(req,res)=>{
	let imageFile = req.files.file;
	name = imageFile.name;
console.log(name);
	imageFile.mv(`${__dirname}/public/${name}`, function(err) {
		if (err) {
			return res.status(500).send(err);

		}else{

			res.json({file:`public/${name}`});

		}
})
})


//feed getting...........................................................................................................................................
app.get('/get',(req,res)=>{
postgres.select('*').from('feed').then(data=>{



		res.json(data);






})
})
//.........................................................................................................................

app.get('/likes',(req,res)=>{
	postgres.select('*').from('feed').then(data=>{
		data.map((users,i)=>{
			postgres.select('cont_id','user_id').from('likepost').where({cont_id:users.cid}).then(values=>{
				if(values.length>0){
			 var count = values.length;
				i = values[0].cont_id;
			 postgres('feed').where({cid:i}).update({likes:count}).returning('*').then(data=>console.log(data));
		 }else{
			 console.log("empty");
		 }





			})
		})
	})

//postgres('feed').where({cid:1}).update({likes:2}).returning('*').then(data=>res.json(data));

})
//like.................................................................................................................................................
app.post('/like',(req,res)=>{
const {conid,likebyid} = req.body;
postgres.select('*').from('likepost').where({cont_id:conid,user_id:likebyid}).then(data=>{
	if(data.length>0){
		console.log("error");
	}else{
		postgres.insert({user_id:likebyid,cont_id:conid}).into("likepost").returning('*').then(data=>{
			res.json(data);
			console.log(data);

		})

	}
})


})

//host.......................................................................................................................................................
app.listen(3001,()=>{
  console.log('running 3001');
})
