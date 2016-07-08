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
        avalon: "js/avalon/avalon.shim",//必须修改源码，禁用自带加载器，或直接删提AMD加载器模块
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
});

require(['avalon', "mmRouter", "domReady", 'base'], function () {//第二块，添加根VM（处理共用部分）
    avalon.templateCache.empty = "&nbsp;"

    var model = avalon.define({
        $id: "people_root",
        people_head: 'empty',
        people_nav: 'empty',
        people_content: 'empty',
        result: {},
        currPath: "",
        params: {},
        query: {},
        args: "[]",
        nav_render: function () {
            console.log("people_nav - nav_render");
            if (avalon.vmodels.people_nav) {
                avalon.vmodels.people_nav.activeNode = model.params["ptype"];
                var targetName = model.params["lname"];
                console.log("targetName==" + targetName);
                avalon.vmodels.people_nav.data_list.forEach(function (el) {
                    //targetName=targetName==""?"i":targetName;
                    el.lname = targetName;
                })

            }
        }
    })

    //导航回调
    function callback() {

        model.currPath = this.path
        model.params = this.params
        model.query = this.query
        model.args = "[" + [].slice.call(arguments, 0) + "]"

        model.params["type"] = model.params["type"] == undefined ? "homenew" : model.params["type"];
        model.params["subtype"] = model.params["subtype"] == undefined ? "all" : model.params["subtype"];

        var pagepath = "people_" + model.params["ptype"];

        require([GLOBAL.moduleDir + 'modules/people/people_page/' + pagepath + ".js"], function () {
            avalon.vmodels.people_root.people_content = pagepath;
        });

    }

    //要监控的路由
    avalon.router.get("/", callback)
    avalon.router.get("/{type}", callback)
    avalon.router.get("/{type}/{subtype}", callback)
    avalon.router.get("/{type}/{subtype}/{id}", callback)

    avalon.history.start({
        basepath: "/avalon"
    })

});


