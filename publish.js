require('shelljs/global');

var from = `${pwd().stdout}/dist/static`;

exec('npm run build');

cd('/Users/godaangel/Documents/myAllProgrameCode/2017pro/wii2-wau');

exec('git pull');

var to = `${pwd().stdout}/vendor/assets/wii2-wau/dist/qmodel_2.0.2`;

cp('-R',`${from}/css/*`,`${to}/css`);
cp('-R',`${from}/js/*`,`${to}/js`);

exec('git status');