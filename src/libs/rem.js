// 设置 rem 函数
function setRem () {
   
    let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
//得到html的Dom元素
    let htmlDom = document.getElementsByTagName('html')[0];
//设置根元素字体大小
    htmlDom.style.fontSize= htmlWidth/50 + 'px';
     //设计稿元素尺寸/50，比如元素宽750px,最终页面会换算成 15rem
}
// 初始化
setRem();
// 改变窗口大小时重新设置 rem
window.onresize = function () {
    setRem()
}