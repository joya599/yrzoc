/*
 * hexo theme meow
 * utils scripts
 */

window.meow = window.meow || {

  debounce:function(func,delay){

    let timer;

    return function(){

      clearTimeout(timer);

      timer=setTimeout(
        ()=>{
          func.apply(this,arguments)
        },
        delay
      );

    };

  },


  scrollFn:function(position){

    window.scrollTo(
      0,
      position
    );

  },


  getActualTop:function(element){

    let actualTop=element.offsetTop;

    let current=element.offsetParent;


    while(current!==null){

      actualTop+=current.offsetTop;

      current=current.offsetParent;

    }


    return actualTop;

  },


  shuffleArray:function(array){

    for(
      let i=array.length-1;
      i>0;
      i--
    ){

      const j=Math.floor(
        Math.random()*(i+1)
      );


      [
        array[i],
        array[j]
      ]=[
        array[j],
        array[i]
      ];

    }


    return array;

  },


  snackbarFn:function(text){

    if(
      GLOBALCONFIG.notify.enable
    ){

      Snackbar.show({

        text:text,

        pos:'bottom-left',

        duration:3000

      });

    }

  },


  getPageTitle:function(){

    let page_title=document.title;

    let meta=document.querySelector(
      'meta[property="og:site_name"]'
    );


    if(!meta)
      return page_title;


    let sitename=
      meta.getAttribute('content');


    let site_fragment=
      ' | '+sitename;


    return page_title.endsWith(site_fragment)
      ?
      page_title.replace(site_fragment,"")
      :
      page_title;

  },


  lazyloadFn:function(dom,callback){

    if(
      "IntersectionObserver" in window
    ){

      const observer=
      new IntersectionObserver(

        entries=>{

          if(entries[0].isIntersecting){

            callback();

            observer.disconnect();

          }

        },

        {
          threshold:[0]
        }

      );


      observer.observe(dom);


    }else{

      callback();

    }

  }

};