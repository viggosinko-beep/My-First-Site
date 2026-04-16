const canvas=document.getElementById("MyCanvas");

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

const totalWidth=canvas.width;
const totalHeight=canvas.height;

const ctx=canvas.getContext("2d");

const pSpeed=5;
const keyboard={};

ctx.imageSmoothingEnabled=false;

function rect(x,y,sx,sy,c){
    ctx.fillStyle=c;
    ctx.fillRect(x,y,sx,sy);
}

function text(text,x,y,size=16,color="black",font="Arial"){
    ctx.fillStyle = color;
    ctx.font = size+"px "+font;
    ctx.fillText(text, x, y);
}

function clearScreen(){
    ctx.clearRect(0,0,totalWidth,totalHeight);
}

function loadImage(location,callback=null){
    const img=new Image();
    if(callback){
        img.onload=()=>callback(img);
    }
    img.src=location;
    return img;
}

function drawImage(img,x,y,sx,sy){
    ctx.drawImage(img,x,y,sx,sy);
}

let vy=5;

class Bird{
    constructor(sx,sy,g,jf,img){
        this.x=0;
        this.y=totalHeight/2-sx/2;
        this.vy= -10;
        this.sx=sx;
        this.sy=sy;
        this.g=g;
        this.jf=jf;
        this.img=img;
    }
    phys(){
        this.x+=Math.floor(vy*10)/50;
        this.y+=this.vy;
        this.vy+=this.g;
        if(this.y>totalHeight-this.sy) return true;
        if(this.y<0){
            this.y=0;
            this.vy=0;
        }
        return false;
    }
    draw(){
        drawImage(this.img,100,this.y,this.sx,this.sy);
    }
    jump(){
        this.vy= -this.g*this.jf;
    }
    reset(){
        this.x=0;
        this.y=totalHeight/2-this.sy/2;
        this.vy=0;
    }
}

class Pipes{
    constructor(x,y,oh,sx,sy,top_img,bot_img){
        this.x=x;
        this.y=y;
        this.openingHeight=oh;
        this.sx=sx;
        this.sy=sy;
        this.top_img=top_img;
        this.bot_img=bot_img;
    }
    phys(bird){
        if(this.x>= -this.sx) this.x-=vy;
        if(this.x<=100+bird.sx && this.x+this.sx>=100 && (this.y>bird.y || this.y+this.openingHeight<bird.y+bird.sy)){
            return true;
        }
        return false;
    }
    reset(y,oh){
        this.x=totalWidth;
        this.y=y;
        this.openingHeight=oh;
    }
    draw(){
        drawImage(this.top_img,this.x,this.y-this.sy,this.sx,this.sy);
        drawImage(this.bot_img,this.x,this.y+this.openingHeight,this.sx,this.sy);
    }
}

const bird=new Bird(65,25,1,8,loadImage("flappy_bird.png"));

const pipes=[];

pipes.push(new Pipes(totalWidth+totalWidth/2,100,150,50,700,loadImage("pipe_down.png"),loadImage("pipe_up.png")));
pipes.push(new Pipes(totalWidth,100,150,50,700,loadImage("pipe_down.png"),loadImage("pipe_up.png")));

let flip=false;
let inter=false;
const heart=loadImage("heart.png");
let lives=3;

function gameLoop(){
    clearScreen();
    bird.phys();
    bird.draw();
    let collided=false;
    if(vy<=4.97) vy+=0.03;
    for(const a of pipes){
        if(a.phys(bird) || bird.y>=totalHeight-bird.sy){
            if(bird.y>=totalHeight-bird.sy){
                bird.y=totalHeight-bird.sy;
                if(bird.vy>0) bird.vy=0;
                if(vy>=0.05) vy-=0.05;
            }
            if(!inter){
                inter=true;
                lives-=1;
            }
            collided=true;
        }
        if(a.x< -a.sx+2) a.reset(Math.random()*(totalHeight-300)+150,Math.random()*200/(bird.x/100)+100);
        a.draw();
    }
    if(vy<0) vy=0;
    if(vy>5) vy=5;
    if(collided==false) inter=false;
    for(let i=0; i<lives; i++){
        drawImage(heart,20+i*75,20,75,75);
    }
    text(Math.round(bird.x),250,75,30,"black")
    if(lives> -1) requestAnimationFrame(gameLoop);
    else{
        text("You died",300,totalHeight/2,100,"red");
    }
}

document.addEventListener("keydown",(event)=>{
    keyboard[event.key.toLowerCase()]=true;
    if(!flip){
        bird.jump();
        flip=true;
    }
});

document.addEventListener("keyup",(event)=>{
    keyboard[event.key.toLowerCase()]=false;
    if(flip){
        flip=false;
    }
});

document.addEventListener("mousedown",(event)=>{
    //if(!flip){
        bird.jump();
        //flip=true;
    //}
});

/*document.addEventListener("mouseup",(event)=>{
    if(flip){
        flip=false;
    }
});*/

requestAnimationFrame(gameLoop);
