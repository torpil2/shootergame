const odaAdi = new URLSearchParams(window.location.search).get("oda"); // URL'den oda adını alın
console.log(odaAdi);
var username ;
var UsersInLobby = [];
var enemypos= [];
var turnCount  =11;
var gamestart = false;
var counterint ;
var egim = true;
var SaatYonuHareketliCizginew;
let odaadi ;
let password;

const socket = io.connect('http://localhost:3000', {
  query: { oda: odaAdi } // Oda adını sorgu parametresi olarak iletiliyor
});



$(document).ready(function() {   
  const urlParams = new URLSearchParams(window.location.search);
  odaadi = urlParams.get('oda');
//odaya girildiğinde şifre olup olmadığını veya odanın olup olmadığını check ediyor 
  socket.emit("passwordcheck",{odaAdi:odaadi,username:username,password:password})   
 console.log("veryfirstcheck");
});

function passwordcheckfunc(odaadi)
{
  if(document.getElementById("UsernameInput"))
  {
    username = document.getElementById("UsernameInput").value

  }

  if(document.getElementById("PasswordEnterInput"))
  {
    password = document.getElementById("PasswordEnterInput").value

  }
  

  const urlParams = new URLSearchParams(window.location.search);

  odaadi = urlParams.get('oda');
  socket.emit("passwordcheck",{odaAdi:odaadi,username:username,password:password})   

}


socket.on("LoginPassword",value=>{ 
  console.log(username);
  console.log(value);
  if(value=="firstuser" && username == undefined || value == "sifredogru" && username == undefined)
  {
    console.log("kullanıcı adı belirle code.js");
    document.querySelector('.app').innerHTML = `
    <div class="nav-button m-2"><span> 
       <input type="text" id="UsernameInput" class="input-group-text no-gutters col-12"  placeholder="Kullanıcı Adı Giriniz..">
      </span>
      </div>
    <div class="nav-button m-3">
      <span>
        <button class="btn btn-success btn-block" onclick="join()">Gönder</button>
        </span>
        </div>
        <script>
       
        </script>
  
    `
  }//DÜZELTİLECEK
  else if( value == "sifrevar"  )
  {
    document.querySelector(".app").innerHTML="";
    document.querySelector(".app").innerHTML += `
    <div class="nav-button m-2"><span> 
    <input type="text" id="PasswordEnterInput" class="input-group-text no-gutters col-12"  placeholder="Şifre Giriniz">
   </span>
   </div>
  <div class="nav-button m-3">
   <span>
     <button class="btn btn-success btn-block" onclick="join()">Katıl</button>
     </span>
     </div>
    `;

  }
  else if(value == "sifrebelirle")
  {
    
    document.getElementById("app").innerHTML ="";

  document.getElementById("password").innerHTML ="";
  document.getElementById("password").innerHTML =`
  <div class="nav-button m-2"><span> 
  <input type="text" id="PasswordInput" class="input-group-text no-gutters col-12"  placeholder="Şifre Giriniz">
 </span>
 </div>
<div class="nav-button m-3">
 <span>
   <button class="btn btn-success btn-block" onclick="setPassword()">Odayı Şifrele</button>
   </span>
   </div>`
   ;
     

     document.getElementById("mesajlar").innerHTML += 
     `
     <button class="btn btn-danger btn-block mt-3" onclick="ready()">Not Ready</button>
     `
  }
  else if(value =="NoPassNoUsername")
  {
    document.querySelector('.app').innerHTML += `
    <div class="nav-button m-2"><span> 
       <input type="text" id="UsernameInput" class="input-group-text no-gutters col-12"  placeholder="Kullanıcı Adı Giriniz..">
      </span>
      </div>
    <div class="nav-button m-3">
      <span>
        <button class="btn btn-success btn-block" onclick="join()">Gönder</button>
        </span>
        </div>
     
  
    `
  }
  else if(value == "sifredogru" && username != undefined)
  {
    
    
    document.getElementById("nav-footer-heading").innerHTML += `
    <div id="nav-footer-avatar">
    <img src="data:image/jpeg;base64,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"/>
      </div>
      <div id="nav-footer-titlebox"><a id="nav-footer-title" >${username}</a><span id="nav-footer-subtitle">oyuncu</span></div>
      <label for="nav-footer-toggle"><i class="fas fa-caret-up"></i></label>
  `;
      // document.querySelector('.app').innerHTML = "";

      document.getElementById("mesajlar").innerHTML += 
      `
      <button class="btn btn-danger btn-block mt-3" onclick="ready()">Not Ready</button>
      `

  }
});


  
  






function join()
{   
  if(document.getElementById("UsernameInput"))
  {

    username= document.getElementById("UsernameInput").value;
  }

  if(document.getElementById("PasswordEnterInput"))
  {
    password = document.getElementById("PasswordEnterInput").value;
  }
  console.log("sifrem= ", password);
    socket.emit('odaKatil', {odaAdi:odaAdi,username:username,password:password});
    console.log(username);

}





    function odaKatil() {
        if(username == null || username == undefined) {
        document.querySelector('.app').innerHTML = `
        <div class="nav-button m-2"><span> 
           <input type="text" id="UsernameInput" class="input-group-text no-gutters col-12"  placeholder="Kullanıcı Adı Giriniz..">
          </span>
          </div>
        <div class="nav-button m-3">
          <span>
            <button class="btn btn-success btn-block" onclick="join()">Gönder</button>
            </span>
            </div>
      
        `;}}

   





socket.on("YeniKullanıcıEklendi",function(username){   
updateUserList(username);
})

function updateUserList(element)
{
    if(element!=null || element != undefined)
      {
        document.getElementById("app").innerHTML ="";
       document.getElementById("nav-footer-content").innerHTML ="";
     
        document.getElementById("app").innerHTML +=`
       <div class="nav-button"><button class="btn btn-danger btn-block" onclick="ayril()">Ayril</button></div>`
       document.getElementById("nav-footer-content").innerHTML += `
       <h4>Oyuncular</h4>
       <hr/>
       `
       
    element.forEach(value => {
    if(value['kullanici']!=undefined )
    {    
        document.getElementById("nav-footer-content").innerHTML += `
      <a>${value['kullanici']}</a>`;
    } 
    else
    {   
    } 
  });}}




  function decreaseTimer()
  {
  turnCount -=1;
  if(turnCount >=0)
  {
  document.getElementById("turnText").innerHTML = turnCount +"...";


 
  }
  if(turnCount <=0)
  {

    
    document.getElementById("GameBtns").innerHTML = "";
    document.getElementById("canvas2").style.display = "none";
    document.getElementById("canvas4").style.display = "none";
    document.getElementById("turnText").innerHTML = "Opponent Turn...";  
    socket.emit("changeTurn",username);


  }
  }



socket.on("PasswordScreen",(odaadi)=>{
  console.log("EKLEDİM ŞİFRE")

  document.getElementById("password").innerHTML ="";
  document.getElementById("password").innerHTML =`
  <div class="nav-button m-2"><span> 
  <input type="text" id="PasswordInput" class="input-group-text no-gutters col-12"  placeholder="Şifre Giriniz">
 </span>
 </div>
<div class="nav-button m-3">
 <span>
   <button class="btn btn-success btn-block" onclick="setPassword()">Odayı Şifrele</button>
   </span>
   </div>`;
  
  
    

  

})

function setPassword() {

  let  password =  document.getElementById("PasswordInput").value

  socket.emit("setPassword",{password:password,username:username});
  document.getElementById("password").innerHTML ="";

  
}

socket.on("passwordExist",value=>{
  console.log("ŞİFRE VAR");
})

function ready()
{
  socket.emit("ready","value");
}
socket.on("readycheck",(values)=>{
  
  document.getElementById("mesajlar").innerHTML = "";
if(values == true)
{
  document.getElementById("mesajlar").innerHTML += `
  <button class="btn btn-success  btn-block mt-3" onclick="ready()">Ready</button>
  `
}
else
{
  document.getElementById("mesajlar").innerHTML += `
  <button class="btn btn-danger btn-block mt-3" onclick="ready()">Not Ready</button>
  `
}
})

socket.on("gamestart",(value)=>{
 console.log("wind değer= ",value[4])
 document.getElementById("windText").innerHTML = "🍃"+value[4]
  console.log("oyun başladı")
  //document.getElementById("readydiv").style.display = "none";
  document.getElementById("canvas5").style.display = "none";
  document.getElementById("ingamediv").style.filter ="blur(0rem)";
  
  document.getElementById("mesajlar").innerHTML = "";
  if(value[2]['kullanici'] == username)
  {
  
    clearInterval(counterint);
     counterint =  setInterval(decreaseTimer, 1000);
 
    document.getElementById("GameBtns").innerHTML = `
    <button id="button" class="btn-Start_green stopBtnMe" onclick="getEgimValue()">Angle</button>;
    `
     SaatYonuHareketliCizginew = new SaatYonuHareketliCizgi('canvas2',200,550);
  }
  console.log("oyun basliyor");

  value.forEach(element => {
    if(element['kullanici']!=undefined )
    {
    
      if( element['kullanici'] == username)
      {
        document.getElementById("playeronename").innerHTML = `
      <h4>${element['kullanici']}</h4>`;
      
      }
      else
      {
        document.getElementById("playertwoname").innerHTML =`
        <h4>${element['kullanici']}</h4>`;
        
      }
       
    } 
  });


 
 

})

document.getElementById("titlename").innerHTML = odaAdi +" Odası";

socket.on("nextTurn",(values)=>{
  
  
  document.getElementById("windText").innerHTML = "🍃"+values.wind
  if(values.turnUser == username)
  {
    clearInterval(counterint);

    turnCount = 11;
    document.getElementById("canvas2").style.display = "block";

     counterint =   setInterval(decreaseTimer, 1000);
    document.getElementById("GameBtns").innerHTML = `
    <button id="button" class="btn-Start_green stopBtnMe" onclick="getEgimValue()">Angle</button>;

    `
    const SaatYonuHareketliCizginew = new SaatYonuHareketliCizgi('canvas2',200,550);
 
    
  }
  else
  {
    clearInterval(counterint);
  }
})

function ayril()
{
  socket.emit("leave","valuee");

}

socket.on("leaved",(leaved)=>{
  // username=null;
  // document.getElementById("nav-footer-content").innerHTML ="";
  // document.getElementById("app").innerHTML ="";
  // document.getElementById("nav-footer-heading").innerHTML ="";
  // document.getElementById("mesajlar").innerHTML ="";
  // updateUserList();
  // odaKatil();
  location.reload();
  console.log("GELDİ");


})
socket.on("ileaved",leaved=>{
  window.location.href = 'http://localhost:3000'
})

socket.on("shooted",(returnedusername)=>{
  console.log("SHOOTED DÖNDü");
  console.log(returnedusername);
  if(returnedusername.kullanici == username )
  {
  const movingBall = new MovingBall('canvas2',returnedusername.powervalueS,(-returnedusername.anglevalueS));
  }
  else
  {
      const movingBallEnemy = new MovingBallEnemy('canvas2',returnedusername.powervalueS,(-returnedusername.anglevalueS));

  }

})





let anglevalue = 0;
let powervalue = 0;
var dikdortgenAnimasyon;
// Çöp Adam sınıfı
class CopAdam {
    constructor(context, x, y) {
        this.context = context;
        this.x = x;
        this.y = y;
    }
    
    draw() {
        // Baş
        this.context.beginPath();
        this.context.arc(this.x, this.y - 20, 10, 0, Math.PI * 2);
        this.context.fillStyle = 'brown';
        this.context.fill();
        this.context.closePath();

        // Gövde
        this.context.beginPath();
        this.context.moveTo(this.x, this.y - 10);
        this.context.lineTo(this.x, this.y + 20);
        this.context.strokeStyle = 'brown';
        this.context.stroke();
        this.context.closePath();

        // Kol 1
        this.context.beginPath();
        this.context.moveTo(this.x, this.y);
        this.context.lineTo(this.x - 20, this.y + 10);
        this.context.strokeStyle = 'brown';
        this.context.stroke();
        this.context.closePath();

        // Kol 2
        this.context.beginPath();
        this.context.moveTo(this.x, this.y);
        this.context.lineTo(this.x + 20, this.y + 10);
        this.context.strokeStyle = 'brown';
        this.context.stroke();
        this.context.closePath();

        // Bacak 1
        this.context.beginPath();
        this.context.moveTo(this.x, this.y + 20);
        this.context.lineTo(this.x - 10, this.y + 40);
        this.context.strokeStyle = 'brown';
        this.context.stroke();
        this.context.closePath();

        // Bacak 2
        this.context.beginPath();
        this.context.moveTo(this.x, this.y + 20);
        this.context.lineTo(this.x + 10, this.y + 40);
        this.context.strokeStyle = 'brown';
        this.context.stroke();
        this.context.closePath();
    }
}

class SaatYonuHareketliCizgi {
  
    constructor(canvasId,startX,startY) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        this.centerX = startX;
        this.centerY = startY;
        
          //SOL TARAFTAKİ OYUNCU İÇİN ANGLE = 5 , SAĞ TARAF OYUNCU = 10.5~
        this.angle = 6; // Başlangıç açısı
        this.radius = 100;
        this.speed = 0.01; // Hızı ayarlayabilirsiniz
        //SOL TARAF OYUNCU İÇİN DİRECTİON =1 , SAĞ İÇİN = -1
        this.direction = 1; // Hareket yönü (1: İleri, -1: Geri)
      //  this.animate();
         this.isAnimating = true;

         this.animationButton = document.getElementById('button');
         this.animationButton.addEventListener('click', this.toggleAnimation.bind(this));
         
         this.animate();
        // Animasyonu durdurmak için bir buton ekleyin
        // this.stopButton = document.getElementById('stopButton');
        // this.stopButton.addEventListener('click', this.stopAnimation.bind(this));
    }
  
    temizle()
    {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.isAnimating = false;
    }

    toggleAnimation() {
        if (this.speed>0) {   
            this.speed = 0 ; 
         
        } else if(this.speed<=0) {
            this.speed=0.01;              
                   
        }    
    }   

    animate() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const x = this.centerX + Math.cos(this.angle) * this.radius;
        const y = this.centerY - Math.sin(this.angle) * this.radius;
        this.context.beginPath();
        this.context.moveTo(this.centerX, this.centerY);
        this.context.lineTo(x, y);
        this.context.stroke();

        this.angle += this.speed * this.direction;

        if (this.angle > 7.25 || this.angle < 6) {
            this.direction *= -1; // Yönü tersine çevir
        }
        anglevalue = ((this.angle-6)*13)
       
       
        // Animasyon devam ediyorsa, bir sonraki çerçeveyi iste
        if (this.isAnimating) {
            this.animationId = requestAnimationFrame(this.animate.bind(this));
        }       
        else
        {
          this.context.clearRect(0,0,this.width,this.height);
        }
       

    }
}


class SaatYonuTersHareketliCizgi {  

    constructor(canvasId,startX,startY) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        this.centerX = startX;
        this.centerY = startY;
          //SOL TARAFTAKİ OYUNCU İÇİN ANGLE = 5 , SAĞ TARAF OYUNCU = 10.5~
        this.angle = 10.5; // Başlangıç açısı
        this.radius = 100;
        this.speed = 0.005; // Hızı ayarlayabilirsiniz
        //SOL TARAF OYUNCU İÇİN DİRECTİON =1 , SAĞ İÇİN = -1
        this.direction = -1; // Hareket yönü (1: İleri, -1: Geri)
        this.draw();
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.beginPath();
        const x = this.centerX + Math.cos(this.angle) * this.radius;
        const y = this.centerY + Math.sin(this.angle) * this.radius;
        this.context.moveTo(this.centerX, this.centerY);
        this.context.lineTo(x, y);
        this.context.stroke();
        
        this.angle += this.speed * this.direction;
        //console.log(this.angle);
        // SAĞ TARAF OYUNCU İÇİN
        if (this.angle < 9.25 || this.angle > 10.5) {
            this.direction *= -1; // Yönü tersine çevir
        }
        //SOL TARAF
        // if (this.angle >6.25 || this.angle < 5) {
        //     this.direction *= -1; // Yönü tersine çevir
        // }

        requestAnimationFrame(this.draw.bind(this));
    }
}

//DIŞARIDAN ALICAK FRİCTİON VALUE
class MovingBall {
    constructor(canvasId,GucValue,EgimValue) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        this.x = 200; // Topun başlangıç X koordinatı
        this.y = 550; // Topun başlangıç Y koordinatı
        this.initialVelocityX = GucValue; // İlk hız (X ekseninde)
        this.initialVelocityY = EgimValue; // İlk hız (Y ekseninde)
        this.gravity = 0.1; // Yerçekimi kuvveti
        this.friction = 0.99; // Sürtünme katsayısı

        this.lastTimestamp = 0;
        this.velocity = 0;
        

        this.updateBallPosition();
    }
    checkCollision() {
      const dx = this.x - enemypos[0];
      const dy = this.y - enemypos[1];
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      return distance < 50; // 18 (top yarıçapı) + 10 (CopAdam başı yarıçapı)
  }
  checkCollisionDuvar() {
    const duvarX = this.canvas.width / 2; // Dikey çizginin X koordinatı
    const duvarY1 = this.canvas.height/2+100; // Dikey çizginin başlangıç Y koordinatı (canvas üst kenarı)
    const duvarY2 = this.canvas.height; // Dikey çizginin bitiş Y koordinatı (canvas alt kenarı)

    // Topun X koordinatı dikey çizginin X koordinatına çok yakınsa ve Y koordinatı dikey çizginin aralığında ise çarpışma var.
    if (this.x > duvarX - 9 && this.x < duvarX + 9 && this.y > duvarY1 && this.y < duvarY2) {
      return true; // Çarpışma varsa true döndür
    } else {
      return false; // Çarpışma yoksa false döndür
    }
  
  
}

    drawBall() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, 18, 0, Math.PI * 2);
        this.ctx.fillStyle = '#0095DD';
        this.ctx.fill();
        this.ctx.closePath();
    }

    updateBallPosition() {
        // Topun konumunu güncelle
        
        this.x += this.initialVelocityX;
        this.y += this.initialVelocityY;

        // Yerçekimini uygula
        this.initialVelocityY += this.gravity;
      //  console.log("x= ",this.x,"y= ", this.y);
        // Sürtünmeyi uygula
        this.initialVelocityX *= this.friction;
        this.initialVelocityY *= this.friction;
        // Topun sınırları dışına çıkmasını engelle      
        // Canvas'i temizle ve topu çiz
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBall();
        if (this.y > this.canvas.height + 75 || this.x > this.canvas.width + 75 ) {
          // this.initialVelocityX = 0;
          // this.initialVelocityY = 0;
          
          console.log(this.y , this.x);
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); 
        
        
          clearInterval(counterint)
          document.getElementById("turnText").innerHTML = "Opponent Turn...";        
          socket.emit("changeTurn",username);
      }
      else if(this.checkCollision())
      {
       
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);  
       
        clearInterval(counterint);
        document.getElementById("turnText").innerHTML = "Opponent Turn..."; 
        socket.emit("hit",username);        
        socket.emit("changeTurn",username);
      }
      else if(this.checkCollisionDuvar())
      {
        console.log("duvara çarptı");
          this.initialVelocityX = 0;
          this.initialVelocityY = 0;
          socket.emit("changeTurn",username);
      }
      else
      {
        requestAnimationFrame(this.updateBallPosition.bind(this));

      }
        
    }}
    socket.on("damageBar",(user)=>{
      if(user.kullanici != username)
      {                                                
        
        document.getElementById("bar2").style.width = user.hp+"%";
      }
      else if( user.kullanici == username)
      {
        
        document.getElementById("bar").style.width = user.hp+"%";

      }

    })

    socket.on("endgame",(winner)=>{ 
      document.getElementById("endgame-div").style.display = "flex";
      document.getElementById("endgame-player").innerHTML = "👑 "+ winner + " 👑";     
      if(winner==username)
      {
        document.getElementById("restartbutton").style.display = "  block";
      }


    })

    socket.on("resetValues",(username)=>{
      document.getElementById("endgame-div").style.display = "none";
    
      document.getElementById("bar").style.width = "100%";
      document.getElementById("bar2").style.width = "100%";
    })

    function restartGame()
    {
    
      socket.emit("restartGame",username);
     


      socket.emit("changeTurn",username);
    }
  

 
class MovingBallEnemy {
    constructor(canvasId,GucValue,EgimValue) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        this.x = 1000; // Topun başlangıç X koordinatı
        this.y = 550; // Topun başlangıç Y koordinatı
        this.initialVelocityX = GucValue; // İlk hız (X ekseninde) - Negatif
        this.initialVelocityY = EgimValue; // İlk hız (Y ekseninde)
        this.gravity = 0.1; // Yerçekimi kuvveti
        this.friction = 0.99; // Sürtünme katsayısı (1'den küçük ve pozitif)

        this.lastTimestamp = 0;
        this.velocity = 0;

        this.updateBallPosition();
    }

    drawBall() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, 18, 0, Math.PI * 2);
        this.ctx.fillStyle = '#FF3FA4';
        this.ctx.fill();
        this.ctx.closePath();
    }

    updateBallPosition() {
        // Topun konumunu güncelle
        this.x -= this.initialVelocityX;
        this.y += this.initialVelocityY;

        // Yerçekimini uygula
        this.initialVelocityY += this.gravity;
      //  console.log("x= ",this.x,"y= ", this.y);

        // Sürtünmeyi uygula
        this.initialVelocityX *= this.friction;
        this.initialVelocityY *= this.friction;

        // Topun sınırları dışına çıkmasını engelle
        if (this.y > this.canvas.height + 75 || this.x < -75) { // -75 ile sınırları kontrol et
            this.initialVelocityX = 0;
            this.initialVelocityY = 0;
          
        }

        // Canvas'i temizle ve topu çiz
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBall();

        requestAnimationFrame(this.updateBallPosition.bind(this));
    }
}

function getEgimValue()
{

   document.getElementById("GameBtns").innerHTML = `
   <button id="button" class="btn-Stop_red stopBtnMe" onclick="getPowerValue()">Power</button>

   `;
   
   dikdortgenAnimasyon = new DikdortgenAnimasyon('canvas4');
   document.getElementById("canvas4").style.display = "block";

}
function vurdu()
{
  console.log("VURDUU");
}

function getPowerValue()
{
  
    dikdortgenAnimasyon.speed = 0 ;
    document.getElementById("GameBtns").innerHTML = "";
  
    console.log(username);
    socket.emit("shoot",{username:username, powervalueS:powervalue,anglevalueS:anglevalue});
 
}
class DikdortgenAnimasyon {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.x = 10; // Dikdörtgenin başlangıç x pozisyonu
        this.y = this.height - 40; // Dikdörtgenin y pozisyonu
        this.widthRect = 100; // Dikdörtgenin genişliği
        this.heightRect = 20; // Dikdörtgenin yüksekliği
        this.fillColor = 'blue'; // Dikdörtgenin dolgu rengi
        this.speed = 2; // Animasyon hızı
        this.isExpanding = true; // İçi dolan ve boşalan durumu
        this.animate();
    }

    animate() {
        this.context.clearRect(0, 0, this.width, this.height);

        // Dikdörtgeni çiz
        this.context.fillStyle = this.fillColor;
        this.context.fillRect(this.x, this.y, this.widthRect, this.heightRect);

        // İçi dolan ve boşalan mantığı
        if (this.isExpanding) {
            this.widthRect += this.speed;
            if (this.widthRect >= 200) {
                this.isExpanding = false;
            }
        } else {

            this.widthRect -= this.speed;
            if (this.widthRect <= 5) {
                this.isExpanding = true;
            }
        }        
        powervalue = (this.widthRect/15);
        requestAnimationFrame(this.animate.bind(this));
    }
}

class DikeyCizgi {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');
    this.ortaX = this.canvas.width / 2;
  }

  ciz() {
    this.context.beginPath();
    this.context.moveTo(this.ortaX, this.canvas.height/2+100); // Başlangıç noktası (ortaX, 0)
    this.context.lineTo(this.ortaX, this.canvas.height); // Bitiş noktası (ortaX, canvas yüksekliği)
    this.context.strokeStyle = 'red'; // Çizgi rengi
    this.context.lineWidth = 15; // Çizgi kalınlığı
    this.context.stroke(); // Çizgiyi çiz
  }
}

// DikeyCizgi sınıfını kullanarak çizgiyi çiz
const dikeyCizgi = new DikeyCizgi('canvas6');
dikeyCizgi.ciz();
//canvasid,guc,egim(eksili value)

//const movingBallEnemy = new MovingBallEnemy('canvas3');
//  const SaatYonuTersHareketliCizginew = new SaatYonuTersHareketliCizgi('canvas3',975,450);

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const canvas2 = document.getElementById('canvas');
const context2 = canvas2.getContext('2d');

// İki çöp adamı oluştur ve canvas üzerine çiz
const copAdam1 = new CopAdam(context, 200, 600);  
const copAdam2 = new CopAdam(context, canvas.width -200, 600);
enemypos[0] = copAdam2.x
enemypos[1] = copAdam2.y

console.log("cop adam1 konumu =" , copAdam2.x," y= ", copAdam2.y)

copAdam1.draw();
copAdam2.draw();


