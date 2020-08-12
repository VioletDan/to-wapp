var loadBox = $('.loadBox');
var API = {
    DOMAIN: "https://h5.dayanweb.cn/madielie20200630/api/data.php",               //正式
    DEBUG: true,

    _send: function(method, data, success){
        //有自己的openid并且data里面不带openid才赋值
        // if (API.OpenID && !data.hasOwnProperty('OpenID'))data.OpenID = API.OpenID;
        var data = Object.assign(data,{
          action: method
        })
        $.ajax({
            url: API.DOMAIN,
            type:"post",
            data: data,
            dataType: 'JSON',
            //async: true,
            success: function (res) {
              if (API.DEBUG) {
                console.log(method + "——success");
                console.log(res);
              }
      
              if (res && res.error != 0) {
                if (success) success(res);
              }else {
                if (success) success(res);
              }
            },
            error: function (res) {
              if (API.DEBUG) {
                console.log(method + "——fail");
                console.log(res);
              }
              loadBox.hide()
              if (success) success(null);
              icom.alert(res.errmsg);
            }
        });

    },


    /**
     * 独家活动-申领页面留资
     * @params Function success 回调函数 如果回调为null说明服务器报错了或者errcod非0
     */
    save_h5: function (data, success) {
      API._send('save_h5', data, success)
    },

   

}
