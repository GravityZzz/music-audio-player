var playStatus = 0,
musicfc = document.getElementsByTagName("audio")[0],
volume = 1,
musicLoop = '',
arrMusic = new Array(),
nowPlayNum = 0;
onlyLoop = 0,
arrMusicNum = 0,
allTime = 0,
currentnum = 0,
currentTime = 0,
lycArray = new Array();

//创建歌词数组存放JSON
function createLrc(lycText)
{
    lycArray = new Array();
    var medis = lycText;
    if (!lycText) {
        return false;
    }
    var lycs = new Array();
    var medises = medis.split("\n");
    $.each(medises,
    function(i, item)
    {
        var t = item.substring(item.indexOf("[") + 1, item.indexOf("]"));
        lycArray.push({
            t: (t.split(":")[0] * 60 + parseFloat(t.split(":")[1])).toFixed(3),
            c: item.substring(item.indexOf("]") + 1, item.length)
        });
    });
}

//歌词的JSON字符串转成数组
function jsonToArray(json) {
    arrMusic = new Array();
    if (json == null && json.toString() == '') {
        console.log('json error');
        return false;
    }
    for (var item in json) {
        arrMusic[item] = json[item];
    }
    attrMusic(arrMusic[nowPlayNum]);
    arrMusicNum = arrMusic.length;
}
jsonToArray(musicJson);

//进度条的变化
setInterval(function() {
    for (i = 0; i < lycArray.length; i++) {
        if (parseInt(lycArray[i].t) <= parseInt(currentTime + 0.1) && parseInt(lycArray[i + 1].t) >= parseInt(currentTime + 0.1)) {
            currentnum = i;
        }
    }
},1000);

//audio标签事件与背景图,换取进度条时间
musicfc.ontimeupdate = function() {
    if (lycArray.length > 0) {
        if (currentnum == lycArray.length - 1 && musicfc.currentTime.toFixed(3) >= parseFloat(lycArray[currentnum].t)) {
            $('#lyctext').html(lycArray[currentnum].c);
        }
        if (parseInt(lycArray[currentnum].t) <= parseInt(musicfc.currentTime + 0.1) && parseInt(musicfc.currentTime + 0.1) <= parseInt(lycArray[currentnum + 1].t)) {
            if (musicfc.currentTime > 0) {
                $('#lyctext').html(lycArray[currentnum].c);
            }
            currentnum++;
        }
    }
    allTime = musicfc.duration;
    if (allTime) {
        currentTime = musicfc.currentTime;
        $('.circleLight').css('background-color', 'hsla(' + Math.ceil(360 * Math.abs(currentTime / allTime)) + ',80%,50%,0.95)');
        var PlayProgress = Math.round(currentTime / allTime * 10000) / 100;
        $('#PlayProgress').val(PlayProgress);
        $('#PlayProgress').css("background-size", PlayProgress + "% 100%");
    }
    //进度条时间控制
    function shijian(offset)
    {
        var miao=(offset%60).toFixed(0);
        var minute=parseInt(offset/60)%60;
        var hour=parseInt(minute/60)%24;
        var date=parseInt(hour/24);
        var str = bushu(minute)+":"+bushu(miao);
        return str;
    }
    //自定义补0函数
    function bushu(num)
    {
        if (num < 10)
        {
            num="0"+num;
        }
        return num;
    }
    //console.log(currentTime,allTime);
    $(".timer_left").html("");
    $(".timer_left").html(shijian(currentTime));
    $(".timer_right").html("");
    $(".timer_right").html(shijian(allTime));

};

var timer;
var val = 0;
//点击播放时自动播放,状态为1
function autoPlay() {
    playStatus = 1;
    musicfc.play();
    $(".play").attr("class", 'fa fa-stop-circle play');
     $('#round_icon').addClass('play-tx2');
    // $(".play")[0].timer = setInterval(function ()
    // {
    //     val+=0.2;
    //     if (val >= 360)
    //     {
    //         val=0;
    //     }
    //     $("#round_icon").rotate(val);
    //     //console.log(val);
    // },15)
}

//点击停止时停止播放,状态为0
function stopPlay() {
    playStatus = 0;
    musicfc.pause();
    $(".play").attr("class", 'fa fa-play-circle play');
    $('#round_icon').removeClass('play-tx2');
    //clearInterval($(".play")[0].timer);
}

//点击播放/停止按钮判断状态函数
$('.play').click(function() {
    if (playStatus == 0) {
        autoPlay();
    } else {
        stopPlay();
    }
});

//点击左按钮切换
$('.play-left').click(function() {
    prevMusic();
    if (playStatus == 1)
    {
        autoPlay();
    }
    //clearInterval(timer);
    //clearInterval($(".play")[0].timer);
});

//点击右按钮切换
$('.play-right').click(function() {
    nextMusic();
    if (playStatus == 1) {
        autoPlay();
    }
    //clearInterval(timer);
    //clearInterval($(".play")[0].timer);
});

//播放器的src路径切换
function attrMusic(arr) {
    if (arr && arr.hasOwnProperty('url')) {
        musicfc.src = arr['url'];
        $('#round_icon').attr("src", arr['pic']);
        $('.songname').html(arr['title']);
        allTime = musicfc.duration;
        currentTime = musicfc.currentTime;
        createLrc(arr['lyc']);
        currentnum = 0;
    }
}

//点击上一个音乐
function prevMusic() {
    nowPlayNum--;
    if (nowPlayNum < 0) {
        nowPlayNum = arrMusic.length - 1;
    }
    attrMusic(arrMusic[nowPlayNum]);
    render_head();

}
console.log(arrMusic[0]);



//点击下一个音乐
function nextMusic() {
    nowPlayNum++;
    if (nowPlayNum > arrMusicNum) {
        nowPlayNum = 0;
    }
    attrMusic(arrMusic[nowPlayNum]);
    render_head()
}


//渲染歌曲title和author
function render_head()
{
    $(".song_head").html("");
    var obj=arrMusic[nowPlayNum];
    var Arr=[];
    Arr.push(obj);
    console.log(Arr);
    var str=Arr.map(function (item)
    {
        return `<p>${item.title}</p>
                  <span>${item.author}</span>`
    })
    $(".song_head").html(str);
}

//点击右上角判断是否有Cookie
$(".back").on("click",function ()
{
    console.log(666);
    if (Cookie.getCookie("user") && Cookie.getCookie("password"))
    {
        location.href="user.html";
    }
    else{
        setTimeout(function () {
            alert("请先登录,正在跳转");
            location.href="log.html";
        },1000)
    }
})

musicfc.addEventListener('ended', function() {
    if (playStatus == 1) {
        if (onlyLoop == 0) {
            nextMusic();
            autoPlay();
        }
    } else {
        playStatus = 0;
        musicfc.pause();
        $(".play").attr("class", 'fa fa-play-circle play');
        $('#round_icon').removeClass('play-tx2');
    }
    currentnum = 0;
}, false);

//进度条的宽度改变
function PlayProgress(val) {
    if (allTime && val) {
        musicfc.currentTime = Math.round(allTime * val / 100);
        $('#PlayProgress').css("background-size", val + "% 100%");
    }
}

//音频的循环播放
function cycle(loop) {
    if (loop == true) {
        musicfc.addEventListener("ended", autoPlay, false);
    } else {
        musicfc.removeEventListener("ended", autoPlay, false);
    }
}

//进度条对音频的时间判定
function timeChange(time) {
    var minute = time / 60;
    var minutes = parseInt(minute);
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    var second = time % 60;
    seconds = parseInt(second);
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    var allTimes = "" + minutes + "" + ":" + "" + seconds + ""
    return allTimes;
}

var dsq;
var scale = function(btn, bar) {
    this.btn = document.getElementById(btn);
    this.bar = document.getElementById(bar);
    this.step = this.bar.getElementsByTagName("DIV")[0];
};
scale.prototype = {
    start: function(x) {
        var f = this,
        g = document,
        b = window,
        m = Math;
        f.btn.style.left = x + 'px';
        this.step.style.width = Math.max(0, x) + 'px';
    }
}

var scale2 = new scale('progressBtn', 'progressBar');
var colseBar = function()
{
    clearInterval(dsq);
    dsq = setTimeout(function() {
        $('#progressBar').hide(1000);
    },
    3000);
}

Sition('round_icon', 'clicked', function()
{
    if (playStatus == 0) {
        autoPlay();
    } else {
        stopPlay();
    }
});

Sition('fcmusic', 'rightDownIng', function()
{
    //autoPlay();
    musicfc.currentTime = currentTime + 5;
    console.log(musicfc.currentTime);
    if (musicfc.currentTime > allTime) {
        musicfc.currentTime = allTime;
    }
    currentTime = musicfc.currentTime;
});

Sition('fcmusic', 'leftDownIng', function()
{
    musicfc.currentTime = currentTime - 5;
    console.log(musicfc.currentTime);
    if (musicfc.currentTime < 0) {
        musicfc.currentTime = 0;
    }
    currentTime = musicfc.currentTime;
});

Sition('fcmusic', 'rightCenter', function()
{
    nextMusic();
    if (playStatus == 1) {
        autoPlay();
    }
});
Sition('fcmusic', 'leftCenter', function()
{
    prevMusic();
    if (playStatus == 1) {
        autoPlay();
    }
});

Sition('fcmusic', 'leftUp', function()
{
    cycle(true);
    $.alertView("已开启单曲循环");
    onlyLoop = 1;
});
Sition('fcmusic', 'rightUp', function()
{
    cycle(false);
    $.alertView("已关闭单曲循环");
    onlyLoop = 0;
});

Sition('fcmusic', 'upRightIng', function(ev)
{
    volume += 0.02;
    if (volume > 1) {
        volume = 1;
    }
    $('#progressBar').show();
    musicfc.volume = volume;
    var progressWidth = $('.scale_panel').width();
    if (progressWidth >= progressWidth * volume) {
        scale2.start(progressWidth * volume - 8);
    } else {
        scale2.start(progressWidth * volume);
    }
    colseBar();
});

//控制音量
Sition('fcmusic', 'downRightIng', function(ev)
{
    volume -= 0.02;
    if (volume <= 0) {
        volume = 0;
    }
    $('#progressBar').show();
    musicfc.volume = volume;
    var progressWidth = $('.scale_panel').width();
    scale2.start(progressWidth * volume);
    colseBar();
});

Sition('fcmusic', 'downCenter', function(ev) {
    $('#tools').hide();
});

Sition('fcmusic', 'upCenter', function(ev) {
    $('#tools').show();
});

Sition('fcmusic', 'long', function()
{
    var msgjson = {
        title: "",
        msg: '<input name="search-name" id="search_name" class="search" type="search" placeholder="请输入歌曲名称" />',
        buttons: [{
            title: "搜索",
            click: function() {
                var name = $('#search_name').val();
                $.ajax({
                    url: "search.php?str=" + name,
                    async: false,
                    success: function(result) {
                        if (!result) {
                            $.alertView('无搜索结果');
                        } else {
                            var json2 = eval('(' + result + ')');
                            jsonToArray(json2);
                            autoPlay();

                        }
                    }
                })
            }
        },
        {
            title: "取消",
            color: "red",
            click: function() {}
        }]
    }
    $.alertView(msgjson);
});

function hengshuping() {
    if (window.orientation == 90 || window.orientation == -90) {
        $('#tools').hide();
        $('.block').css('max-width', '1300px');
        $('.block').css('height', '500px');
        $('#fcmusic').css('padding', '0,0');
    }
}

window.addEventListener("onorientationchange" in window ? "orientationchange": "resize", hengshuping, false);

//弹框提示
// var msgjson = {
//     title: "",
//     msg: "大爷,第一次玩？<br />让我来教您怎么<b style='color:green'>PY</b>吧！<span style='color:red'><br /><br /> 长按页面 -> 搜索歌曲</br />双击封面 -> 播放暂停</br />底部右滑 -> 快进音乐<br />底部左滑 -> 倒退音乐<br />音量 -> 右侧上下滑动<br />单曲 -> 顶部左右滑动<br />切换 -> 居中左右滑动<br />工具 -> 居中上下滑动</span><br /><b style='background: linear-gradient(to right, red, blue);-webkit-background-clip: text;color: transparent;'>o(*￣▽￣*)o</b>",
//     buttons: [{
//         title: "下次提示",
//         color: "red",
//         click: function() {}
//     },
//     {
//         title: "朕已知晓",
//         click: function() {
//             var t = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30);
//             document.cookie = "a=hello; expires=" + t.toGMTString();
//         }
//     }]
// }
// if (document.cookie.indexOf("a=hello") == -1) {
//     $.alertView(msgjson);
// }