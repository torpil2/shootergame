let count = 0;
const path = require("path");

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const fs = require('fs');
const bodyParser = require('body-parser');

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  };
const app = express();
const server = http.createServer(options, app);
const io = socketIO(server);
app.use(express.static(path.join(__dirname, "public")));

// Odaları saklamak için bir nesne oluşturun
const odalar = {};

app.get('/api/someendpoint', (req, res) => {
  // Handle the POST request here
  const requestData = req.body;

  // Process the data (e.g., perform some computation)
  const responseData = odalar;

  // Send a response back to the client
  res.json(responseData);
});

io.on('connection', (socket) => {

  /////////////////////////////////////

  socket.on("passwordcheck",(values)=>{
   
    if(odalar[values.odaAdi]){
    if(odalar[values.odaAdi][1].password == undefined  || odalar[values.odaAdi][1].password == null){

     // io.in(socket.id).emit("LoginPassword","sifreyok");  
      if(odalar[values.odaAdi][0].sayac >0 && values.username == undefined && odalar[values.odaAdi][0].sayac <2 )
      {
        io.in(socket.id).emit("LoginPassword","sifredogru");
        io.in(values.odaAdi).emit("YeniKullanıcıEklendi",odalar[values.odaAdi]);
      }
    
    
    }
    else if(odalar[values.odaAdi][1].password != undefined  || odalar[values.odaAdi][1].password != null)
    {
      io.in(socket.id).emit("LoginPassword","firstuser");
    }
    }
    else if(values.username == undefined || values.username == null)
    {
      io.in(socket.id).emit("LoginPassword","firstuser");

    }
   
  })


  function katil(infos)
  {
    var odaAdi = infos.odaAdi;
    var username = infos.username;    
    if(!odalar[odaAdi]){
    odalar[odaAdi] = [];    
    odalar[odaAdi].push({sayac:0})
    odalar[odaAdi].push({password:undefined});
   
  }          
    odalar[odaAdi]
    var sayacvalue = (odalar[odaAdi][0].sayac);
    if(sayacvalue<2){

      if(odalar[odaAdi][1].password == undefined)
      {
        odalar[odaAdi].push({kullanici : username, id : socket.id,isready:false,hp:100});
        odalar[odaAdi][0].sayac +=1; 
        socket.join(odaAdi);  
        console.log(socket.rooms);
     
        io.in(odaAdi).emit("YeniKullanıcıEklendi",odalar[odaAdi]);
      }   
      else if(odalar[odaAdi][1].password != undefined )
      {
        if(infos.password !=undefined && odalar[odaAdi][1].password == infos.password)
        {
          io.in(odaAdi).emit("LoginPassword","firstuser");

        }
        else if(infos.password !=undefined && odalar[odaAdi][1].password != infos.password)
        {
          io.in(odaAdi).emit("LoginPassword","sifrevar");

        }

      }
    }

     if(sayacvalue==2)
    {
      odalar[odaAdi].push({wind:undefined});
    }
    
   
    };

  //   socket.on("loginwithpass",values=>{
     
  //     if(odalar[values.odaAdi][1].password==values.pass)
  //     {
  //       io.in(socket.id).emit("LoginPassword",true);
  //     }
  //     else
  //     {
  //       io.in(socket.id).emit("LoginPassword",false);
  //     }

  // })



    socket.on('odaKatil',(infos)=>{   
        
    var odaAdi = infos.odaAdi;
    var username = infos.username;    

    if(!odalar[odaAdi]){
    odalar[odaAdi] = [];    
    odalar[odaAdi].push({sayac:0})
    odalar[odaAdi].push({password:undefined});
   
  }     
  console.log("username= ", infos.username);
    var sayacvalue = (odalar[odaAdi][0].sayac);//1
    if(sayacvalue<2){
      
      
     //   io.to(socket.id).emit("passwordExist",odalar[odaAdi]);     
     if(odalar[infos.odaAdi][1].password==undefined)    
     {
      if(infos.username != undefined)
      {
        odalar[odaAdi].push({kullanici : username, id : socket.id,isready:false,hp:100});
        odalar[odaAdi][0].sayac +=1; 
        socket.join(odaAdi);  
        console.log(socket.rooms);


        io.in(socket.id).emit("LoginPassword","sifredogru");
        io.in(odaAdi).emit("YeniKullanıcıEklendi",odalar[odaAdi]);
  
      }else if(infos.username == undefined)
      {
        io.in(socket.id).emit("LoginPassword","NoPassNoUsername");
      }
      
     

     }     

     //İLK KULLANICI GİRİŞ YAPTIĞINDA ,ŞİFRE KOYMA OPSİYONLU ODA KATILMA 
    if(odalar[odaAdi][1].password == undefined && odalar[odaAdi][0].sayac==1 || odalar[odaAdi][1].password == null && odalar[odaAdi][0].sayac==1){
      io.in(socket.id).emit("PasswordScreen",odalar[odaAdi]);

    }
    else if(odalar[odaAdi][1].password != undefined && odalar[odaAdi][1].password != null  && sayacvalue<2)
    {
      if( infos.password != odalar[odaAdi][1].password)
      {
      
        io.in(socket.id).emit("LoginPassword","sifrevar");
      }
      else if(infos.password == odalar[odaAdi][1].password)
      {
       
        io.in(socket.id).emit("LoginPassword","sifredogru");   
        odalar[odaAdi].push({kullanici : username, id : socket.id,isready:false,hp:100});
        odalar[odaAdi][0].sayac +=1; 
        socket.join(odaAdi);    
        io.in(odaAdi).emit("YeniKullanıcıEklendi",odalar[odaAdi]);
        console.log(socket.rooms);

    
      }
    }
    }

    else if(sayacvalue==2)
    {
      odalar[odaAdi].push({wind:undefined});
    }
    io.in(odaAdi).emit("YeniKullanıcıEklendi",odalar[odaAdi]);

    })

  
    ///////////////////////////////////



    socket.on("setPassword",(values)=>{
      var myset = socket.rooms;
      var roomname = Array.from(myset)[1];
  
      odalar[roomname][1].password=values.password;
    
     

    })


    //////////////////////////////////////
    function remove(obj, key) {
      for (k in obj) {
          if (k==key) {
              delete obj[k];
          }else if (typeof obj[k] === 'object') {
              remove(obj[k], key);
          }
      }
  }
    socket.on("leave",(deneme)=>{
     var myset = socket.rooms;
     var roomname = Array.from(myset)[1];
    
    
     
  remove(odalar,roomname);
     socket.leave(roomname);
     //OYUNU DURDURMA
    //  odalar[roomname][0].sayac =0;  

     
      io.in(roomname).emit("leaved",odalar[roomname]);
      io.to(socket.id).emit("ileaved",odalar[roomname]);
      console.log("tüm odalar= ",odalar);

      // for (let index = 0; index < odalar.length; index++) {
      //   const element = odalar[index];
      //   console.log("for elementleri= ", element);
      //   if(element === roomname) 
      //   {      
      //      odalar.splice(index,1);
      //   }     
      //   //belirli bir client'e emit işlemi
      

      //   //belirli bir odaya emit işlemi
      //   io.in(roomname).emit("YeniKullanıcıEklendi",odalar[roomname]);        
      // }
    })
    socket.on("shoot",(username)=>{
  
   

   


   
    var myset = socket.rooms;
    var roomname = Array.from(myset)[1];
  
    var windvalue =   odalar[roomname][4]
    var powervalue= parseFloat(username.powervalueS)+parseFloat(windvalue);
    var anglevalue =  username.anglevalueS
  
    var user =username.username; 
   io.in(roomname).emit("shooted", {kullanici:user,powervalueS:powervalue,anglevalueS:anglevalue});         
  })
  socket.on("changeTurn",(username)=>{
 
    var myset = socket.rooms;
    var roomname = Array.from(myset)[1];

    console.log("atış yapan kullanıcı = ",username)
    let wind = (Math.random() * 10 -5).toFixed(2) ;


      odalar[roomname][4]= wind
    if(odalar[roomname][2].kullanici == username)
    {   
      if(odalar[roomname][3].hp > 0)
      {
        io.in(roomname).emit("nextTurn",{turnUser:odalar[roomname][3].kullanici,wind:wind});   
      }   
    }
    else
    {     
      if(odalar[roomname][2].hp > 0)
      {
      io.in(roomname).emit("nextTurn",{turnUser:odalar[roomname][2].kullanici,wind:wind});      
      }
    }
 
  })  
  socket.on("hit",(username)=>{
   
    var myset = socket.rooms;
    var roomname = Array.from(myset)[1];


    if(odalar[roomname][2].kullanici == username)
    {
      odalar[roomname][3].hp -= 33;
      io.in(roomname).emit("damageBar",{kullanici: odalar[roomname][3].kullanici,hp: odalar[roomname][3].hp});
      if(odalar[roomname][3].hp<=0)
      {
        io.in(roomname).emit("endgame",username);
      }
    }
    else
    {
      odalar[roomname][2].hp -= 33;
      io.in(roomname).emit("damageBar",{kullanici: odalar[roomname][2].kullanici,hp: odalar[roomname][2].hp});
      if(odalar[roomname][2].hp<=0)
      {
        io.in(roomname).emit("endgame",username);

      }


    }


  }) 

  socket.on("restartGame",(username)=>{
    var myset = socket.rooms;
    var roomname = Array.from(myset)[1];
    var myArray = Object.keys(odalar[roomname]);
    var dolu = Object.values(odalar[roomname]);
    if(odalar[roomname].length>3)
    {
      odalar[roomname][2].hp = 100
      odalar[roomname][3].hp = 100
    }
    io.in(roomname).emit("resetValues",username);
  })

   socket.on("ready",(infos)=>{
    var myset = socket.rooms;
    var roomname = Array.from(myset)[1];
   

    
    for (let index = 0; index < odalar[roomname].length; index++) {
      const element = odalar[roomname][index];
      if(element.id === socket.id) 
      {            
        if( element['isready'] == true)
        {
          element['isready'] = false;
        }
        else if(element['isready'] == false)
        {
          element['isready'] = true;
        }
      }       
        io.to(socket.id).emit("readycheck", element['isready']);
          let readycount = 0;

          for (let index = 2; index < odalar[roomname].length; index++) {
            const element = odalar[roomname][index]; 
          
            // Check if 'element' is defined
            if (element !== undefined) {
            
              
              if (element['isready'] !== undefined && element['isready'] === true) {
                readycount += 1;
              }
          
            
              
              if (readycount >= 2) {
                var min = -5.00; // Minimum value
                var max = 5.00;  // Maximum value
                
                // Generate a random float within the specified range with two decimal places
                let wind = (Math.random() * 10 - 5).toFixed(2);
                
                odalar[roomname][4] = wind;
                io.in(roomname).emit("gamestart", odalar[roomname]);
              }
            }
          }
  }});
});
server.listen(3000, () => {
  console.log('Sunucu çalışıyor...');
});
