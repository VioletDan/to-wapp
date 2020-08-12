$(document).ready(function () {


  //-----------------------------------------定义和初始化变量----------------------------------------
  var loadBox = $('aside.loadBox');
  var articleBox = $('article');
  var windowScale = window.innerWidth / 750;




  //----------------------------------------有微信授权放这里  授权完在 icom.init(init)----------------------------------------





  icom.init(init);//初始化
  icom.screenScrollUnable();//如果是一屏高度项目且在ios下，阻止屏幕默认滑动行为

  function init () {
    requestAnimationFrame(function () {
      var screenProp = window.innerWidth / window.innerHeight
      console.log("os.screenProp:" + os.screenProp);
      if (screenProp < 0.54) articleBox.addClass("screen189");
      if (screenProp > 0.64) articleBox.addClass("screen159");
      load_handler();

    });
  }//edn func


  //----------------------------------------加载页面图片----------------------------------------
  function load_handler () {
    var loader = new PxLoader();
    loader.addImage('images/common/turn_phone.png');
    loader.addImage('images/coupon/btnPersonal.png');
    loader.addImage('images/coupon/btnReceive.png');
    loader.addImage('images/coupon/btnReceive2.png');
    loader.addImage('images/coupon/cbottom.png');
    loader.addImage('images/coupon/code.png');
    loader.addImage('images/coupon/line.png');
    loader.addImage('images/coupon/logo.png');
    loader.addImage('images/coupon/tips.png');
    loader.addImage('images/coupon/title.png');
    loader.addImage('images/coupon/img4.png');
    //实际加载进度
    //		loader.addProgressListener(function(e) {
    //			var per=Math.round(e.completedCount/e.totalCount*50);
    //			loadPer.html(per+'%');
    //		});

    loader.addCompletionListener(function () {
      loadBox.hide();
      icom.fadeIn(articleBox);
      pageInit();
      //			load_timer(50);//模拟加载进度
      loader = null;
    });
    loader.start();
  }//end func

  //模拟加载进度
  function load_timer (per) {
    per = per || 0;
    per += imath.randomRange(1, 3);
    per = per > 100 ? 100 : per;
    loadPer.html(per + '%');
    if (per == 100) setTimeout(pageInit, 200);
    else setTimeout(load_timer, 33, per);
  }//edn func

  //----------------------------------------页面逻辑代码----------------------------------------



	/**
	 * 页面初始化
	 */
  function pageInit () {
    imonitor.add({category: '虚拟页面', label: '试饮券领取页面'}); // 监测
    if (os.ios) IOSinput();
    monitor_handler();
    eventInit();
    // icom.countdown($('.btnCode'), 60, '#s');
  }//end func

  
  function eventInit () {
    $('#cbtn').off().on('click', cbtnClick);
    // ---留资页面
    $('#btnSubmit').off().on('click', btnSubmitClick);

    $('#date').html(dateFtt("yyyy-MM-dd",new Date()));
  }

  function cbtnClick(){
    $('.couponInfoBox').fadeIn();
    imonitor.add({ category: 'button', label: '领取' }); // 监测
    imonitor.add({category: '虚拟页面', label: '填写资料页面'}); // 监测
  }

  // ---提交表单按钮
  function btnSubmitClick (e) {
    e.preventDefault();
    var name = $('input[name="name"]').val();// name
    var phone = $('input[name="phone"]').val(); // name
    var isPhone = icom.checkStr(phone, 0);
    var content = '';
    if (name == '') {
      content = '请输入姓名';
    }else if (phone == '') {
      content = '请输入手机号';
    } else if (!isPhone) {
      content = '手机号码格式不正确';
    }

    if (content != '') {
      icom.alert(content);
    }else {
      loadBox.show()
      API.save_h5({
        username: name,
        mobile: phone,
      }, (res) => {
        loadBox.hide()
        if(res.error == -1) {
          icom.alert(res.msg);
        }else if(res.error == -2){
          icom.alert('您已领取过试饮券不可重复申领');
        }else {
           // 显示留资成功页面
           UserSubmitSuccess(res);
        }
        imonitor.add({ category: 'button', label: '立即领取' }); // 监测
      })
    }
  }

  function UserSubmitSuccess(res){
    $('#codeImg').attr('src',res.data);
    $('#date').show();
    $('.userInfoBox').fadeIn();
    imonitor.add({category: '虚拟页面', label: '到店试饮二维码页面'}); // 监测
  }






  // ------------------------工具类
  /**
   * 苹果输入框
   */
  function IOSinput () {
    var itimer
    document.body.addEventListener('focusin', function () {
      clearTimeout(itimer)
    })
    document.body.addEventListener('focusout', function () {
      itimer = setTimeout(function () {
        var scrollHeight =
        document.documentElement.scrollTop || document.body.scrollTop || 0
        window.scrollTo(0, Math.max(scrollHeight - 1, 0))
      }, 100)
    })
  }

  /**************************************时间格式化处理************************************/
  function dateFtt(fmt,date) { //author: meizz 
    var o = { 
      "M+" : date.getMonth()+1,     //月份 
      "d+" : date.getDate(),     //日 
      "h+" : date.getHours(),     //小时 
      "m+" : date.getMinutes(),     //分 
      "s+" : date.getSeconds(),     //秒 
      "q+" : Math.floor((date.getMonth()+3)/3), //季度 
      "S" : date.getMilliseconds()    //毫秒 
    }; 
    if(/(y+)/.test(fmt)) 
    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    for(var k in o) 
    if(new RegExp("("+ k +")").test(fmt)) 
    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
    return fmt; 
  } 
  //----------------------------------------页面监测代码----------------------------------------
  function monitor_handler () {
    //		imonitor.add({obj:$('a.btnTest'),action:'touchstart',category:'default',label:'测试按钮'});
  }//end func
});//end ready
