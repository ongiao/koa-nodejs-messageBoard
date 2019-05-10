const userModel = require('../lib/mysql.js');

module.exports = {
    getConstNum: () => {
        return 'liuyanbanSecretString';
    },

    htmlEscape: (text) => {
        return text.replace(/[<>"&]/g, function(match, pos, originalText){
            switch(match){
            case "<": return "&lt;"; 
            case ">":return "&gt;";
            case "&":return "&amp;"; 
            case "\"":return "&quot;"; 
          } 
          }); 
    },

    getAllPost: () => {
        let res = userModel.findAllPost();
        return res;
    },

    getOnePost: (postId) => {
        let res = userModel.findPostDataById(postId);
        return res;
    },

    getAllComment: (postId) => {
        let res = userModel.getPostAllComment(postId);
        return res;
    }
}