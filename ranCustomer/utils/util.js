const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('/');
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


function add0(m) {
  return m < 10 ? '0' + m : m
}

function format(shijianchuo) {
  //shijianchuo是整数，否则要parseInt转换
  if(typeof shijianchuo == 'string'){
    shijianchuo = parseInt(shijianchuo);
  }
  let time = new Date(shijianchuo * 1);
  let y = time.getFullYear();
  let m = time.getMonth() + 1;
  let d = time.getDate();
  let h = time.getHours();
  let mm = time.getMinutes();
  let s = time.getSeconds();
  return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm);
}

//防止重复点击
function buttonClicked(self) {
  self.setData({
    buttonClicked: true
  })
  setTimeout(function () {
    self.setData({
      buttonClicked: false
    })
  }, 500);
}

//数字转千分位
function formatNum(num) {
  num += '';
  if (!num.includes('.')) num += '.';
  return num.replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
    return $1 + ',';
  }).replace(/\.$/, '');
}


module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  buttonClicked: buttonClicked,
  formatNum: formatNum,
  url: 'https://wxapi.xinglinjiuye.cn/'
}
