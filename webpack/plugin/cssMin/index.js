
class CssMin {
    constructor(){
    }
    start(text){
        return text.replace(/\{[^\}]+\}/g,(match)=>{
            return match.replace(/\s/g,'')
        }).replace(/\}[\W]+/g,(match)=>{
            return match.replace(/\s/g,'')
        })
    }
}


module.exports = CssMin
