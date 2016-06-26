require.config({//require 配置
    baseUrl: '',
    paths: {
        jquery: 'js/jquery/jquery-1.7.2.min',
        'jquery.ui.widget': 'js/jquery/jquery.ui.widget',//上传插件
        fileupload: 'js/jquery/jquery.fileupload',//上传插件
        layer:'js/layer/layer',
        jqcookie:'js/jquery/jquery.cookie',
        jqform:'js/jquery/jquery.form',
        mock: 'js/jquery/mock',
        avalon: "js/avalon/avalon",//必须修改源码，禁用自带加载器，或直接删提AMD加载器模块
        mmHistory: 'js/avalon/mmHistory',
        mmRouter: 'js/avalon/mmRouter',
        mmState: 'js/avalon/mmState',
        domReady: 'js/require/domReady',
        text: 'js/require/text',
        css: 'js/require/css',
        base:'js/page/base'
    },
    priority: ['text', 'css'],
    shim: {
        jquery: {
            exports: "jQuery"
        },
        avalon: {
            exports: "avalon"
        },
        'jquery.ui.widget':{
            deps:['jquery'],
            exports:"jquery.ui.widget"
        },
        fileupload:{
            deps:[ 'jquery','jquery.ui.widget'],
            exports:"fileupload"
        },
        layer:['jquery'],
        base:{
            deps:['jquery','layer'],
            exports:"base"
        },
        mock:{
            exports:"Mock"
        }
    }
});

//初始化全局变量，加载默认配置等
require([], function() {
    //全局变量
    window.GLOBAL={};
    GLOBAL.moduleDir="./"; //模块目录
    GLOBAL.ajaxUrl="http://localhost/social-web";   //Ajax请求地址根目录
    GLOBAL.curUserID=""; //当前登录用户ID
    GLOBAL.curUser={};    //当前便当用户对象
    GLOBAL.pageSize=10;   //分页大小

    GLOBAL.token="";      //token
    GLOBAL.gettoken=function () {
        if(GLOBAL.token=="")
        {
            console.log("请去登录");
            moniLogin(); //测试执行模拟登录，填充token，真实环境跳转到登录页
        }
        else
        {
            return GLOBAL.token;
        }
    }

    require(['js/page/mockdata']);
    require(['js/page/indexmockdata']);

});

//从cookie读取 token,刷新页面时执行
require(["jquery","jqcookie"], function() {
    if($.cookie("token")!=undefined)
    {
        GLOBAL.token= $.cookie("token");
    }
});

//模拟登陆
function moniLogin() {
    var loginUrl=GLOBAL.ajaxUrl+"/user/signin";
    var email;
    var pwd;
    email="zhangsan@bimt.com";
    pwd="111111"
    //console.log(id);
    var reqData={"email":email,"password":pwd}
    // url, data, async, type, dataType, successfn, errorfn
    $.axs(loginUrl,reqData,function (data) {
        GLOBAL.token=data.result;
        $.cookie("token",GLOBAL.token);
    })

}


