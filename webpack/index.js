var fs = require('fs');
var path = require('path');


if (1){
    //测试 start
    var http = require('http');
    var server = http.createServer((request,response)=>{

    });
    server.listen(8588,'localhost',()=>{
        console.log('server is listening at 8588')
    })


    var fs = require('fs');
    var path = require('path');

    global.fs = fs;
    global.path = path;
//测试 end
}


class Webpack {
    constructor(config){

        this.config = config;
    }
    start(){

        var config = this.config;

        var regExp = /import\s+[\'\"][\.\/\w]+[\'\"](\s+)?\;/g;


        fs.readFile(config.entry,(err,content)=> {
            if (err) {
                console.log('读取内容 失败');
                console.log(err)
                return;
            };



            var pathObj = path.parse(config.entry);

            var contentString = content.toString();

            var matches = contentString.match(regExp);


            if (fs.existsSync( config.output )){
                fs.unlinkSync( config.output )
            }
            fs.appendFileSync( config.output ,'')


            matches.forEach((match)=>{
                var relativePath = match.match(/[\'\"][\.\/\w]+[\'\"]/)[0].replace(/[\'\"]/g,'')


                var absolutePath = path.resolve(pathObj.dir,relativePath);
                var text = fs.readFileSync(absolutePath).toString();

                if (path.parse(relativePath).ext == ".scss"){

                    //执行插件  start
                    var plugins = config.plugins;
                    plugins.forEach((plugin)=>{
                        text = plugin.start(text);
                    })
                    //执行插件  end


                    var fileContent =
                        `var styleTag = document.createElement('style');
                 styleTag.innerText = '${text}';
                 document.body.appendChild(styleTag);`

                }else{
                    var fileContent = text
                }





                fs.appendFileSync( config.output ,fileContent)

            })



            var selfContent = contentString.replace(regExp,(match)=>{
                return ''
            })

            fs.appendFileSync( config.output ,selfContent)




        })



    }
}




process.on('exit',(code)=>{
    debugger;
})
process.on('uncaughtException', (err, origin) => {
    fs.writeSync(
        process.stderr.fd,
        `Caught exception: ${err}\n` +
        `Exception origin: ${origin}`
    );
});
process.on('unhandledRejection', (reason, promise) => {
    debugger;

});

//未捕获错误监控
process.on('uncaughtExceptionMonitor', (err, origin) => {

    console.log(err)
});

module.exports = Webpack

