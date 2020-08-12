import regeneratorRuntime from '../plugs/regeneratorRuntime';
import promisify from '../plugs/promisify.js';
class Inits {
    constructor(obj) {
        this.API = obj.API;
    }
    async getUserInfo(detail) {
        console.log(getApp())
        // let userData = await this.API.GetUserInfo({
        //     Data: detail.encryptedData,
        //     iv: detail.iv,
        //     SessionKey: getApp().data.SessionKey,
        //     key: getApp().data.SessionKey,
        // })
        console.log('detail============',detail);
        let userData = await this.API.save_nickname_head({
            nickname: detail.userInfo.nickName,
            avatarUrl: detail.userInfo.avatarUrl,
        })
        return userData;
    }

    async getPhoneNumber(detail) {
        //获取小程序用户信息
        let pages = getCurrentPages();
        let page = pages[pages.length - 1];
        let phoneData = await this.API.GetUserPhone({
            encryptedData: detail.encryptedData,
            iv: detail.iv,
        })
        return phoneData;
    }
}
/**
 * Init
 */
class Init {
    constructor(obj) {
        this.member = new Inits(obj);
    }
}
module.exports = Init;