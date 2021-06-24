var fs = require('fs');



var srcPath = process.cwd() + '/src'
var distPath = process.cwd() + '/dist'


// var leftReg = /(\w+(\s+)?\{)/g
// var rightReg = /(\})/g;

var reg = /(\w+(\s+)?\{)|(\})/g;


class ScssParser {
    constructor(){
    }
    start(){
        //每次新建目录
        if (fs.existsSync(distPath)){
            var files = fs.readdirSync(distPath);
            files.forEach((file)=>{
                fs.unlinkSync(process.cwd() + '/dist/' + file)
            });

            fs.rmdirSync(process.cwd() + '/dist/')
        }
        fs.mkdirSync(distPath);




        var files = fs.readdirSync(srcPath);
        files.forEach((file)=>{
            fs.readFile(process.cwd() + '/src/' + file,(err,content)=>{
                if (err){
                    console.log('读取内容 失败');
                    console.log(err)
                    return;
                };










                //         1       2                   1        2 1 0     1      2 1 0
                //测试 start
                //var contentString = 'a{ aChild{background: green;} aChild2 {} }    b{ bChild{}}'
                //测试 end





                var contentString = content.toString()

                //解析css结构
                var arr = matchStr(contentString,reg);
                if (arr.length %2){
                    console.log('语法错误');
                    return;
                }

                var rootNode = {
                    parentNode: null,
                    self: {
                        value: '',
                        name: ''
                    },
                    children: []
                };

                //测试 start
                global.rootNode = rootNode;
                //测试  end

                var currentNode = rootNode

                arr.forEach((matchItemObj)=>{

                    var matchItem = matchItemObj[0];
                    //进入一层
                    if (matchItem.match(/(\w+(\s+)?\{)/)){


                        var startStr = contentString.substring(matchItemObj.index -1);

                        //获取代码块
                        var blockCode = getBlockCode(startStr);

                        var newNode = {
                            parentNode: currentNode,
                            self: {
                                value: getValue(blockCode),
                                name: matchItem.match(/\w+/)[0]
                            },
                            children: []
                        }
                        currentNode.children.push(newNode);
                        currentNode = newNode;
                    }
                    //退出一层
                    else if (matchItem.match(/(\})/)){
                        currentNode = currentNode.parentNode;
                    }
                });





                console.log(rootNode)

                writeCss(rootNode)
                function writeCss(node){



                    if (node.self.name){


                        var absoluteName = getAbsoluteName(node);




                        var res = fs.appendFileSync('/Users/apple/workPlace/nodePluginTest/dist/a.scss', `${absoluteName}{${node.self.value}}\n`)
                        debugger;

                        if (res){
                            debugger;
                            console.log('写入内容 失败');
                            console.log(err)
                            return;
                        };
                        console.log('写入内容成功')

                    }

                    if (node.children && node.children.length){
                        node.children.forEach((childNode)=>{
                            writeCss(childNode)
                        })
                    }

                }





            })

        })


    }
};



function matchStr(string,reg){
    var arr = [];
    while ((match = reg.exec(string)) != null) {
        arr.push(match)
    };
    return arr;
}

function getValue(blockCode){

    var matchesArr = matchStr(blockCode,reg);
    var count = 0;
    blockCode = blockCode.replace(reg,(match)=>{
        count++;

        //去掉头部 和 尾部
        if (count == 1 || count == matchesArr.length){
            return '';
        }else{
            return match;
        }
    })

    //只有一层结构
    if (matchesArr.length == 2){
        return blockCode
    }

    //多层结构，去除不是自身value 的代码
    else{
        var matchesArr = matchStr(blockCode,reg);
        var startIndex = matchesArr[0].index;
        var lastIndex = matchesArr[matchesArr.length -1].index;

        var valueString = '';
        for (var i=0;i<blockCode.length;i++){
            if (i<startIndex || i>lastIndex){
                valueString += blockCode[i]
            }
        }
        return valueString;
    }
}

function getAbsoluteName(node){
    var array = [];
    getName(node);
    function getName(node){
        array.unshift(node.self.name)
        if (node.parentNode){
            getName(node.parentNode)
        }
    }
    return array.join(' ')
}



function getBlockCode(str){

    var leftBrace = 0;
    var rightBrace = 0;

    for(var i=0;i<str.length;i++){

        if (str[i] == '{'){
            leftBrace ++;
        }else if (str[i] == '}'){
            rightBrace ++;
        }

        if (leftBrace != 0 && rightBrace !=0 && leftBrace == rightBrace ){
            return str.substring(0,i + 1)
        }

    }
}


var scssParserCase = new ScssParser();
scssParserCase.start();






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


if (1){
    //测试 start
    var http = require('http');
    var server = http.createServer((request,response)=>{

    });
    server.listen(8588,'localhost',()=>{
        console.log('server is listening at 8588')
    })


    global.fs = fs;
    global.scssParserCase = scssParserCase;
    global.distPath = distPath;
    global.srcPath = srcPath;
//测试 end
}


