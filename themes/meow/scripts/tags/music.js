/*
 * hexo theme meow
 * tag plugins: music player
 * Turbo compatible version
 */


'use strict';



const music = (args, content)=>{


  const id =
    args.length > 0
    ?
    args[0].toString()
    :
    "0";



  const playerId =
    "music-player-" + id;



  const type =
    args.length > 1
    ?
    args[1]
    :
    "";



  const {
    config:themeCfg
  } = hexo.theme;





  const commonConfig = `

    autoplay:${themeCfg.music.autoplay},

    theme:'${themeCfg.color.light.theme_color || themeCfg.color.dark.theme_color || "#FFB347"}',

    loop:'${themeCfg.music.loop}',

    order:'${themeCfg.music.order}',

    volume:${themeCfg.music.volume},

    lrcType:${themeCfg.music.lyric ? 3 : 0}

  `;





  let scriptContent="";






  const createPlayerScript=(audio)=>{


return `



window.articlePlayers =
window.articlePlayers || {};



window.articleAPlayers =
window.articleAPlayers || [];





window.articlePlayers["${id}"] =
function(){



const container =
document.getElementById(
"${playerId}"
);



if(!container)
return;




if(container._aplayer)
return;






const ap =
new APlayer({

container:container,


${commonConfig},


audio:${JSON.stringify(audio)}


});







container._aplayer=ap;



window.articleAPlayers.push(ap);








ap.on(
"play",
()=>{



// 停止全局播放器

if(
window.globalAPlayer &&
window.globalAPlayer!==ap
){

window.globalAPlayer.pause();

}





// 停止其它文章播放器

window.articleAPlayers
.forEach(player=>{


if(
player!==ap
){

player.pause();


}


});



}

);




};






// Turbo加载

document.addEventListener(
"turbo:load",
()=>{


if(
window.articlePlayers["${id}"]
){


window.articlePlayers["${id}"]();


}



});




`;



};









// ============================
// 本地音乐
// ============================


if(
type==="local"
||
(!type && !themeCfg.music.meting.api)
){



const musicList =
hexo.render.renderSync({

text:content,

engine:"yaml"

});




scriptContent =
createPlayerScript(
musicList
);



}







// ============================
// Meting API
// ============================


else{



const params =
hexo.render.renderSync({

text:content,

engine:"yaml"

});





const api =

`${themeCfg.music.meting.api}?server=${params.server}&type=${params.type}&id=${params.id}&r=${Date.now()}`;







scriptContent = `



window.articlePlayers =
window.articlePlayers || {};



window.articleAPlayers =
window.articleAPlayers || [];






window.articlePlayers["${id}"] =
function(){



const container =
document.getElementById(
"${playerId}"
);





if(
!container ||
container._aplayer
)

return;






fetch("${api}")

.then(response=>{


if(
!response.ok
){

throw new Error(
"Music API request failed"
);

}



return response.text();



})


.then(text=>{



let data;



try{


data =
JSON.parse(text);



}catch(e){



console.error(
"Music API did not return JSON:",
text
);


return;


}





if(
!data ||
!data.length
)

return;






const ap =
new APlayer({

container,


${commonConfig},


audio:data


});







container._aplayer=ap;



window.articleAPlayers.push(ap);








ap.on(
"play",
()=>{



if(
window.globalAPlayer &&
window.globalAPlayer!==ap
){

window.globalAPlayer.pause();

}





window.articleAPlayers
.forEach(player=>{


if(player!==ap){

player.pause();


}


});



}

);




});



};






document.addEventListener(
"turbo:load",
()=>{


if(
window.articlePlayers["${id}"]
){


window.articlePlayers["${id}"]();


}



});




`;



}







return `



<div class="music-tag">


<div id="${playerId}"></div>



<script>

${scriptContent}


</script>


</div>



`;

};






hexo.extend.tag.register(
"music",
music,
{

ends:true

}

);