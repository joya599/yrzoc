'use strict';

const fs = require('fs');
const path = require('path');
const moment = require('moment');

hexo.extend.console.register(
  'newpost',
  'Create a post folder',
  function(args) {

    const title = args._.join(' ').trim();

    if (!title) {
      console.log('Usage: hexo newpost "文章标题"');
      return;
    }

    const postDir = path.join(hexo.source_dir, '_posts', title);

    if (fs.existsSync(postDir)) {
      console.log('文章已存在');
      return;
    }

    fs.mkdirSync(postDir, { recursive: true });
    fs.mkdirSync(path.join(postDir, 'images'));

    const md = path.join(postDir, `${title}.md`);

    const now = moment().format('YYYY-MM-DD HH:mm:ss');

    const text = `---
title: "${title}"
date: ${now}
updated: ${now}
categories: 
tags: 
cover: ""
banner: ""
excerpt: ""
---

`;

    fs.writeFileSync(md, text, 'utf8');

    console.log(`✔ Created ${md}`);
  }
);