var fs = require('fs');



var srcPath = process.cwd() + '/src'
var distPath = process.cwd() + '/dist'


// var leftReg = /(\w+(\s+)?\{)/g
// var rightReg = /(\})/g;

var reg = /(\w+(\s+)?\{)|(\})/g;


class ScssParser {
    constructor(){
    }
    start(inText){
        //每次新建目录
        if (fs.existsSync(distPath)){
            var files = fs.readdirSync(distPath);
            files.forEach((file)=>{
                fs.unlinkSync(process.cwd() + '/dist/' + file)
            });

            fs.rmdirSync(process.cwd() + '/dist/')
        }
        fs.mkdirSync(distPath);




        var contentString = inText

        //         1       2                   1        2 1 0     1      2 1 0
        //测试 start
        //var contentString = 'a{ aChild{background: green;} aChild2 {} }    b{ bChild{}}'
        //测试 end



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


        function writeCss(node){
            if (node.self.name){

                var absoluteName = getAbsoluteName(node);
                text += `${absoluteName}{${node.self.value}}\n`;


            }

            if (node.children && node.children.length){
                node.children.forEach((childNode)=>{
                    writeCss(childNode)
                })
            }

        }

        var text = '';
        writeCss(rootNode);

        console.log('done');

        return text












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











if (1){
    //测试 start
    global.fs = fs;

    global.distPath = distPath;
    global.srcPath = srcPath;
//测试 end
}

module.exports = ScssParser

