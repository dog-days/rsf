const fs = require('fs');
const path = require('path');
const spawn = require('cross-spawn');

//根据是否存在.gitignore判断是否postinstall，发布后.gitignore不会一起发布
if (fs.existsSync(path.resolve(process.cwd(), '.gitignore'))) {
  spawn.sync('npm', ['run', 'bootstrap'], {
    stdio: 'inherit',
  });
  // test 必须在 build  之后 执行
  spawn.sync('npm', ['run', 'build'], {
    stdio: 'inherit',
  });
  spawn.sync('npm', ['run', 'test'], {
    stdio: 'inherit',
  });
}
