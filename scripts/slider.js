/**
 * Hexo 动态数量轮播图插件（卡片物理变形版）
 */
hexo.extend.tag.register('slider', function(args) {
  if (!args || args.length === 0) return '';
  
  const rawText = args.join(' ');
  const groups = rawText.split(';').map(item => item.trim()).filter(item => item.length > 0);
  
  if (groups.length === 0) return '';

  const items = [];

  groups.forEach((group) => {
    const urlMatches = group.match(/(https?:\/\/[^\s]+)/g);
    if (!urlMatches || urlMatches.length === 0) return;

    const url = urlMatches[urlMatches.length - 1];
    let caption = group.replace(url, '').replace(/['"]+/g, '').trim();

    items.push({
      caption: caption || '',
      url: url.trim()
    });
  });

  const total = items.length;
  if (total === 0) return '';

  const sliderId = 'slider-' + Math.random().toString(36).substr(2, 9);

  let radios = '';
  let slides = '';
  let arrows = '';
  let captions = '';

  items.forEach((item, index) => {
    const slideNo = index + 1;
    const checked = index === 0 ? 'checked' : '';
    const prevNo = index === 0 ? total : index;
    const nextNo = index === total - 1 ? 1 : index + 2;

    radios += `<input type="radio" name="${sliderId}" id="${sliderId}-${slideNo}" ${checked} class="slider-radio" data-index="${index}">`;
    
    // 移除了不必要的 style 背景注入
    slides += `
<div class="slide-item loading-box" data-index="${index}">
  <img src="${item.url}" alt="${item.caption}">
</div>
`;
    
    arrows += `
<div class="arrows arrow-group-${slideNo}">
  <label for="${sliderId}-${prevNo}" class="prev">❮</label>
  <label for="${sliderId}-${nextNo}" class="next">❯</label>
</div>
    `;

    if (item.caption) {
      captions += `<div class="carousel-caption caption-${slideNo}">${item.caption}</div>`;
    }
  });

  let dynamicCss = '';
  items.forEach((_, i) => {
    const percent = (i * 100) / total;
    const slideNo = i + 1;
    dynamicCss += `#${sliderId} .slider-radio:nth-of-type(${slideNo}):checked ~ .carousel-slides { transform: translateX(-${percent}%); }\n`;
    dynamicCss += `#${sliderId} .slider-radio:nth-of-type(${slideNo}):checked ~ .arrow-group-${slideNo} { display: flex !important; }\n`;
    dynamicCss += `#${sliderId} .slider-radio:nth-of-type(${slideNo}):checked ~ .carousel-captions .caption-${slideNo} { display: inline-block !important; }\n`;
  });

  return `
<div class="arrow-carousel" id="${sliderId}">
  ${radios}

  <div class="carousel-slides" style="width: ${total * 100}%;">
    ${slides}
  </div>

  ${arrows}

  <div class="carousel-captions">
    ${captions}
  </div>

  <style>
    #${sliderId} .arrows { display: none; }
    #${sliderId} .carousel-captions .carousel-caption { display: none; }
    ${dynamicCss}
  </style>

  <script>
  (function(){
    const carousel = document.getElementById('${sliderId}');
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.slide-item');
    const radios = carousel.querySelectorAll('input.slider-radio');

    function updateCarouselShape() {
      const checkedRadio = carousel.querySelector('input.slider-radio:checked');
      if (!checkedRadio) return;
      
      const currentIndex = Array.from(radios).indexOf(checkedRadio);
      const currentSlide = slides[currentIndex];
      if (!currentSlide) return;

      carousel.classList.remove('portrait-carousel', 'landscape-carousel');

      // 仅操控外层容器的类名，让 CSS 去执行宽高形变
      if (currentSlide.dataset.type === 'portrait') {
        carousel.classList.add('portrait-carousel');
      } else if (currentSlide.dataset.type === 'landscape') {
        carousel.classList.add('landscape-carousel');
      }
    }

    slides.forEach((slide) => {
      const img = slide.querySelector('img');
      if (!img) return;

      // 🌟 核心修复：优先读取懒加载的真实属性 data-lazy-src 或 data-src
      const realSrc = img.getAttribute('data-lazy-src') || img.getAttribute('data-src') || img.src;

      const tmpImg = new Image();
      tmpImg.src = realSrc;

      const processDimensions = () => {
        // 增加容错：确保图片真实加载出了尺寸再判断
        if (tmpImg.naturalWidth && tmpImg.naturalHeight) {
          if (tmpImg.naturalHeight > tmpImg.naturalWidth) {
            slide.dataset.type = 'portrait';
          } else {
            slide.dataset.type = 'landscape';
          }
          slide.classList.remove('loading-box');
          updateCarouselShape();
        }
      };

      if (tmpImg.complete) {
        processDimensions();
      } else {
        tmpImg.onload = processDimensions;
      }
    });

    radios.forEach(radio => {
      radio.addEventListener('change', updateCarouselShape);
    });

    updateCarouselShape();
  })();
  </script>
</div>
  `;
});