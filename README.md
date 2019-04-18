# pocket48-grab v2.6

口袋48视频、房间、信息获取工具。

# 测试地址

稳定版 https://xsaiting.com/pocket48/

开发版 http://xsaiting.cn/pocket48/

# 功能

1. 成员直播/回放
2. 成员直播在线观看+发送弹幕
3. 公演直播/回放
4. 口袋房间内容/留言
5. 成员信息/昵称/缩写查询
6. 口袋用户信息查询
7. 口袋屏蔽词查询
8. 口袋登录
9. 弹幕转字幕

* 开始
	* 成员直播/回放 #live
	* 公演直播/回放 #openlive
	* 口袋房间 #room
* 查询
	* 成员 #member
		* 输入成员缩写/名字 查询成员，显示基本信息、近期直播、(口袋动态)、口袋房间
	* 用户 #user
		* 输入用户id 查询用户基本信息
	* 屏蔽词 #banlist
  * 弹幕转字幕 #barrage
    * 载入lrc文件，转换成ass文件
* 配置
	* 选项 #setting
		* 开启配色
		* 表格收缩
	* 账户 #account
		* 登录获取token
		* 直接输入token
		* 删除token

# 说明

1、使用遇到任何问题/有任何建议请联系xsaiting@qq.com

2、成员直播可以使用本站播放器播放(电台和部分视频播放不了，解决中...)，支持弹幕互动。**请勿滥用！** 成员录播+弹幕播放方法参考：[点此](https://github.com/xsaiting/pocket48-grab/wiki/%E5%A6%82%E4%BD%95%E6%92%AD%E6%94%BE%E5%BD%95%E6%92%AD%E8%A7%86%E9%A2%91-%E5%BC%B9%E5%B9%95%EF%BC%9F)。弹幕lrc文件可以转ass视频字幕，在左侧功能区。

3、在线播放说明：任何格式均可使用VLC media player【[下载](http://www.videolan.org/)】或KMPlayer【[下载](http://kmplayer.com/)】在线播放，移动端可以使用MXPlayer的网络串流功能播放。

4、下载说明：mp4格式或flv格式可以直接用下载工具(迅雷、idm、浏览器)下载/录制，公演回放和小部分成员直播为m3u8格式，下载/录制m3u8视频的方法参考：[点此](https://github.com/xsaiting/pocket48-grab/wiki/%E5%A6%82%E4%BD%95%E7%94%A8VLC%E6%89%93%E5%BC%80m3u8%E6%96%87%E4%BB%B6%E5%B9%B6%E4%B8%8B%E8%BD%BD%EF%BC%88%E5%BD%95%E5%88%B6%EF%BC%89%3F)

5、口袋房间功能需要token，可通过账号密码获取，本程序保证不会储存您的账号、密码及token，但也不保证您的账户安全问题，建议使用小号。

6、口袋48接口信息请参看[wiki](https://github.com/xsaiting/pocket48-grab/wiki)或c.pocket48.js源代码。

# 项目使用与开发

如果你需要将此项目应用于你自己的服务器，请参考：~~在自己的服务器上使用本程序~~(还没写)

## 本地开发

```
git clone #项目地址#

# 安装依赖
npm install

# 运行开发环境
npm run dev
```

## 本地构建

```
npm install
npm run build
```

dist/ 上传到服务器即可
