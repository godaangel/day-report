webpackJsonp([5],{M93x:function(n,t,a){"use strict";function e(n){a("vtA/")}var i=a("xJD8"),o=a("bIPK"),s=a("VU/8"),r=e,u=s(i.a,o.a,!1,r,null,null);t.a=u.exports},NHnr:function(n,t,a){"use strict";function e(n,t){return window.sessionStorage[n]||t}Object.defineProperty(t,"__esModule",{value:!0});var i=a("7+uW"),o=a("M93x"),s=a("YaEn"),r=a("mo+Q"),u=a.n(r),c=a("WNRV"),l=(a.n(c),a("v5o6")),d=a.n(l);i.a.use(c.ToastPlugin),i.a.use(c.AlertPlugin),i.a.use(c.ConfirmPlugin),i.a.use(u.a),d.a.attach(document.body),i.a.config.productionTip=!1,s.a.beforeEach(function(n,t,a){i.a.$wii.toast.show({text:"加载中",type:"loading",time:5e3}),"required"!=n.meta.requireAuth?e("report_token")?a():a({path:"/login"}):a()}),s.a.afterEach(function(n,t){i.a.$wii.toast.hide()}),new i.a({el:"#app",router:s.a,template:"<App/>",components:{App:o.a}})},YaEn:function(n,t,a){"use strict";var e=a("7+uW"),i=a("/ocq"),o=function(n){a.e(3).then(function(){n(a("Quw4"))}.bind(null,a)).catch(a.oe)},s=function(n){a.e(2).then(function(){n(a("31uc"))}.bind(null,a)).catch(a.oe)},r=function(n){a.e(0).then(function(){n(a("Lr34"))}.bind(null,a)).catch(a.oe)},u=function(n){a.e(1).then(function(){n(a("8h4e"))}.bind(null,a)).catch(a.oe)};e.a.use(i.a);var c=new i.a({mode:"hash",routes:[{path:"/login",component:o,name:"login",meta:{requireAuth:"required"}},{path:"/index",component:s,name:"index"},{path:"/add",component:r,name:"add"},{path:"/edit/:id",component:r,name:"edit"},{path:"/detail/:id",component:u,name:"detail"},{path:"/",redirect:"/index",name:"default"}]});t.a=c},bIPK:function(n,t,a){"use strict";var e=function(){var n=this,t=n.$createElement,a=n._self._c||t;return a("div",{staticClass:"container",attrs:{id:"app"}},[n.isLogin?a("div",{staticClass:"row"},[a("div",{staticClass:"col-xs-12"},[a("nav",{staticClass:"navbar navbar-inverse navbar-embossed",attrs:{role:"navigation"}},[n._m(0),n._v(" "),a("div",{staticClass:"collapse navbar-collapse",attrs:{id:"navbar-collapse-01"}},[a("ul",{staticClass:"nav navbar-nav navbar-left"},[a("li",[a("router-link",{attrs:{to:{name:"index"}}},[n._v("日报列表")])],1),n._v(" "),a("li",[a("router-link",{attrs:{to:{name:"add"}}},[n._v("新增日报")])],1)]),n._v(" "),a("ul",{staticClass:"nav navbar-nav navbar-right"},[a("li",[a("a",[n._v("欢迎，"+n._s(n.loginUser))])]),n._v(" "),a("li",[a("a",{on:{click:function(t){n.logout()}}},[n._v("退出登录")])])])])])])]):n._e(),n._v(" "),a("router-view",{staticClass:"view"})],1)},i=[function(){var n=this,t=n.$createElement,a=n._self._c||t;return a("div",{staticClass:"navbar-header"},[a("button",{staticClass:"navbar-toggle",attrs:{type:"button","data-toggle":"collapse","data-target":"#navbar-collapse-01"}},[a("span",{staticClass:"sr-only"},[n._v("Toggle navigation")])]),n._v(" "),a("a",{staticClass:"navbar-brand",attrs:{href:"#"}},[n._v("DayReport")])])}],o={render:e,staticRenderFns:i};t.a=o},fIpt:function(n,t,a){"use strict";t.a={data:function(){return{token:window.sessionStorage.report_token}}}},"vtA/":function(n,t){},xJD8:function(n,t,a){"use strict";function e(n){window.sessionStorage.removeItem(n)}var i=a("fIpt");t.a={name:"app",data:function(){return{isLogin:null,loginUser:window.sessionStorage.report_username}},mixins:[i.a],mounted:function(){this.isLogin=!!this.token,this.$bus.on("loginTypeChange",this.loginTypeChange),this.$bus.on("loginNameChange",this.loginNameChange)},methods:{logout:function(){e("report_token"),this.$router.push({name:"login"}),this.isLogin=!1},loginTypeChange:function(n){this.isLogin=n},loginNameChange:function(){this.loginUser=window.sessionStorage.report_username}}}}},["NHnr"]);
//# sourceMappingURL=app.9347806477a895fa9ee1.js.map