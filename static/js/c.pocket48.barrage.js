/* 
    感谢 @h12345jack (github.com/h12345jack) 的贡献
*/

var br = {};
br.download = function (content, fileName = 'default') {
    var aEle = document.createElement("a"),
    blob = new Blob([content]); 
    aEle.download = fileName+'.ass';
    aEle.href = URL.createObjectURL(blob);
    aEle.click();
}

//将lrc文件转为ass
br.lrc2ass = function (lrc, fileName = 'default', timeint=10) {
    var barrages = lrc.split('\n[');
    barrages[0] = barrages[0].slice(1);
    var assBarrages = [];
    var ass;
    //头部
    ass = `[Script Info]
Title: Danmu_${fileName}_xsaiting,
Original Script: 小赛艇 (xsaiting, h12345jack)
ScriptType: v4.00+
Collisions: Reverse
PlayResX: 544
PlayResY: 960
Timer: 10.0000
WrapStyle：0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Microsoft YaHei, 30, &H00FFFFFF, &H00FFFFFF, &H28533B3B,&H500E0A00,0,0,0,0,100.0,100.0,0.0,0.0,1,1.0,1.0,1,30,20,20,134

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;
    

    let time2number = (x)=>{
        const ts = x.split(":")
        return parseInt(ts[0])*3600+parseInt(ts[1])*60+parseFloat(ts[2]);
    }

    let sum = (array)=>{
        return array.reduce((a, b)=>a+b, 0)
    };

    let add0 = (num, length) =>{
        return (Array(length).join('0') + num).slice(-length);
    }

    let toDecimal2 = (x) => {
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

    let number2time = (ms) => {
        const h = Math.floor(ms/3600);
        const m = Math.floor((ms-h*3600)/60);
        const s = ms-h*3600-m*60;
        return `${add0(h,2)}:${add0(m,2)}:${add0(toDecimal2(s),5)}`;
    }

    let danmu_maker = (danmuLists) => {
        const item_number = 5;
        const line_limit = 20;
        let danmu_list = [];
        let danmu_lines = [];


        danmuLists.forEach(item=>{
            const author = item.name;
            const content = item.content;
            let author_content = `【${author}】${content}`;
            let lengs = author_content.length;
            lengs = parseInt(lengs/line_limit);
            if (lengs >= 1) {
                let lengs2 = content.length;
                lengs2 = parseInt(lengs2/line_limit);
                let content_tmp = [];
                let content_array = content.split("")
                console.log(lengs2);
                for(let i=0; i<lengs2+1; ++i){
                    content_tmp.push(content_array.slice(i*line_limit, (i+1)*line_limit).join(""));
                }
                lengs += lengs2;
                console.log(content_tmp);
                tmp = content_tmp.join('\\N \\h \\h');
                console.log(tmp)
                author_content = `【${author}】${tmp}`;
            };
            danmu_list.push({
                ...item,
                author_content
            });
            danmu_lines.push(lengs);
        });
        danmu_lines = [...danmu_lines, 0, 0, 0, 0, 0];
        let danmu_display_list = [];
        let danmu_output_list = [];
        
        for(let i=0; i < danmu_list.length; ++i){
            const item_time = danmu_list[i].time_ms; 
            danmu_display_list.push({
                ...danmu_list[i],
                'multiline_trick_sum': danmu_lines.slice(i, i + item_number),
                'time_list': []
            })
            danmu_display_list.forEach(item=>{
                item.time_list.push(item_time)
            });
            if(danmu_display_list.length > item_number){
                danmu_output_list.push(danmu_display_list[0]);
                danmu_display_list = danmu_display_list.slice(1, danmu_display_list.length)
            }
        };

        danmu_output_list = [...danmu_output_list, ...danmu_display_list];
        for(let i=0;i<danmu_output_list.length; ++i){
            const time_list = danmu_output_list[i]['time_list'];
            if(time_list.length == 1){
                time_list.push(time_list[time_list.length-1] + 10)
            }
            const author_content = danmu_output_list[i]['author_content'];
            const multiline_trick_sum =  danmu_output_list[i]['multiline_trick_sum'];
            for(let j=0; j < time_list.length - 1; ++j){
                const begin_time = time_list[j];
                const end_time = time_list[j+1];
                const x1 = 20;
                const x2 = 20;
                const y1 = 900 - j*32 - sum(multiline_trick_sum.slice(0, j+1)) * 32;
                const y2 = 900 - (j+1)*32 - sum(multiline_trick_sum.slice(0, j+1)) * 32;
                ass += `Dialogue: 0, ${number2time(begin_time)}, ${number2time(end_time)}, Default,,0,0,0,,{{\\move(${x1}, ${y1}, ${x2}, ${y2})}} ${author_content}\n`;
            }
        }    

    }
    let danmuLists = barrages.map(barrage => {
        let time = barrage.substring(0, barrage.indexOf(']'));
		const name = barrage.substring(barrage.indexOf(']')+1, barrage.indexOf('\t'));
        const content = barrage.substring(barrage.indexOf('\t')+1);
        return {
            time_ms: time2number(time),
            name: name,
            content: content,
        }
    });
    danmu_maker(danmuLists);
    return ass;


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
                var timeint = document.querySelector('#c-danmu-timeint').value;
                var ass;
                try {
                    ass = br.lrc2ass(lrc,fileName,timeint);
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