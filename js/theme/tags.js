/*
 * hexo theme meow
 * tag plugins scripts
 * Turbo compatible version
 */



const initTags = () => {


  const tabsFn = () => {


    const navTabsElement =
    document.querySelectorAll(
      ".tabs"
    );



    if(
      !navTabsElement.length
    )
      return;




    const removeAndAddActiveClass =
    (
      elements,
      detect
    )=>{


      Array.from(elements)
      .forEach(element=>{


        element.classList.remove(
          "active"
        );



        if(
          element===detect ||
          element.id===detect
        ){

          element.classList.add(
            "active"
          );

        }



      });


    };





    const addTabNavEventListener =
    (item)=>{


      const nav =
      item.firstElementChild;



      if(!nav)
        return;




      nav.addEventListener(
      "click",
      e=>{


        const target =
        e.target.closest(
          "button"
        );



        if(!target)
          return;



        if(
          target.classList.contains(
            "active"
          )
        )
          return;





        removeAndAddActiveClass(
          nav.children,
          target
        );



        item.classList.remove(
          "no-default"
        );




        const tabId =
        target.getAttribute(
          "data-href"
        );



        const content =
        item.querySelector(
          ".tabs-content"
        );



        if(content){

          removeAndAddActiveClass(
            content.children,
            tabId
          );

        }



      });



    };







    const addTabToTopEventListener =
    item=>{


      const btn =
      item.querySelector(
        ".tabs-to-top"
      );



      if(!btn)
        return;




      btn.addEventListener(
      "click",
      ()=>{


        meow.debounce(
          meow.scrollFn(
            meow.getActualTop(item)-80
          ),
          300
        );


      });



    };







    navTabsElement
    .forEach(item=>{


      addTabNavEventListener(item);


      addTabToTopEventListener(item);


    });



  };







  const maskFn=()=>{


    const maskTextElement =
    document.querySelector(
      "span.mask[type='1']"
    );



    if(!maskTextElement)
      return;





    const post =
    document.querySelector(
      ".post"
    );



    if(!post)
      return;





    post.addEventListener(
    "click",
    e=>{


      if(
        e.target.tagName!=="SPAN" ||
        !e.target.classList.contains(
          "mask"
        ) ||
        e.target.getAttribute(
          "type"
        )==="0"
      ){

        return;

      }




      e.target.classList.toggle(
        "visited"
      );



    });



  };






  tabsFn();


  maskFn();



};









// =====================================
// 文章播放器初始化
// =====================================


const initMusicPlayer = ()=>{



  const players =
  document.querySelectorAll(
    ".music-tag > div[id^='music-player-']"
  );



  if(
    !players.length
  )
    return;





  window.articleAPlayers =
  window.articleAPlayers || [];






  players.forEach(container=>{



    const id =
    container.id.replace(
      "music-player-",
      ""
    );





    if(
      container._aplayer
    ){

      return;

    }







    if(
      window.articlePlayers &&
      window.articlePlayers[id]
    ){



      window.articlePlayers[id]();



    }



  });



};







export {
  initTags,
  initMusicPlayer
};