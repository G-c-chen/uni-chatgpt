
/**
 * 提示与加载工具类
 */
export default class Tips {
  /**
   * 弹出成功提示框
   */

  static success(title, duration = 1000) {
    uni.showToast({
      title: title,
      icon: 'success',
      mask: true,
      duration: duration,
    });
  }

  /**
   * 警告框
   */
  static warning(title, duration = 3000, mask = true) {
    uni.showToast({
      title: title,
      icon: 'none',
      mask,
      duration: duration,
    });
  }

  /**
   * 等待警告框(请在页面onUnload方法里设置this.isOnUnload为true)
   */
  static waitWarning(title, duration = 1000, mask = true) {
    uni.showToast({
      title: title,
      icon: 'none',
      mask,
      duration: duration,
    });
    let that = wepy.$instance.getPage();
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!that.isOnUnload) {
          resolve();
        }
      }, duration - 10);
    });
  }

  /**
   * 弹出加载提示
   */
  static showLoading(title = '加载中') {
    uni.showLoading({
      title: title,
      mask: true,
    });
  }

  /**
   * 加载完毕
   */
  static hideLoading() {
    uni.hideLoading();
  }
}
