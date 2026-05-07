document.body.style=`background: linear-gradient(red, blue);`;

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
CAAE('div',null,['id','maod']);

let table=CAAE('table','maod');

CAAE('tr',table,['id','itr']);

CAAE('td','itr',['id','iti'],['colSpan',2],['style','text-align:center;']);

CAAE('div','iti',['id','buttons']);


let button=CAAE('button','buttons',['innerHTML','TEST!']);
let del=CAAE('button','buttons',['innerHTML','DEL']);
let load=CAAE('button','buttons',['innerHTML','LOAD']);
let save=CAAE('button','buttons',['innerHTML','SAVE']);
let nameField=CAAE('input','buttons',['type','text'],['placeholder','Save Name']);
let down=CAAE('button','buttons',['innerHTML','Download']);
let iframe=CAAE('iframe','iti',['width','1000px'],['height','562px'],['style','background:white;border:5px solid black;']);

CAAE('td',CAAE('tr',table,['id','ttr']),['id','jti']);
CAAE('td','ttr',['id','hti']);

let cHTML=CAAE('button','hti',['innerHTML','Add new HTML window'],['style','float:right;visibility:hidden;']);
let html=CAAE('textarea','hti',['rows','20'],['cols','75'],['placeholder','Type HTML here...'],['style','background','white'],['style','resize','none'],['style','float','right'],['value',`<!DOCTYPE html>
<html>
    <head>
        <title>Put the page's title here</title>
        <meta charset='UTF-8'>
        <meta name='Author' content='Put your name here'>
    </head>
    <body>
        <p>This is a paragraph!</p>
        <input type='text' placeholder='Enter' id='mjo'></input>
        <button id='butt'>Enter</button>
        <script><identifier></script>
    </body>
</html>`]);

let cJS=CAAE('button','jti',['innerHTML','Add new Extern window'],['style','float','right']);
const jss=[];
jss.push(CAAE('textarea','jti',['rows','20'],['cols','75'],['placeholder','Type Extern Here...'],['style','background','white'],['style','resize','none'],['style','float','right'],['value',`<identifier>

let inputField=document.getElementById('mjo');
let button=document.getElementById('butt');
button.onclick=()=>{
    let p=document.createElement('p');
    p.innerHTML=inputField.value;
    document.body.appendChild(p);
};`]));
cJS.onclick=()=>{
    jss.push(CAAE('textarea',CAAE('td',CAAE('tr',table)),['rows','20'],['cols','75'],['placeholder','Type Extern Here...'],['style','background','white'],['style','resize','none'],['style','float','right'],['value',``]));
};

function findId(string){
    let id="";
    if(string[0]!='<') return;
    for(let i=1;i<string.length;i++){
        if(string[i]=='>') return id;
        id+=string[i];
    }
    return;
}

function replace(string1, identifier, string2){
    return string1.split('<'+identifier+'>').join(string2);
}

button.onclick=()=>{
    let string=html.value;
    for(const a of jss){
        let id=findId(a.value)
        if(id){
            let content=a.value.slice(id.length+2);
            string=replace(string,id,content);
        }
    }
    iframe.srcdoc=string;
};

down.onclick=()=>{
    let content=html.value;
    for(const a of jss){
        let id=findId(a.value)
        if(id){
            let contentt=a.value.slice(id.length+2);
            content=replace(content,id,contentt);
        }
    }
    const blob=new Blob([content],{type:'text/plain'});
    const url=window.URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.style.display='none';
    a.href=url;
    a.download=nameField.value+'.html';

    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
};

save.onclick=()=>{
    localStorage.setItem(nameField.value+'/html',html.value);
    localStorage.setItem(nameField.value+'/jss.length',jss.length);
    for(let i=0;i<jss.length;i++){
        localStorage.setItem(nameField.value+`/jss[${i}]`,jss[i].value);
    }
};

load.onclick=()=>{
    html.value=localStorage.getItem(nameField.value+'/html');
    let length=localStorage.getItem(nameField.value+'/jss.length');
    if(length<1) jss[0].value='';
    let i=0;
    for(;i<length;i++){
        if(i<jss.length) jss[i].value=localStorage.getItem(nameField.value+`/jss[${i}]`);
        else jss.push(CAAE('textarea',CAAE('td',CAAE('tr',table)),['rows','20'],['cols','75'],['placeholder','Type Extern Here...'],['style','background','white'],['style','resize','none'],['style','float','right'],['value',localStorage.getItem(nameField.value+`/jss[${i}]`)]));
    }
    if(jss.length>length){
        const toremove=jss.splice(length>1?length:1);
        toremove.forEach(el=>{
            const row=el.closest('tr');
            if(row) row.remove();
        })
    }
};

del.onclick=()=>{
    let length=localStorage.getItem(nameField.value+'/jss.length');
    localStorage.removeItem(nameField.value+'/jss.length');
    localStorage.removeItem(nameField.value+'/html');
    for(let i=0;i<length;i++){
        localStorage.removeItem(nameField.value+`/jss[${i}]`);
    }
}