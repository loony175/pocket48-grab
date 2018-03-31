var $$ = mdui.JQ;


//数据处理功能
var c = (function(){
    //口袋48api
    var api={
        live: "https://plive.48.cn/livesystem/api/live/v1/memberLivePage",
        liveOpen: "https://plive.48.cn/livesystem/api/live/v1/openLivePage",
        liveInfo: "https://plive.48.cn/livesystem/api/live/v1/getLiveOne",
        login: "https://puser.48.cn/usersystem/api/user/v1/login/phone",
        roomId: "https://pjuju.48.cn/imsystem/api/im/room/v1/login/user/list",
        roomMain: "https://pjuju.48.cn/imsystem/api/im/v1/member/room/message/mainpage",
        roomBoard: "https://pjuju.48.cn/imsystem/api/im/v1/member/room/message/boardpage",
    }
    //api代理访问
    var apiProxy = api = {
        live: "./proxy.php?f=live",
        liveOpen: "./proxy.php?f=liveOpen",
        liveInfo: "./proxy.php?f=liveInfo",
        login: "./proxy.php?f=login",
        roomId: "./proxy.php?f=roomId",
        roomMain: "./proxy.php?f=roomMain",
        roomBoard: "./proxy.php?f=roomBoard",
    }
    //url前缀
    var url={
        liveShare: "https://h5.48.cn/2017appshare/memberLiveShare/index.html?id=",
        livePic: "https://source.48.cn",
    }
    //团体、队伍、成员信息
    var info={
        //groupId: groupName
        group: {
            0:'全团', 10:'SNH48', 11:'BEJ48', 12:'GNZ48', 13:'SHY48', 14:'CKG48',
        },

        //teamId: [groupId,groupName]
        team: { 0:[0,'官方'], 1001:[10,'TEAM SII'], 1002:[10,'TEAM NII'], 1003:[10,'TEAM HII'], 1004:[10,'TEAM X'], 1005:[10,'TEAM XII'], 1006:[10,'TEAM FT'], 1007:[10,'预备生'], 1101:[11,'TEAM B'], 1102:[11,'TEAM E'], 1103:[11,'TEAM J'], 1201:[12,'TEAM G'], 1202:[12,'TEAM NIII'], 1203:[12,'TEAM Z'], 1207:[12,'预备生'], 1301:[13,'TEAM SIII'], 1302:[13,'TEAM HIII'], 1401:[14,'TEAM C'], 1402:[14,'TEAM K'], },

        //memberId: [realName,groupId,teamId,periodId,status,firstTeam]
        member: { 1:['张语格',10,1001,1001,1,1001], 2:['赵嘉敏',10,1001,1001,2,1001], 3:['陈观慧',10,1001,1001,1,1001], 4:['陈佳莹',10,1002,1002,1,1002], 5:['袁雨桢',10,1001,1002,1,1001], 6:['董艳芸',10,1002,1002,2,1002], 7:['冯薪朵',10,1002,1002,1,1002], 8:['孙芮',10,1001,1002,1,1001], 9:['沈之琳',10,1007,1002,1,1001], 10:['何晓玉',10,1002,1002,1,1002], 11:['温晶婕',10,1007,1002,1,1001], 12:['唐安琪',10,1002,1002,2,1002], 13:['罗兰',10,1002,1002,-1,1002], 14:['徐子轩',10,1001,1002,1,1001], 15:['孟玥',10,1002,1002,2,1002], 16:['李艺彤',10,1003,1002,1,1002], 17:['蒋芸',10,1001,1002,1,1001], 18:['徐晨辰',10,1001,1001,1,1001], 19:['孔肖吟',10,1001,1001,1,1001], 20:['李宇琪',10,1001,1001,1,1001], 21:['许佳琪',10,1001,1001,1,1001], 22:['黄婷婷',10,1002,1002,1,1002], 24:['林思意',10,1003,1002,1,1002], 25:['万丽娜',10,1003,1002,1,1002], 26:['龚诗淇',10,1002,1002,2,1002], 27:['赵粤',10,1002,1002,1,1002], 28:['李清扬',10,1007,1003,1,1003], 32:['郝婉晴',10,1002,1003,1,1003], 33:['易嘉爱',10,1002,1002,1,1002], 34:['陆婷',10,1002,1002,1,1002], 35:['莫寒',10,1001,1001,1,1001], 36:['钱蓓婷',10,1001,1001,1,1001], 37:['陈思',10,1001,1001,1,1001], 38:['戴萌',10,1001,1001,1,1001], 39:['吴哲晗',10,1001,1001,1,1001], 40:['邱欣怡',10,1001,1001,1,1001], 43:['徐伊人',10,1001,1003,1,1003], 45:['谢妮',10,1002,1003,1,1003], 46:['刘佩鑫',10,1002,1003,1,1003], 47:['王柏硕',10,1007,1003,1,1003], 48:['鞠婧祎',10,1002,1002,1,1002], 49:['曾艳芬',10,1002,1002,2,1002], 53:['袋王2',10,1002,0,99,1002], 63:['袋王',10,0,0,1,0], 67:['袁丹妮',10,1001,1003,1,1001], 68:['陈问言',10,1002,1002,1,1002], 1338:['袋王 Gavin',10,1001,0,99,1001], 1544:['刘炅然',10,1003,1003,1,1003], 2470:['徐晗',10,1003,1003,1,1003], 2508:['张昕',10,1003,1003,1,1003], 5526:['袋王4',10,1001,0,99,1001], 5527:['袋王5',10,1001,0,99,1001], 5560:['陈怡馨',10,1003,1003,2,1003], 5561:['李豆豆',10,1003,1003,-1,1003], 5562:['林楠',10,1003,1003,1,1003], 5563:['王璐',10,1003,1003,-1,1003], 5564:['吴燕文',10,1007,1003,1,1003], 5566:['许杨玉琢',10,1003,1003,1,1003], 5567:['杨惠婷',10,1003,1003,1,1003], 5574:['张雨鑫',10,1002,1003,1,1002], 5973:['SNH48',10,0,0,1,0], 6429:['赵晔',10,1001,1003,1,1001], 6431:['陈琳',10,1004,1004,1,1004], 6432:['冯晓菲',10,1004,1004,1,1004], 6734:['李晶',10,1004,1004,1,1004], 6735:['李钊',10,1004,1004,1,1004], 6736:['孙静怡',10,1004,1004,-1,0], 6737:['邵雪聪',10,1001,1004,1,1004], 6738:['宋昕冉',10,1004,1004,1,1004], 6739:['孙歆文',10,1004,1004,1,1004], 6740:['汪佳翎',10,1004,1004,1,1004], 6741:['汪束',10,1004,1004,1,1004], 6742:['王晓佳',10,1004,1004,1,1004], 6743:['谢天依',10,1004,1004,1,1004], 6744:['杨冰怡',10,1004,1004,1,1004], 6745:['闫明筠',11,1101,1004,1,1101], 6746:['杨韫玉',10,1004,1004,1,1004], 6747:['张丹三',10,1004,1004,1,1004], 6749:['张韵雯',10,1004,1004,-1,1004], 9073:['影视君',10,0,0,1,0], 48995:['刘力玮',10,1001,1005,-1,1001], 48997:['申月姣',10,1001,1005,-1,1001], 48998:['徐佳丽',11,1101,1005,2,1101], 49000:['刘诗蕾',10,1002,1005,-1,1002], 49003:['周怡',10,1002,1005,2,1002], 49005:['沈梦瑶',10,1003,1005,1,1003], 49006:['王露皎',14,1402,1005,1,1003], 49007:['袁航',10,1003,1005,1,1003], 63548:['陈珂',12,1201,1005,1,1005], 63549:['陈美君',11,1101,1005,1,1101], 63550:['陈音',10,1005,1005,2,1005], 63551:['陈韫凌',10,1004,1005,1,1005], 63552:['陈雨琪',12,1201,1005,1,1005], 63553:['杜雨微',12,1201,1005,1,1005], 63554:['段艺璇',11,1101,1005,1,1101], 63555:['费沁源',10,1003,1005,1,1005], 63556:['冯雪莹',11,1101,1005,2,1101], 63557:['高源婧',12,1201,1005,1,1005], 63558:['洪珮雲',10,1003,1005,1,1005], 63559:['胡晓慧',11,1101,1005,1,1101], 63560:['姜杉',10,1003,1005,1,1005], 63561:['蒋舒婷',10,1003,1005,1,1005], 63562:['林嘉佩',12,1201,1005,1,1005], 63563:['刘梦雅',12,1201,1005,1,1005], 63564:['李沁洁',12,1201,1005,1,1005], 63565:['刘筱筱',12,1201,1005,1,1005], 63566:['刘增艳',10,1001,1005,1,1005], 63567:['潘瑛琪',10,1004,1005,1,1005], 63568:['宋思娴',11,1101,1005,1,1101], 63569:['时语婕',10,1005,1005,-1,1005], 63570:['宋雨珊',10,1003,1005,1,1005], 63571:['田姝丽',11,1101,1005,1,1101], 63572:['谢蕾蕾',12,1201,1005,1,1005], 63573:['熊素君',11,1101,1005,1,1101], 63574:['严佼君',10,1002,1005,1,1005], 63575:['於佳怡',10,1003,1005,1,1005], 63576:['阳青颖',12,1201,1005,1,1005], 63577:['曾艾佳',12,1201,1005,1,1005], 63578:['张菡筱',11,1101,1005,2,1101], 63579:['邹佳佳',10,1005,1005,2,1005], 63580:['张凯祺',12,1201,1005,1,1005], 63581:['张文静',10,1007,1005,1,1005], 63582:['张怡',10,1002,1005,1,1005], 68795:['袋王活动1',10,1001,0,99,1001], 286973:['成珏',10,1007,1006,1,1001], 286974:['钱艺',10,1002,1006,-1,1002], 286975:['邓艳秋菲',10,1002,1006,-1,1002], 286976:['黄彤扬',10,1007,1006,1,1002], 286977:['孙珍妮',10,1003,1006,1,1003], 286978:['王金铭',13,1302,1006,2,1003], 286979:['张嘉予',10,1004,1006,1,1004], 286980:['林忆宁',10,1004,1006,1,1004], 286982:['吕梦莹',10,1007,1006,1,1005], 286983:['李佳恩',10,1003,1006,1,1005], 286984:['程文路',10,1005,1006,-1,1005], 327557:['胡怡莹',12,1201,1006,2,1006], 327558:['罗寒月',12,1201,1006,1,1006], 327559:['王馨悦',12,1201,1206,-1,1201], 327560:['张琼予',12,1201,1006,1,1006], 327561:['周倩玉',12,1201,1006,2,1006], 327562:['陈慧婧',12,1202,1006,1,1006], 327563:['陈楠茜',12,1202,1006,1,1006], 327564:['陈欣妤',12,1202,1006,1,1006], 327565:['冯嘉希',12,1202,1006,1,1006], 327566:['洪静雯',12,1202,1006,1,1006], 327567:['刘力菲',12,1202,1006,1,1006], 327568:['刘倩倩',12,1202,1006,1,1006], 327569:['卢静',12,1202,1006,1,1006], 327570:['孙馨',12,1202,1006,1,1006], 327571:['唐莉佳',12,1202,1006,1,1006], 327572:['冼燊楠',12,1202,1006,1,1006], 327573:['肖文铃',12,1202,1006,1,1006], 327574:['熊心瑶',12,1202,1006,1,1006], 327575:['郑丹妮',12,1202,1006,1,1006], 327576:['左嘉欣',12,1202,1006,1,1006], 327577:['左婧媛',12,1202,1006,1,1006], 327578:['林溪荷',11,1101,1006,1,1101], 327579:['刘姝贤',11,1101,1006,1,1101], 327580:['张梦慧',11,1101,1006,1,1101], 327581:['青钰雯',11,1101,1006,1,1101], 327582:['孙姗',11,1101,1006,1,1101], 327583:['文妍',11,1101,1006,2,1101], 327584:['胡博文',11,1101,1006,2,1101], 327585:['夏越',11,1101,1006,1,1101], 327586:['牛聪聪',11,1101,1006,1,1101], 327587:['冯思佳',11,1102,1006,1,1102], 327588:['陈姣荷',11,1102,1006,1,1102], 327589:['罗雪丽',11,1102,1006,1,1102], 327590:['毕梦媛',11,1102,1006,2,1102], 327591:['李梓',11,1102,1006,1,1102], 327592:['李媛媛',11,1102,1006,1,1102], 327593:['李诗彦',11,1102,1006,2,1102], 327594:['李想',11,1102,1006,1,1102], 327595:['郑一凡',11,1102,1006,1,1102], 327596:['马玉灵',11,1102,1006,1,1102], 327597:['苏杉杉',11,1102,1006,1,1102], 327598:['张笑盈',11,1102,1006,1,1102], 327599:['林堃',11,1102,1006,2,1102], 327600:['顼凘炀',11,1102,1006,1,1102], 327601:['陈倩楠',11,1102,1006,1,1102], 327602:['刘胜男',11,1102,1006,1,1102], 327603:['易妍倩',11,1102,1006,2,1102], 327682:['BEJ48',11,0,0,1,0], 327683:['GNZ48',12,0,0,1,0], 399631:['吕一',10,1001,1007,1,1001], 399652:['潘燕琦',10,1007,1007,1,1001], 399654:['赵韩倩',10,1001,1007,2,1001], 399657:['徐真',10,1002,1007,2,1002], 399662:['江真仪',10,1002,1007,1,1002], 399664:['刘菊子',10,1002,1007,1,1002], 399665:['张雅梦',10,1002,1007,2,1002], 399667:['刘瀛',10,1007,1007,1,1002], 399668:['许逸',10,1002,1007,1,1002], 399669:['袁一琦',10,1003,1007,1,1003], 399672:['祁静',10,1004,1007,1,1004], 399673:['曾晓雯',10,1003,1007,1,1005], 399674:['徐诗琪',10,1004,1007,1,1005], 407071:['吴月黎',11,1101,1101,2,1101], 407077:['陈逸菲',11,1101,1101,-1,1101], 407101:['陈雅钰',11,1103,1101,1,1103], 407103:['房蕾',11,1103,1101,1,1103], 407104:['葛司琪',11,1103,1101,1,1103], 407106:['黄恩茹',11,1103,1101,1,1103], 407108:['李泓瑶',11,1103,1101,1,1103], 407110:['刘闲',11,1103,1101,1,1103], 407112:['任心怡',11,1103,1101,1,1103], 407114:['任玥霖',11,1103,1101,1,1103], 407118:['单习文',11,1103,1101,2,1103], 407119:['石羽莎',11,1103,1101,1,1103], 407121:['孙语姗',11,1103,1101,1,1103], 407124:['叶苗苗',11,1103,1101,1,1103], 407126:['杨晔',11,1103,1101,1,1103], 407127:['张怀瑾',11,1103,1101,1,1103], 407130:['张韩紫陌',11,1103,1101,1,1103], 407132:['李娜(一期生)',11,1102,1101,1,1102], 407135:['杨一帆',11,1102,1101,1,1102], 407168:['王雨煊',11,1103,1101,1,1103], 410175:['黄黎蓉',12,1201,1201,1,1201], 410177:['向芸',12,1201,1201,2,1201], 410179:['戴欣佚',12,1202,1201,-1,1202], 410180:['李伊虹',12,1202,1201,1,1202], 411040:['尼德兰的微笑',10,0,0,-1,0], 417311:['陈桂君',12,1203,1201,1,1203], 417315:['陈梓荧',12,1203,1201,1,1203], 417316:['代玲',12,1203,1201,1,1203], 417317:['杜秋霖',12,1203,1201,1,1203], 417318:['刘嘉怡',12,1203,1201,1,1203], 417320:['龙亦瑞',12,1203,1201,1,1203], 417321:['农燕萍',12,1203,1201,1,1203], 417324:['王翠菲',12,1203,1201,1,1203], 417325:['王炯义',12,1203,1201,1,1203], 417326:['王偲越',12,1203,1201,1,1203], 417328:['王盈',12,1203,1201,1,1203], 417329:['王秭歆',12,1203,1201,1,1203], 417330:['杨可璐',12,1203,1201,1,1203], 417331:['杨媛媛',12,1203,1201,1,1203], 417332:['于珊珊',12,1203,1201,1,1203], 417333:['张心雨',12,1203,1201,2,1203], 417335:['赵欣雨',12,1203,1201,1,1203], 417336:['赵翊民',12,1203,1201,1,1203], 419966:['姚祎纯',10,1007,1007,1,1004], 443031:['悠游甜心A',10,0,0,99,0], 443032:['悠游甜心B',10,0,0,0,0], 444081:['许婉玉',11,1103,1101,1,1103], 458335:['李慧',13,1301,1301,1,1301], 458358:['南翎璞',13,1301,1301,2,1301], 459988:['徐静妍',13,1301,1301,2,1301], 459989:['王诗蒙',13,1301,1301,1,1301], 459991:['卢天惠',13,1301,1301,1,1301], 459992:['刘娜',13,1301,1301,1,1301], 459993:['刘娇',13,1301,1301,1,1301], 459994:['秦玺',13,1301,1301,1,1301], 459995:['赖梓惜',13,1301,1301,1,1301], 459996:['关思雨',13,1301,1301,1,1301], 459997:['朱燕',13,1301,1301,2,1301], 459999:['韩家乐',13,1301,1301,1,1301], 460000:['陈婧文',13,1301,1301,2,1301], 460002:['付紫琪',13,1301,1301,1,1301], 460003:['冯译莹',13,1301,1301,1,1301], 460004:['杨允涵',13,1301,1301,1,1301], 460005:['赵佳蕊',13,1301,1301,1,1301], 460007:['孙敏',13,1301,1301,1,1301], 460933:['SHY48',13,0,0,1,0], 480656:['董思佳',13,1302,1301,1,1302], 480665:['高志娴',13,1302,1301,1,1302], 480666:['寇承希',13,1302,1301,1,1302], 480667:['刘静晗',13,1302,1301,1,1302], 480668:['李晴',13,1302,1301,1,1302], 480670:['李熙凝',13,1302,1301,1,1302], 480671:['曲悦萌',13,1302,1301,1,1302], 480672:['任雨情',13,1302,1301,1,1302], 480673:['徐斐然',13,1302,1301,1,1302], 480674:['杨肖',13,1302,1301,1,1302], 480675:['张爱静',13,1302,1301,1,1302], 480676:['郑洁丽',13,1302,1301,1,1302], 480678:['张儒轶',13,1302,1301,1,1302], 480679:['张云梦',13,1302,1301,1,1302], 480680:['张幼柠',13,1302,1301,2,1302], 485376:['澳洲行活动一',10,0,0,99,0], 485380:['澳洲行活动二',10,0,0,99,0], 485381:['澳洲行活动三',10,0,0,99,0], 490333:['7SENSES',10,0,0,1,0], 524597:['GNZ48-星梦剧院',12,0,0,1,0], 526172:['SNH48-星梦剧院',10,0,0,1,0], 528094:['胡丽芝',11,1101,1102,1,0], 528101:['刘崇恬',11,1101,1102,1,0], 528106:['李沐遥',11,1101,1102,1,0], 528118:['毛其羽',11,1101,1102,1,0], 528329:['孙晓艳',11,1101,1102,1,0], 528330:['郑依灵',11,1101,1102,1,0], 528331:['黄子璇',11,1102,1102,1,0], 528332:['李烨',11,1102,1102,2,0], 528333:['徐静',11,1102,1102,1,0], 528334:['赵笛儿',11,1102,1102,1,0], 528335:['金锣赛',11,1103,1102,1,0], 528336:['兰昊',11,1103,1102,1,0], 528337:['刘一菲',11,1103,1102,1,0], 528339:['乔钰珂',11,1103,1102,1,0], 528340:['郑心雨',11,1103,1102,2,0], 529287:['48WAN游戏平台',10,0,0,1,0], 529991:['陈奕君',13,1301,1302,1,0], 530378:['菅瑞静',13,1301,1302,1,0], 530380:['叶锦童',13,1301,1302,1,0], 530381:['臧聪',13,1301,1302,1,0], 530383:['郑诗琪',13,1301,1302,1,0], 530384:['方诗涵',13,1302,1302,1,0], 530385:['高崇',13,1302,1302,1,0], 530386:['龚梦婷',13,1302,1302,1,0], 530387:['逯芳竹',13,1302,1302,1,0], 530388:['王菲妍',13,1302,1302,1,0], 530390:['王睿琦',13,1302,1302,1,0], 530392:['张羽涵',13,1302,1302,1,0], 530431:['陈佳莹',12,1201,1202,1,0], 530433:['陈俊宏',12,1201,1202,1,0], 530434:['陈乐添',12,1201,1202,1,0], 530435:['程一心',12,1201,1202,1,0], 530436:['方晓瑜',12,1201,1202,1,0], 530439:['高雪逸',12,1202,1202,1,0], 530440:['赖俊亦',12,1203,1202,1,0], 530443:['梁可',12,1201,1202,1,0], 530444:['刘小末',12,1201,1202,1,0], 530446:['唐诗怡',12,1202,1202,1,0], 530447:['谢艾琳',12,1202,1202,1,0], 530450:['张秋怡',12,1203,1202,1,0], 530451:['郑悦',12,1202,1202,1,0], 530452:['朱怡欣',12,1201,1202,1,0], 530584:['郭倩芸',10,1002,1008,1,0], 533852:['陶波尔',10,1002,1008,1,0], 534729:['文文',10,1003,1008,-1,0], 538697:['沈小爱',11,1101,1102,1,0], 538735:['金莹玥',10,1002,1008,1,0], 540106:['赵梦婷',10,1003,1008,-1,0], 541132:['林歆源',10,1007,1008,1,0], 565225:['CKG48',14,0,0,1,0], 592320:['贺苏堃',10,1005,1008,-1,0], 592348:['许嘉怡',10,1005,1008,-1,0], 593820:['孙亚萍',10,1007,1008,1,0], 593999:['葛佳慧',10,1002,1008,2,0], 594002:['姜涵',10,1003,1008,2,0], 594003:['王奕',10,1003,1008,1,0], 594005:['熊沁娴',10,1003,1008,1,0], 601302:['梁婉琳',12,1203,1203,1,0], 606343:['马凡',10,1006,1008,1,0], 607507:['毕瑞珊',12,1203,1203,1,0], 607510:['程子钰',12,1207,1203,1,0], 607511:['邓惠恩',12,1207,1203,1,0], 607513:['符冰冰',12,1207,1203,1,0], 607515:['黄楚茵',12,1207,1203,1,0], 607516:['何梦瑶',12,1203,1203,1,0], 607521:['罗可嘉',12,1207,1203,1,0], 607523:['林芝',12,1207,1203,1,0], 607524:['汪慕远',12,1207,1203,1,0], 607591:['吴羽霏',12,1207,1203,1,0], 607592:['叶晓梦',12,1207,1203,1,0], 607594:['余芷媛',12,1203,1203,1,0], 608995:['李彬玉',13,1301,1303,1,0], 608997:['司珀琳',13,1301,1303,1,0], 609001:['周佳怡',13,1301,1303,1,0], 609002:['赵天杨',13,1301,1303,1,0], 610040:['相望',13,1302,1303,1,0], 610042:['唐霖',13,1302,1303,1,0], 613487:['朱星宇',14,0,1008,0,0], 614528:['柏欣妤',14,1401,1401,1,0], 614725:['李恩锐',14,1401,1401,1,0], 614727:['李姗姗',14,1401,1401,1,0], 614728:['雷宇霄',14,1401,1401,1,0], 614729:['李泽亚',14,1401,1401,1,0], 614730:['孟玥',14,1401,1401,1,0], 614731:['毛译晗',14,1401,1401,1,0], 614733:['谯玉珍',14,1401,1401,1,0], 614734:['冉蔚',14,1401,1401,1,0], 614735:['田倩兰',14,1401,1401,1,0], 614736:['陶菀瑞',14,1401,1401,1,0], 614738:['伍寒琪',14,1401,1401,1,0], 614739:['王梦竹',14,1401,1401,1,0], 614740:['王娱博',14,1401,1401,1,0], 614741:['曾佳',14,1401,1401,1,0], 614742:['左欣',14,1401,1401,1,0], 614743:['周源',14,1401,1401,1,0], 614749:['艾芷亦',14,1402,1401,1,0], 614750:['邓倩',14,1402,1401,1,0], 614752:['樊曦月',14,1402,1401,1,0], 614753:['郝婧怡',14,1402,1401,1,0], 614754:['韩林芹',14,1402,1401,1,0], 614755:['黄琬璎',14,1402,1401,1,0], 614756:['林舒晴',14,1402,1401,1,0], 614757:['李瑜璇',14,1402,1401,1,0], 614758:['石勤',14,1402,1401,1,0], 614760:['田祯臻',14,1402,1401,1,0], 614761:['吴学雨',14,1402,1401,1,0], 614762:['夏文倩',14,1402,1401,1,0], 614770:['章宇阳',14,1402,1401,1,0], 614772:['郑阳莹',14,1402,1401,1,0], 614773:['赵泽慧',14,1402,1401,1,0], 614776:['吴晶晶',14,1402,1401,1,0], 617948:['金鑫',11,1102,1103,1,0], 618319:['程戈',13,1302,1303,1,0], 623828:['李娜(三期生)',11,1102,1103,1,0], 623832:['李宗颐',11,1102,1103,1,0], 624121:['何阳青青',11,1103,1103,1,0], 624311:['李晨曦',12,1207,1204,1,0], 624312:['舒湘',12,1207,1204,1,0], 624313:['王梦媛',12,1207,1204,1,0], 624314:['徐佳音',12,1207,1204,1,0], 624315:['肖文静',12,1207,1204,1,0], 624318:['张紫颖',12,1207,1204,1,0], 652650:['杨鑫',11,1101,1103,1,0], 652652:['周洁艺',11,1101,1103,1,0], 654707:['青春大本营',10,0,0,1,0], },
        groupId2name: function(groupId){
            if (this.group[groupId]){
                return this.group[groupId];
            }
        },
        teamId2name: function(teamId){
            if (this.team[teamId]){
                return this.team[teamId][1];
            }
        },
        memberId2name: function(memberId){
            if (this.member[memberId]){
                return this.member[memberId][0];
            }
        },
    };

    //将表单转化为ajax对象
    var formTrans= function(cData){
        /* ajax示例
            $$.ajax({
                method: 'POST',
                url: './test.php',
                headers: {
                    'Content-Type' : 'application/json',
                },
                data: {
                    key1: 'val1',
                    key2: 'val2'
                },
                success: function (data) {
                    console.log(data);
                }
                error: function (xhr, textStatus) {
                    // xhr 为 XMLHttpRequest 对象
                    // textStatus 为包含错误代码的字符串
                }
                statusCode: {
                    404: function (xhr, textStatus) {
                        alert('返回状态码为 404 时被调用');
                    },
                    200: function (data, textStatus, xhr) {
                        alert('返回状态码为 200 时被调用');
                    }
                }
            });
        */
        var cAjax={};
        //方法 POST
        cAjax.method="POST";
        switch(cData.func){
            //成员直播功能
            case 0:
                cAjax.url=api.live;
                cAjax.headers={
                    "Content-Type": "application/json",
                    "version": "5.0.1",
                    "os": "Android"
                };
                cAjax.data=JSON.stringify({
                    "lastTime": cData.lastTime,
                    "limit": cData.limit,
                    "memberId": cData.memberId || 0,
                    "groupId": cData.groupId || 0,
                });
            break;

            //公演功能
            case 1: case 2:
                cAjax.url=api.liveOpen;
                cAjax.headers={
                    "Content-Type": "application/json",
                    "version": "5.0.1",
                    "os": "Android"
                };
                cAjax.data={
                    "lastTime": cData.lastTime,
                    "limit": cData.limit,
                    "groupId": cData.groupId || 0,
                };
                if(cData.isReview) {
                    cAjax.data.isReview=cData.isReview;
                }
                cAjax.data=JSON.stringify(cAjax.data);
            break;
            
            //房间id功能
            case 3:
                cAjax.url=api.roomId;
                cAjax.headers={
                    "Content-Type": "application/json",
                    "token": c.getToken()
                }
                cAjax.data=JSON.stringify({
                    "friends": [cData.memberId]
                });
            break;

            //公演详情功能
            case 4: case 5:
                cAjax.url=api.liveInfo;
                cAjax.headers={
                    "Content-Type": "application/json",
                    "version": "5.0.1",
                    "os": "Android"
                };
                cAjax.data=JSON.stringify({
                    "liveId": cData.liveId
                });
            break;

            //房间内容功能
            case 6:
                cAjax.url= api.roomMain;
                cAjax.headers={
                    "Content-Type": "application/json",
                    "token": c.getToken()
                }
                cAjax.data=JSON.stringify({
                    "roomId": cData.roomId,
                    "chatType": 0,
                    "lastTime": cData.lastTime,
                    "limit": cData.limit
                });
            break;

            //房间右墙功能
            case 7:
                cAjax.url= api.roomBoard;
                cAjax.headers={
                    "Content-Type": "application/json",
                    "token": c.getToken()
                }
                cAjax.data=JSON.stringify({
                    "roomId": cData.roomId,
                    "isFirst": false,
                    "lastTime": cData.lastTime,
                    "limit": cData.limit
                });
            break;
        }
        return cAjax;
    };

    //发送request请求后自动处理
    var ajaxRequestJSON= function(request,func){
        var response={};
        request.success=function(data, textStatus, xhr){
            response=JSON.parse(data);
            c.handleRes(response,func,request); //处理请求结果
        };
        request.error=function (xhr, textStatus) {
            mdui.snackbar("错误:"+textStatus);
        }
        console.log('[ajaxRequestJSON] request=',request);
        $$.ajax(request);
        return response;
    };

    //返回接口
    return {
        //获取Cookies
        getCookie: function(name){
            var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
            if(arr=document.cookie.match(reg))
            return unescape(arr[2]);
            else
            return '';
        },
        //设置Cookies
        setCookie: function(c_name,value,expiredays){
            var exdate=new Date();
            exdate.setDate(exdate.getDate()+expiredays);
            document.cookie=c_name+ "=" +escape(value)+((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
        },
        //删除Cookies
        delCookie: function(name){ 
            var exp = new Date(); 
            exp.setTime(exp.getTime() - 1); 
            var cval=this.getCookie(name); 
            if(cval!=null) 
            document.cookie= name + "="+cval+";expires="+exp.toGMTString(); 
        },
        //提交表单
        submit: function(cData){
            response=ajaxRequestJSON(formTrans(cData),cData.func);
        },
        //处理返回的数据
        handleRes: function(response,func,request){
            console.log('handle: response=',response);
            //将一条成员直播数据处理成表格的一行
            var print0= function(row){
                return '<tr><td>'+info.memberId2name(row.memberId)+'</td><td>'+row.subTitle+'</td><td>'+(function(){
                    switch(row.liveType) {
                        case 1: return "视频";
                        case 2: return "电台";
                        default: return row.liveType;
                    }
                })()+'</td><td>'+(function(){
                    return new Date(row.startTime).format('yyyy-MM-dd hh:mm:ss');
                })()+'</td><td>'+(function(){
                    var a="";
                    var b=3; //最多显示3张图片
                    row.picPath.split(",").forEach(function(picUrl){
                        b--;
                        if (b>=0) {a=a+'<img src="'+((picUrl.slice(0,4)=='http')?(''):(url.livePic))+picUrl+'" style="max-width:30px; max-height:30px" />';}
                    })
                    return a;
                })()+'</td><td class="c-link"><a href="'+url.liveShare+row.liveId+'" target="_blank">'+url.liveShare+row.liveId+'</a></td><td class="c-link"><a href="'+row.streamPath+'" target="_blank">'+row.streamPath+'</a></td><td class="c-link"><a href="'+url.livePic+row.lrcPath+'.lrc" target="_blank">'+url.livePic+row.lrcPath+'.lrc</a></td></tr>';
            };

            //将公演预览数据处理成表格的一行
            var print1= function(row){
                return '<tr id="c-live-'+row.liveId+'"><td>'+row.title+'</td><td>'+row.subTitle+'</td><td>'+(function(){
                    return new Date(row.startTime).format('yyyy-MM-dd hh:mm:ss');
                })()+'</td><td><img src="'+url.livePic+row.picPath+'" style="max-width:30px; max-height:30px"></td></tr>';
            };

            //将一条公演数据处理成一行
            var print5= function(row){
                return '<td>'+(function(){
                    if(row.isReview) {
                        return "录播";
                    } else if(row.isOpen) {
                        return "直播中";
                    } else {
                        return "直播";
                    }
                })()+'</td><td class="c-link"><a href="'+row.streamPathHd+'" target="_blank">'+row.streamPathHd+'</a></td><td class="c-link"><a href="'+row.streamPathLd+'" target="_blank">'+row.streamPathLd+'</a></td><td class="c-link"><a href="'+row.streamPath+'</a></td>';
            };

            //打印房间头部信息
            var print2= function(row){
                $$('#c-room-avatar').attr('src',url.livePic+row.roomAvatar);
                $$('#c-room-title').html(row.creatorName);
                $$('#c-room-subtitle').html(row.comment+'@'+new Date(row.commentTimeMs).format('yyyy-MM-dd hh:mm:ss'));
                if(row.bgPath){
                    $$('#c-room-content').css('background','url("'+url.livePic+row.bgPath+'") repeat-y');
                }
            };

            //打印房间内容
            var print3= function(row){
                //console.log('[print3] row=',row);
                var ext=JSON.parse(row.extInfo);
                //console.log('[extInfo] ext=',ext);

                var content='<div class="mdui-card mdui-shadow-0 c-message mdui-typo" timestamp="'+row.msgTime+'" ><div class="mdui-card-primary-subtitle">'+ext.senderName+' @'+row.msgTimeStr+((ext.phoneName)?(' 来自'+ext.phoneName):(' '))+'</div>';

                //文本信息处理
                switch(row.msgType){
                    //文本信息
                    case 0:
                        switch(ext.messageObject){
                            //普通文本
                            case "text":
                                content=content+ext.text;
                            break;

                            //翻牌信息
                            case "faipaiText":
                                content=content+'<blockquote><p>'+ext.faipaiContent+'</p><footer>ID:'+ext.faipaiUserId+'</footer></blockquote>'+ext.messageText;
                            break;

                            //视频直播信息
                            case "live":
                                content=content+'<img style="max-width:30px; max-height:30px" src='+url.livePic+ext.referencecoverImage+' />【视频直播】<a href="'+url.liveShare+ext.referenceObjectId+'" target="_blank">'+url.liveShare+ext.referenceObjectId+'</a>'
                            break;
                            
                            //电台直播信息
                            case "diantai":
                                content=content+'<img style="max-width:30px; max-height:30px" src='+url.livePic+ext.referencecoverImage+' />【电台直播】<a href="'+url.liveShare+ext.referenceObjectId+'" target="_blank">'+url.liveShare+ext.referenceObjectId+'</a>'
                            break;

                            //翻牌问题
                            case "idolFlip":
                                content=content+ext.idolFlipTitle+'<br/>'+ext.idolFlipContent;
                            break;

                        }
                    break;

                    //图片信息
                    case 1:
                        var body=JSON.parse(row.bodys);
                        content=content+'<img src='+body.url+' />';
                    break;

                    //语音信息
                    case 2:
                        var body=JSON.parse(row.bodys);
                        content=content+'<audio src='+body.url+' />';
                    break;
                    
                    //视频信息
                    case 3:
                        var body=JSON.parse(row.bodys);
                        content=content+'<video src='+body.url+' />';
                    break;
                    
                    //其他信息
                    default:
                        content=content+'未知信息:'+JSON.stringify(row);
                    break;
                }
                //分割线
                content=content+'</div><div class="mdui-divider"></div>'
                return content;
            };

            //打印右墙内容
            var print4= function(row){
                var ext=JSON.parse(row.extInfo);
                //console.log('[extInfo board] ext=',ext);
                //内容
                var content='<li class="mdui-list-item mdui-ripple" timestamp="'+row.msgTime+'" senderId="'+row.senderId+'" contentType="'+ext.contetType+'"><div class="mdui-list-item-avatar"><img src="'+url.livePic+ext.senderAvatar+'"/></div><div class="mdui-list-item-content"> <div class="mdui-list-item-title">'+ext.senderName+' <small>@'+row.msgTimeStr+((ext.phoneName)?(' 来自'+ext.phoneName):(' '))+'</small></div><div class="mdui-list-item-text">'+((ext.text)?(ext.text):(ext.content))+'</div></div></li>';
                //分割线
                content=content+'<li class="mdui-divider-inset mdui-m-y-0"></li>';
                return content;
            }

            switch (func) {
                //成员直播数据-直接打印
                case 0:
                    $$('#function-cyzb tbody').html(' ');
                    if(response.content.liveList) {
                            $$('<tr><td  colspan="8"><span style="color:Red">----------   分界线，以下为直播----------</span></td></tr>').appendTo('#function-cyzb tbody');
                            response.content.liveList.forEach(function (row,index,array){
                                content=print0(row);
                                $$(content).appendTo('#function-cyzb tbody')  ;
                            });
                    }
                    if(response.content.reviewList) {
                        $$('<tr><td colspan="8"><span style="color:Red">----------分界线，以下为录播----------</span></td></tr>').appendTo('#function-cyzb tbody');
                        response.content.reviewList.forEach(function (row,index,array){
                            content=print0(row);
                            $$(content).appendTo('#function-cyzb tbody')  ;
                        });
                    }

                break;

                //公演数据预览-转化为单个请求
                case 1: case 2:
                    var isReview=(function(){
                        if (func==1) return true;
                        else return false;
                    })();
                    $$('#function-gy'+(isReview?("lb"):("zb"))+' tbody').html(' ');
                    if(response.content.liveList) {
                        response.content.liveList.forEach(function(row,index,array){
                            var request0=formTrans({"func": (isReview?(4):(5)),"liveId": row.liveId});
                            ajaxRequestJSON(request0,(isReview?(4):(5)));
                            $$(print1(row)).appendTo('#function-gy'+(isReview?("lb"):("zb"))+' tbody');
                        });
                    }
                break;
                
                //房间功能-打印房间基础信息，转化为两个房间id请求
                case 3:
                    //console.log('[room] response=',response);
                    if(response.status==400){
                        mdui.snackbar('错误400: 需要token，请点击【提交】按钮右边的钥匙图标获取token');
                        break;
                    }
                    if(response.status==401){
                        mdui.snackbar('错误401: 授权验证失败，请尝试点击【提交】按钮右边的钥匙图标重新获取token');
                        break;
                    }
                    if(response.content[0].hasOwnProperty("roomId")){
                        cData=c.getCData();
                        ajaxRequestJSON(formTrans({
                            "func": 6,
                            "limit": cData.limit,
                            "lastTime": cData.lastTime,
                            "roomId": response.content[0].roomId
                        }),6);
                        ajaxRequestJSON(formTrans({
                            "func": 7,
                            "limit": cData.limit,
                            "lastTime": cData.lastTime,
                            "roomId": response.content[0].roomId
                        }),7);
                        print2(response.content[0]);
                    }
                break;

                //公演每个数据-打印
                case 4: case 5:
                    //console.log('case 4,5 response=',response);
                    //console.log('case 4,5 request=',request);
                    var content=print5(response.content);
                    $$(content).appendTo('#c-live-'+JSON.parse(request.data).liveId);
                break;
                
                //房间功能2-打印房间内容和右墙
                case 6:
                    $$('#c-room-content').html(' ');
                    for (var key in response.content.data) {
                        var content=print3(response.content.data[key]);
                        //插入内容
                        $$(content).appendTo('#c-room-content');
                    }
                break;
                case 7:
                    $$('#c-room-board').html(' ');
                    //console.log('[board] response=',response);
                    for (var key in response.content.data){
                        var content=print4(response.content.data[key]);
                        $$(content).appendTo('#c-room-board');
                    }
                break;

                //登录功能
                case "login":
                    if (response.status==200) {
                        //登录成功 返回token
                        this.setToken(response.content.token);
                        $$('#c-login-user').val('');
                        $$('#c-login-pass').val('');
                    } else {
                        mdui.snackbar("获取token失败,"+JSON.stringify(response));
                    }
                break;
            }
        },

        //返回数据
        getInfo: function(){
            return info;
        },
        //打印团体/成员数据
        printInfo: function(){
            $$('#c-cgroup').html(' ');
            $$('#c-memberchoose').html(' ');
            for (var index in info.group){
                $$('<a id="c-cgroup-'+index+'" value="'+index+'" href="#group-'+index+'" class="mdui-ripple mdui-tab-active">'+info.group[index]+'</a>').appendTo('#c-cgroup');
                $$('<div id="group-'+index+'"></div>').appendTo('#c-memberchoose');
            };
            var inst = new mdui.Tab('#c-cgroup');
            for (var index in info.team){
                //content头部
                var content='<div class="mdui-row">【'+info.team[index][1]+'】';
                for (var index0 in info.member){
                    //当成员信息status==1,且teamId满足筛选时
                    if((info.member[index0][4]==1)&&(info.member[index0][2]==index)){
                        content=content+'<label class="mdui-radio"><input type="radio" name="member" value="'+index0+'"><i class="mdui-radio-icon"></i>'+info.member[index0][0]+'</label>';
                    }
                };
                content=content+'</div>';
                $$(content).appendTo('#group-'+info.team[index][0]);//加入到对应的group div中
            };

        },

        //登录，获取token
        login: function(user,pass){
            var cAjax={};
            cAjax.url=api.login;
            cAjax.method="POST";
            cAjax.headers={
                "Content-Type": "application/json",
                "version": "5.0.1",
                "os": "Android",
                "imei": "355637053964243",
            };
            cAjax.data=JSON.stringify({
                "password": pass,
                "account": user,
                "longitude":0,
                "latitude":0
            });
            ajaxRequestJSON(cAjax,"login");

        },

        //登出，删除cookie 'token'
        logout: function(){
            this.delCookie('token');
        },

        //获取储存的token
        getToken: function(){
            return this.getCookie('token');
        },

        //刷新显示的token
        flushToken: function(){
            $$('#c-token').html((this.getToken())?('token已获取'):('无token'));
        },

        setToken: function(token){
            this.setCookie('token',token,30);
            this.flushToken();
        },

        //获取当前表单信息
        getCData : function(){
            var cData={};
            //使用的功能
            cData.func=cPage.getCFunc();
    
            //直播or录播
            if (cData.func==1) {
                cData.isReview = 1;
            } else if (cData.func==2) {
                cData.isReview = 0;
            }
    
            //截止时间
            if ($$('#c-ctime-now').prop('checked')) {
                cData.lastTime=0;
            } else {
                stringTime=$$('#c-year').val()+'-'+$$('#c-month').val()+'-'+$$('#c-day').val()+' '+$$('#c-hour').val()+':0:0';
                cData.lastTime=Date.parse(new Date(stringTime));
            }
    
            //数量限制
            cData.limit=parseInt($$('#c-cnumber').val());
            
            //成员/团体Id
            if (cPage.getCMember()) {
                cData.groupId=cPage.getCGroup();
                cData.memberId=$$("input[name='member']:checked").val();
            } else {
                cData.groupId=0;
                cData.memberId=0;
            }
            return cData;
        },
        //测试函数
        test: function(c1){
            return eval(c1);
        }
    }
})();
c.printInfo();
c.flushToken();
//页面功能
var cPage = (function(){
    //切换功能
    var cFunc = 0;
    document.getElementById('c-cfunc').addEventListener ('change.mdui.tab', function (event) {
        cFunc = event.detail.index;
        if (cFunc==3){
            $$('#login').show();
        } else {
            $$('#login').hide();
        }
    });

    //切换选择成员/团体
    var cMember = 0;
    document.getElementById('c-cmember').addEventListener   ('change', function (event) {
        if (this.checked) {
            cMember=1;
            $$('#c-member').show();
        } else {
            cMember=0;
            $$('#c-member').hide();
        }
    });

    //切换显示完整链接
    var cLink = 0;
    document.getElementById('c-clink').addEventListener('change',   function (event) {
        if (this.checked) {
            cLink=1;
            $$("#c-link-switch").attr('href',   './css/link-show.css');
        } else {
            cLink=0;
            $$("#c-link-switch").attr('href',   './css/link-hide.css');
        }
    });

    //切换团体
    var cGroup = 0;
    document.getElementById('c-cgroup').addEventListener    ('change.mdui.tab', function (event) {
        cGroup = $$('#c-c'+event.detail.id).attr('value');
    });

    //提交表单
    var cData={};
    $$('#submit').on('click', function(e){
        //使用的功能
        cData=c.getCData();
        if (cData.memberId==0&&cData.func==3){
            mdui.snackbar('口袋房间功能必须选择成员!');
            return;
        }
        //console.log('cData=',cData);
        c.submit(cData);
    });

    //获取token
    $$('#c-login-get').on('click', function(e){
        c.login($$('#c-login-user').val(),$$('#c-login-pass').val());
    });
    //删除token
    $$('#c-login-del').on('click', function(e){
        c.logout();
        c.flushToken();
    });
    //设置token
    $$('#c-login-set').on('click', function(e){
        c.setToken($$('#c-token').val());
    });


    return {
        getCFunc: function(){return cFunc;},
        getCMember: function(){return cMember;},
        getCGroup: function(){return cGroup;},
    }
})();


//日期转换
Date.prototype.format = function(format) {
    var date = {
           "M+": this.getMonth() + 1,
           "d+": this.getDate(),
           "h+": this.getHours(),
           "m+": this.getMinutes(),
           "s+": this.getSeconds(),
           "q+": Math.floor((this.getMonth() + 3) / 3),
           "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
           format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
           if (new RegExp("(" + k + ")").test(format)) {
                  format = format.replace(RegExp.$1, RegExp.$1.length == 1
                         ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
           }
    }
    return format;
}
console.log('页面功能加载完毕');
console.log("%c请勿分享Cookies给其他人"," text-shadow: 0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);font-size:5em");