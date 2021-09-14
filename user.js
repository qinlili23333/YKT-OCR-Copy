// ==UserScript==
// @name         雨课堂超级复制增强版
// @namespace    https:/qinlili.bid
// @version      0.2
// @description  复制图片内文字
// @author       琴梨梨
// @match        https://www.yuketang.cn/v/quiz/quiz_result/*
// @match        https://www.yuketang.cn/v/quiz/quiz_info/*
// @icon         https://www.yuketang.cn/static/images/favicon.ico
// @grant        none
// @require https://unpkg.com/tesseract.js@v2.1.0/dist/tesseract.min.js
// @require https://cdn.jsdelivr.net/gh/qinlili23333/SakiProgress@1.0.3/SakiProgress.min.js
// @run-at document-idle
// ==/UserScript==

(function() {
    'use strict';
    SakiProgress.init();
    var i=0;
    console.log(Tesseract);
    var picList
    function getList(){
        picList=document.querySelectorAll(".pptimg");
        if(!picList.length){setTimeout(getList,1000)}else{
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
            var url=div.getAttribute('data-background')
            if(!url){
                var str=div.style.backgroundImage;
                url=str.substr(str.indexOf("(")+2,str.indexOf(")")-6);
            }
            Tesseract.recognize(
                url,
                'chi_sim',
                { logger: m => console.log(m) }
            ).then(({ data: { text } }) => {
                console.log(text.replace(/[ ]/g,"").replace(/[\r\n]/g,""))
                div.innerText=text.replace(/[ ]/g,"").replace(/[\r\n]/g,"")
                div.style.backgroundImage=""
                div.setAttribute('data-background',"")
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
