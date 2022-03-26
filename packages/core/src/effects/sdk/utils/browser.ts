//浏览器侦查
type Ibrowser = {
  mobile: boolean
  ios: boolean
  android: boolean
  iphone: boolean
  ipad: boolean
  designer: boolean
}
const ua = navigator.userAgent
const browser = {
  mobile: !!ua.match(/AppleWebKit.*Mobile.*/), //移动终端
  ios: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
  android: /Android/.test(ua) || /Linux/.test(ua), //android终端或uc浏览器
  iphone: /iPhone/i.test(ua), //iPhone或者QQHD浏览器
  ipad: /iPad/i.test(ua), //iPad
  designer: false, // 是否为设计器页面
}
export default browser
