var br = {};
br.download = function (content, fileName = 'default') {
    var aEle = document.createElement("a"),
    blob = new Blob([content]); 
    aEle.download = fileName+'.ass';
    aEle.href = URL.createObjectURL(blob);
    aEle.click();
}

//将lrc文件转为ass
br.lrc2ass = function (lrc,fileName = 'default') {
    var barrages = lrc.split('\n[');
    barrages[0] = barrages[0].slice(1);
    var assBarrages = [];
    var ass;
    //头部
    ass = `[Script Info]
Title: Danmu_${fileName}_xsaiting
Original Script: 小赛艇 (xsaiting)
ScriptType: v4.00+
Collisions: Normal
PlayResX: 544
PlayResY: 960
Timer: 10.0000

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Microsoft YaHei,30,&H00FFFFFF,&H00FFFFFF,&H28533B3B,&H500E0A00,0,0,0,0,100.0,100.0,0.0,0.0,1,1.0,1.0,1,30,100,20,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;
    barrages.forEach(barrage => {
        var time = barrage.substring(0, barrage.indexOf(']'));
		var name = barrage.substring(barrage.indexOf(']')+1, barrage.indexOf('\t'));
        var content = barrage.substring(barrage.indexOf('\t')+1);
        assBarrages.push({
            time: time,
            name: name,
            content: content,
        });
        var assT = new br.AssTime(time);
        assT.ms += 10;
        ass += `Dialogue: 0,${time},${assT.st()},Default,,0,0,0,,{\\fad(200,200)}【${name}】 ${content}\n`;
    });
    return ass;
}
br.AssTime = function (time) {
    var ts = time.split(':');
    function toDecimal2(x) {
        var f = Math.round(x * 100) / 100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
        while (s.length <= rs + 2) {
            s += '0';
        }
        return s;
    }
    this.ms = parseInt(ts[0])*3600+parseInt(ts[1])*60+parseFloat(ts[2]);
    this.st = () => {
        var h = Math.floor(this.ms/3600);
        var m = Math.floor((this.ms-h*3600)/60);
        var s = this.ms-h*3600-m*60;
        return `${h}:${m}:${toDecimal2(s)}`;
    }
}
br.submit = function () {
    var ele = document.querySelector('#c-danmu-file');
    br.fileTrans(ele.files);
    return false;
}
br.drop = function() {
    var body = document;
    var back = document.querySelector('#c-back');
    body.ondragenter = function (ev) {
        back.style.display = 'inline';
        console.log('enter',ev);
    }
    body.ondragleave = function (ev) {
        if (ev.clientX==0) {
            back.style.display = 'none';
        }
        console.log('leave',ev);
    }
    body.ondragover = function (ev) {
        ev.preventDefault();
    }
    body.ondrop = function(ev) {
        ev.preventDefault();
        back.style.display = 'none';
        var files = ev.dataTransfer.files;
        br.fileTrans(files);
    }
}
br.fileTrans = function(files) {
    if (files.length) {
        for (var i=0; i<files.length; i++) {
            var file = files[i];
            var name = files[i].name;
            var fileName = name.slice(0,-4);
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function () {
                var lrc = this.result;
                var ass;
                try {
                    ass = br.lrc2ass(lrc,fileName);
                } catch (e) {
                    console.log('出错',e);
                    return false;
                }
                console.log({
                    lrc: lrc,
                    ass: ass,
                    fileName: fileName
                });
                br.download(ass,fileName);
            }
        }
    }
}
br.drop();