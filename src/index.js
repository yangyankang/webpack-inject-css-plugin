const path = require('path');
const fs = require('fs');
const CommonJsRequireDependency = require("webpack/lib/dependencies/CommonJsRequireDependency");

class InjectCssPlugin {
  /**
   * Creates an instance of InjectCssPlugin.
   * @param {*} options
   * @param {options} cssArr 存放css的数组，比如['a.css', 'b.css']或者 绝对路径也可以
   * @param {options} callback  返回值是css字符串，主要是自定义css
   * @param {options} needContextPath  是否需要css名字自定义和context上下文进行拼接，默认为false
   * @memberof InjectCssPlugin
   */
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const { NormalModule } = compiler.webpack;
    let { cssArr = [], callback, needContextPath = false } = this.options;
    let cbCss =  callback && callback()
    let allCssPathSets = new Set();
    if(cbCss && typeof cbCss === 'string') cssArr.push(cbCss)
    compiler.hooks.thisCompilation.tap("InjectCssPlugin", (compilation) => {
      const normalModuleHook =
        NormalModule.getCompilationHooks(compilation).loader;
      normalModuleHook.tap(
        "InjectCssPlugin loader",
        (loaderContext, module) => {
          cssArr.forEach((item) => {
            let contextPath = module.context;
            let cssPath = needContextPath ? getSiblingStylePath(contextPath, item) : item;
            
            console.log(fs.existsSync(cssPath))
            console.log(!allCssPathSets.has(cssPath))
            if (fs.existsSync(cssPath) && !allCssPathSets.has(cssPath)) {
              // 路径不存在就添加
              allCssPathSets.add(cssPath);
    
              let addDepence = new CommonJsRequireDependency('/Users/yangyankang/work/practice/webpack/webpack-inject-css-plugin/demo/injectIndependCss/add.css');
              module.dependencies.push(addDepence);
            }
          });
        }
      );
      
    });

    compiler.hooks.done.tap("InjectCssPlugin", () => {
      allCssPathSets.clear();
    });
  }
}


function getSiblingStylePath (contextPath, cssPath) {
  return path.join(contextPath, cssPath)
}
module.exports = InjectCssPlugin;
