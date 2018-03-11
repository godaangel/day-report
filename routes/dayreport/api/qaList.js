const qaList = {
  '列表': ['列表基础配置请参考：<a target="_blank" href="http://doc.wiiqq.com/wau/assembly/frames/dataTable.html">列表页基础配置</a>'],
  '列表展开项': ['列表展开项必须要在grid容器里面才能支持，如果需要配置，那么可以在给按钮类型配置为expanded，并配置model为expanded的preloader（弹窗），preloader可支持任意组件。'],
  '按钮': ['按钮类型包括ajax类型、dialog类型、link类型、download类型、submit提交表单、dismiss关闭弹窗、up上移、down下移、expanded展开项、return返回类型、function_trigger自定义触发按钮等','按钮配置请参考：<a target="_blank" href="http://doc.wiiqq.com/wau/assembly/controls/button.html">按钮基础配置</a>'],
  '按钮组': ['按钮组请参考：<a target="_blank" href="http://doc.wiiqq.com/wau/assembly/controls/buttonGroup.html">按钮组</a>'],
  '按钮自定义': ['按钮能够自定义设置事件内容，此时按钮类型为function_trigger，通过<br>F.evt.on("button.other.trigger", function() { <br>//此处填写你的触发事件 <br>});'],
  '表单': ['表单能够进行填写、展示、回显等操作，可以配置表单按钮和展示内容、提交方式、返回链接等等，详见：<a href="http://doc.wiiqq.com/wau/assembly/frames/form.html" target="_blank">表单配置</a>'],
  '表单跳转': ['表单跳转可以在form关键词下配置return_url，也能在提交接口的返回值里面配置'],
  '跳转页面': ['页面跳转能够运用在表单、ajax等提交操作的时候，推荐在返回值接口里面配置，配置格式为：{"ret": 0, "msg": "ok", "errorcode": 0, "data": {"return_url": "你的跳转链接"}}，通过return_url来配置。']
};

module.exports = qaList;