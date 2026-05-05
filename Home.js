document.body.style=`background: linear-gradient(red, blue);height: ${window.innerHeight}px;overflow:hidden;`;

function CAAE(tag, parent,...args){
    const a=document.createElement(tag);
    for(let i=0; i<args.length; i++){
        let path=args[i];
        let item=a;

        for(let ii=0; ii<path.length-2; ii++){
            item=item[path[ii]];
        }

        item[path[path.length-2]]=path[path.length-1];
    }
    const parentEL=(typeof parent==='string')? document.getElementById(parent):parent;
    (parentEL || document.body).appendChild(a);
    return a;
}

CAAE('div',null,['id','hello'],['style','position','relative']);
let iframe=CAAE('iframe','hello',['style','border','5px solid black'],['width','500px'],['height','500px'],['style','background','white']);

let text=CAAE('textarea','hello',['rows','40'],['cols','75'],['placeholder','Type here...'],['style','background','white'],['style','resize','none'],['style','float','right'],['value',`CAAE('p',null,['innerHTML',"Hello World!"],['style','background','linear-gradient(0.25turn,red,green)']);`]);

let caae="function CAAE(tag, parent,...args){const a=document.createElement(tag);for(let i=0; i<args.length; i++){let path=args[i];let item=a;for(let ii=0; ii<path.length-2; ii++){item=item[path[ii]];}item[path[path.length-2]]=path[path.length-1];}const parentEL=(typeof parent==='string')? document.getElementById(parent):parent;(parentEL || document.body).appendChild(a);return a;}"

let drawrect="function drawRect(canvas,x,y,sx,sy,color){let ctx=canvas.getContext('2d');ctx.fillStyle=color;ctx.fillRect(x,y,sx,sy);}";

CAAE('button','hello',['onclick',()=>{
    iframe.srcdoc=`<body><script>${caae}${drawrect}${text.value}</script></body>`;
}],['innerHTML','TEST!'],['style','float','right']);

let last=window.innerHeight;