'use strict';

hexo.extend.tag.register('profile', function(args) {
  const data = {};

  args.forEach(arg => {
    const index = arg.indexOf('=');
    if (index > -1) {
      const key = arg.slice(0, index);
      const value = arg.slice(index + 1).replace(/^"|"$/g, '');
      data[key] = value;
    }
  });

  return `
<div class="profile-card">
    <img class="profile-avatar" src="${data.avatar || ''}">
    <div class="profile-title">${data.name || ''}</div>
    <div class="profile-description">${data.desc || ''}</div>
    ${data.desc2 ? `<div class="profile-description">${data.desc2}</div>` : ''}
</div>
`;
});