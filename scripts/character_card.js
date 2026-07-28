/**
 * Hexo 角色卡片 Tag 插件 (全 Markdown 版 + 主题色)
 */
hexo.extend.tag.register('character', function(args, content) {
  const cleanArg = (str) => (str || '').trim().replace(/^['"]|['"]$/g, '');
  const avatar = cleanArg(args[0]);
  const name = cleanArg(args[1]);
  const quote = cleanArg(args[2]);
  const color = cleanArg(args[3]) || '#808080'; // 第4个参数：主题色，不填则用默认灰色

  let basicMd = '';
  let detailsMd = content;
  if (content.includes('<!-- details -->')) {
    const parts = content.split('<!-- details -->');
    basicMd = parts[0].trim();
    detailsMd = parts[1].trim();
  } else {
    detailsMd = content.trim();
  }

  const basicHtml = hexo.render.renderSync({ text: basicMd, engine: 'markdown' });
  const detailsHtml = hexo.render.renderSync({ text: detailsMd, engine: 'markdown' });

  const rawHtml = `
<div class="character-card" style="--theme-color: ${color};">
  <div class="character-header">
    <div class="character-avatar">
      <img src="${avatar}" alt="${name}">
    </div>
    <div class="character-basic">
      <h2 class="character-name">${name}</h2>
      ${quote ? `<p class="character-quote">${quote}</p>` : ''}
      ${basicHtml}
    </div>
  </div>
  <div class="character-details">
    ${detailsHtml}
  </div>
</div>`;
  return rawHtml.replace(/\n\s*\n/g, '\n');
}, { ends: true });