#!/usr/bin/env node
require('shelljs/global');

var commitMsg = process.argv[2] || '自动提交更新';
exec('git pull');

console.log(commitMsg)

exec('git status');

exec('git add .');

exec('git commit -m' + commitMsg);

exec('git push');