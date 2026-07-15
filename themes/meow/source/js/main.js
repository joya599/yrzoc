/*
 * hexo theme meow
 * main scripts
 * Turbo compatible version
 */


import initMenu from "./theme/menu.js";
import initToolbar from "./theme/toolbar.js";
import { initScroll, initTOCHighlight } from "./theme/tools/scroll.js";
import initDatetime from "./theme/tools/datetime.js";
import initCategoryPage from "./theme/category.js";
import initLazyLoad from "./theme/tools/lazyload.js";
import initImageView from "./theme/tools/imageview.js";
import initFriendLink from "./theme/friendLink.js";
import { initAlbum, initLinkAlbum } from "./theme/albums.js";
import initCopy from "./theme/tools/copy.js";
import initCodeBlock from "./theme/code.js";
import {
  initTags,
  initMusicPlayer
} from "./theme/tags.js";
import initKeyboard from "./theme/tools/keyboard.js";
import initPageFocus from "./theme/focus.js";
import initMouse from "./theme/tools/mouse.js";
import initSearch from "./theme/search.js";


// Turbo
import "https://cdn.jsdelivr.net/npm/@hotwired/turbo@8.0.6/dist/turbo.es2017-esm.min.js";



let hasInitialized=false;

let isTransition=false;



// =================================
// 初始化
// =================================

const initMain=()=>{


  initMenu();


  if(GLOBALCONFIG.toolbar)
    initToolbar();



  initScroll();


  initDatetime();



  if(GLOBALCONFIG.category)
    initCategoryPage();



  initLazyLoad();


  initImageView();



  if(GLOBALCONFIG.friends)
    initFriendLink();



  if(GLOBALCONFIG.album){


    if(GLOBALCONFIG.album!=="external"){


      GLOBALCONFIG.encrypt
      ?
      initAlbum(2)
      :
      initAlbum(0);



    }else{


      if(GLOBALCONFIG.encrypt)
        initLinkAlbum(2);


    }


  }




  initCopy();



  if(GLOBALCONFIG.codeblock)
    initCodeBlock();



  initTags();



  initKeyboard();



  if(
    GLOBALCONFIG.onblur_title &&
    GLOBALCONFIG.onblur_title!=="false"
  ){

    initPageFocus();

  }



  if(GLOBALCONFIG.mouse_click)
    initMouse();



};





// =================================
// Turbo刷新
// =================================

const refreshFn=()=>{


  initLazyLoad();



  if(GLOBALCONFIG.codeblock)
    initCodeBlock();



  initTags();



  // 重新启动文章播放器

  initMusicPlayer();




  if(GLOBALCONFIG.search.enable){

    initSearch();

  }




  if(GLOBALCONFIG.album){


    GLOBALCONFIG.album!=="external"
    ?
    initAlbum(1)
    :
    initLinkAlbum(1);


  }



  initTOCHighlight();



};






// =================================
// bootstrap
// =================================


const bootstrap=()=>{


  if(hasInitialized)
    return;



  hasInitialized=true;


  initMain();


};






// =================================
// 音频互斥系统
// =================================


document.addEventListener(
"play",
(event)=>{


  const audio=event.target;



  if(
    !audio ||
    audio.tagName!=="AUDIO"
  )
    return;



  document
  .querySelectorAll("audio")
  .forEach(item=>{


    if(item!==audio){

      item.pause();

    }


  });


},
true
);






// =================================
// 销毁文章播放器
// =================================


const destroyArticlePlayers=()=>{


  window.articleAPlayers =
  window.articleAPlayers || [];



  window.articleAPlayers.forEach(
    player=>{


      try{


        player.pause();


        player.destroy();



      }catch(e){



      }


    }
  );



  window.articleAPlayers=[];



  document
  .querySelectorAll(
    ".music-tag div[id^='music-player-']"
  )
  .forEach(container=>{


    container._aplayer=null;


  });



};








// =================================
// Turbo cache
// =================================


document.addEventListener(
"turbo:before-cache",
()=>{


  destroyArticlePlayers();


});







// =================================
// 首次加载
// =================================


if(
document.readyState==="complete" ||
document.readyState==="interactive"
){

  bootstrap();


}else{


  document.addEventListener(
    "DOMContentLoaded",
    bootstrap
  );


}









// =================================
// Turbo visit
// =================================


document.addEventListener(
"turbo:before-visit",
()=>{


 destroyArticlePlayers();


});








// =================================
// Turbo render
// =================================


document.addEventListener(
"turbo:before-render",
(event)=>{


  isTransition=true;



  destroyArticlePlayers();




  const newBody=
  event.detail.newBody;



  if(newBody){



    newBody.className=
    document.body.className;



    const mode=
    document.body.getAttribute(
      "data-mode"
    );


    if(mode){

      newBody.setAttribute(
        "data-mode",
        mode
      );

    }




    const bg=
    document.body.getAttribute(
      "bg-style"
    );


    if(bg){

      newBody.setAttribute(
        "bg-style",
        bg
      );

    }




    // 防止重复执行普通script

    newBody
    .querySelectorAll("script")
    .forEach(script=>{


      if(script.src){


        const old=
        document.querySelector(
          `script[src="${script.src}"]`
        );


        if(old){

          script.dataset.turboEval="false";

        }


      }


    });



  }



  if(window.destroyMouse){

    window.destroyMouse();

  }



});








// =================================
// Turbo完成
// =================================


document.addEventListener(
"turbo:load",
()=>{


  if(isTransition){


    refreshFn();



    if(GLOBALCONFIG.mouse_click){

      initMouse();

    }



    isTransition=false;


  }


});









// =================================
// 解密
// =================================


if(GLOBALCONFIG.encrypt){


window.addEventListener(
"hexo-blog-decrypt",
()=>{


refreshFn();



const toc=
document.getElementById(
"toc-div"
);



if(toc){

toc.style.display="block";

}


});


}









// =================================
// 相册
// =================================


if(
GLOBALCONFIG.album &&
GLOBALCONFIG.album!=="external"
){


window.addEventListener(
"album-load-new-image",
initLazyLoad
);


}






export default initMain;