// ==UserScript==
// @name         雨课堂超级复制
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  复制图片内文字
// @author       琴梨梨
// @match        https://www.yuketang.cn/v/quiz/quiz_result/*
// @icon         https://www.yuketang.cn/static/images/favicon.ico
// @grant        none
// @require https://cdn.jsdelivr.net/npm/clipboard@2.0.8/dist/clipboard.min.js
// @require https://unpkg.com/tesseract.js@v2.1.0/dist/tesseract.min.js
// @require https://cdn.jsdelivr.net/gh/qinlili23333/SakiProgress@1.0.3/SakiProgress.min.js
// @run-at document-idle
// ==/UserScript==

(function() {
    'use strict';
    SakiProgress.init();
    var i=0;
    console.log(ClipboardJS);
    console.log(Tesseract);
    var picList
    function getList(){
        picList=document.querySelectorAll(".pptimg.notBullet");
        if(!picList.length){setTimeout(getList,1000)}else{
            var clipboard = new ClipboardJS(picList);
            SakiProgress.showDiv();
            recognize();
        }
    }
    getList();
    function recognize(){
        if(picList[i]){
            SakiProgress.setPercent(i/picList.length*100)
            SakiProgress.setText("正在识别第"+(i+1)+"张图片...")
            var div=picList[i];
            Tesseract.recognize(
                div.getAttribute('data-background'),
                'chi_sim',
                { logger: m => console.log(m) }
            ).then(({ data: { text } }) => {
                console.log(text.replace(/[ ]/g,"").replace(/[\r\n]/g,""))
                div.setAttribute("data-clipboard-text",text.replace(/[ ]/g,"").replace(/[\r\n]/g,""))
                i++
                recognize();
            })
        }else{
            SakiProgress.setText("识别完成")
            SakiProgress.clearProgress()
            console.log("识别完成")
        }
    }

})();
