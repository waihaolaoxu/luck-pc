/*
 @ Name：luck弹层组件-PC版
 @ Author：前端老徐
 @ Date：2015/5/20
 @ E-mail：442413729@qq.com
 @ Weibo:http://weibo.com/qdlaoxu
 @ GitHub:https://github.com/waihaolaoxu
 @ Address:http://www.loveqiao.com/
*/
!function(a) {
    "use strict";
    var skin = {
        url:"skin/",
        //皮肤路径
        name:"default/"
    }, c = document, count = 0, delay = null;
    //定义主类
    function Class(opt) {
        this.config = opt;
    }
    Class.pt = Class.prototype;
    Class.pt.windowSize = true;
    Class.pt.createElement = function(tag, cla, id) {
        var obj = c.createElement(tag);
        id ? obj.id = id :"";
        cla ? obj.className = cla :"";
        return obj;
    };
    Class.pt.view = function() {
        var opt = this.config, luck_layer, luck_shade, luck_box, luck_title, luck_close, luck_con, luck_btn, luck_resize;
        //主框架
        luck_layer = this.createElement("div", "luck-layer");
        luck_shade = this.createElement("div", "luck-shade");
        if (opt.shadeClose) {
            luck_shade.onclick = function() {
                luck.close(luck_layer);
            };
        }
        luck_box = this.createElement("div", "luck-box", "luck-box-" + count);
        if (opt.width) {
            luck_box.style.width = opt.width;
        }
        if (opt.height) {
            luck_box.style.height = opt.height;
        }
        if (opt.addclass) {
            $(luck_box).addClass(opt.addclass);
        }
        //标题
        if (opt.title) {
            luck_title = this.createElement("div", "luck-title luck-move");
            luck_title.innerHTML = "<span>" + opt.title + "</span>";
            if (opt.move == false) {
                luck_title.setAttribute("move", "false");
                $(luck_title).addClass("noMove");
            }
            luck_box.appendChild(luck_title);
        }
        //关闭按钮
        if (opt.cloBtn != false) {
            luck_close = this.createElement("div", "luck-close luck-ico");
            luck_close.onclick = function() {
                a.luck.close(luck_layer);
            };
            luck_box.appendChild(luck_close);
        }
        //最大化切换
        if (opt.resize) {
            var _this = this;
            luck_resize = this.createElement("div", "luck-resize luck-ico");
            luck_resize.onclick = function() {
                _this.resize.call(_this, luck_layer);
            };
            luck_box.appendChild(luck_resize);
        }
        //内容
        luck_con = this.createElement("div", "luck-con");
        luck_box.appendChild(luck_con);
        if (opt.content) {
            luck_con.innerHTML = opt.content;
        } else {
            luck_con.innerHTML = '<div style="line-height:40px; padding-left:20px;"><a href="http://luck.loveqiao.com/">Luck弹层组件</a></div>';
        }
        //按钮
        luck_btn = this.createElement("div", "luck-btn");
        if (typeof opt.yes == "function") {
            var luck_yes = this.createElement("button", "luck-yes");
            if (opt.btn && opt.btn[0]) {
                luck_yes.innerHTML = opt.btn[0];
            } else {
                luck_yes.innerHTML = "确定";
            }
            luck_yes.onclick = function() {
                opt.yes(luck_layer);
                luck.close(luck_layer);
            };
            luck_btn.appendChild(luck_yes);
        }
        if (typeof opt.no == "function") {
            var luck_no = this.createElement("button", "luck-no");
            if (opt.btn && opt.btn[1]) {
                luck_no.innerHTML = opt.btn[1];
            } else {
                luck_no.innerHTML = "取消";
            }
            luck_no.onclick = function() {
                opt.no(luck_layer);
                a.luck.close(luck_layer);
            };
            luck_btn.appendChild(luck_no);
        }
        if (typeof opt.yes == "function" || typeof opt.no == "function") {
            luck_box.appendChild(luck_btn);
        }
        //组合
        luck_layer.appendChild(luck_shade);
        luck_layer.appendChild(luck_box);
        return luck_layer;
    };
    Class.pt.R = function(id) {
        return document.getElementById(id);
    };
    //定位坐标
    Class.pt.offset = function(n) {
        var w1 = $(window).width(), h1 = $(window).height(), obj = this.R("luck-box-" + n), w2 = obj.offsetWidth, h2 = obj.offsetHeight;
        obj.style.left = w1 / 2 - w2 / 2 + "px";
        obj.style.top = h1 / 2 - h2 / 2 + "px";
        $(obj).addClass("show");
    };
    //拖拽层
    Class.pt.move = function(n) {
        var layer = $("#luck-box-" + n);
        var moveobj = layer.find(".luck-move");
        if (moveobj.attr("move") != "false") {
            var _move = false;
            //移动标记
            var _x, _y;
            //鼠标离控件左上角的相对位置
            moveobj.mousedown(function(e) {
                _move = true;
                _x = e.pageX - parseInt(layer.css("left"));
                _y = e.pageY - parseInt(layer.css("top"));
                layer.addClass("move");
            });
            $(document).mousemove(function(e) {
                if (_move) {
                    var x = e.pageX - _x, //移动时根据鼠标位置计算控件左上角的绝对位置
                    y = e.pageY - _y, setRig = $(window).width() - layer.outerWidth(), setTop = $(window).height() - layer.outerHeight();
                    //控制层不被拖到窗体外
                    x < 0 && (x = 0);
                    y < 0 && (y = 0);
                    x > setRig && (x = setRig);
                    y > setTop && (y = setTop);
                    //console.log(layer.outerHeight())
                    layer.css({
                        top:y,
                        left:x
                    });
                }
            }).mouseup(function() {
                _move = false;
                layer.removeClass("move");
            });
        }
    };
    Class.pt.resize = function(o) {
        var obj = $(o), flag = typeof this.config.resize == "function";
        if (this.windowSize) {
            $("html,body").addClass("hideScroll");
            obj.addClass("luck-full");
            this.windowSize = false;
            if (flag) {
                this.config.resize(obj, "big");
            }
        } else {
            $("html,body").removeClass("hideScroll");
            obj.removeClass("luck-full");
            this.windowSize = true;
            if (flag) {
                this.config.resize(obj, "small");
            }
        }
    };
    a.luck = {
        open:function(opt) {
            var luckCla = new Class(opt);
            var o = luckCla.view();
            c.body.appendChild(o);
            luckCla.offset(count);
            //居中定位
            luckCla.move(count);
            //绑定拖动事件
            if (opt.time) {
                //定时关闭
                setTimeout(function() {
                    a.luck.close(o);
                }, opt.time);
            }
            count++;
            return o;
        },
        alert:function(opt) {
            a.luck.open({
                width:opt.width?opt.width:'',
                content:'<div class="luck-move luck-dialog luck-ico-' + (opt.ico ? opt.ico :0) + '"><i class="luck-ico"></i>' + opt.con + "</div></div>",
                cloBtn:false,
                yes:function(obj) {
					if(opt.callback){
						opt.callback();	
					}	
				}
            });
        },
        confirm:function(opt) {
            a.luck.open({
                cloBtn:false,
                content:'<span class="luck-move luck-dialog luck-ico-3"><i class="luck-ico"></i>' + opt.con + "</span>",
                btn:opt.btn?opt.btn:'',
                yes:function(obj) {
                    if (typeof opt.callback == "function") {
                        opt.callback(true);
                    }
                },
                no:function(obj) {
                    if (typeof opt.callback == "function") {
                        opt.callback(false);
                    }
                }
            });
        },
        prompt:function(tit, con, calback) {
            a.luck.open({
                title:tit,
                content:'<textarea class="luck-prompt" placeholder="' + con + '"></textarea>',
                //cloBtn:false,
                yes:function(obj) {
                    if (typeof calback == "function") {
                        calback($(obj).find("textarea").val());
                    }
                },
                no:function(obj) {
                    if (typeof calback == "function") {
                        calback(false);
                    }
                }
            });
        },
        iframe:function(tit, url, w, h) {
            a.luck.open({
                title:tit,
                content:'<iframe width="' + w + '" height="' + h + '" style="display:block" src="' + url + '" frameborder="0"></iframe>'
            });
        },
        close:function(o) {
            try {
                if (o) {
                    c.body.removeChild(o);
                } else {
                    $(".luck-layer").remove();
                }
            } catch (e) {}
        }
    };
	//追加样式
    var style = "";
    function getStyle() {
        var obj = null, len = document.scripts.length, str = "";
        for (var i = 0; i < len; i++) {
            obj = document.scripts[i];
            if (obj.src.indexOf("luck.js") >= 0) {
                str = obj.src;
                break;
            }
        }
        return str.split("luck.js")[0] +skin.url+skin.name+'luck.css';
    }
    document.head.appendChild(function() {
        var a = c.createElement("link");
        a.href = style ? style :getStyle(), a.type = "text/css", a.rel = "styleSheet", a.id = "luckcss";
        return a;
    }());
}(window);