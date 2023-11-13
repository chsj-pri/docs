### mockjs 作用

**通过使用 JSON5 作为模版 template 产生随机模拟数据 data**

### 安装和开始使用

`npm install mockjs -g`

```json
var Mock = require('mockjs')
var template = {
	'list|1-10': [{ //list数组，含有1到10个元素
			'id|+1': 1 //属性id为自增数，起始值为1，每次增1
	}]
}
var data = Mock.mock(template)
console.log(JSON.stringify(data, null, 4))
```

```json
// 输出结果
{
  "list": [
    {
      "id": 1
    },
    {
      "id": 2
    }
  ]
}
```

### Mock.mock

_根据数据模板生成模拟数据_
`Mock.mock( rurl?, rtype?, template|function(options))`

```
rurl	表示需要拦截的 URL
rtype	表示需要拦截的请求类型，如 GET、POST、PUT、DELETE等
template	数据模板，对象或字符串，如 {'data|1-10':[{}] }、'@EMAIL'
function(options)	options本次请求的选项集，含有url、type和body三个属性
```

### Mock.setup

_配置 Mock 库，支持配置项 timeout，指定响应时间，单位是毫秒_
`Mock.setup( settings )`

```js
Mock.setup({
  timeout: 400,
});
Mock.setup({
  timeout: "200-600",
});
```

### Mock.valid

_校验真实数据 data 与模板 template 是否匹配_

Mock.valid(template, data)`

### Mock.toJSONSchema

_把 Mock.js 风格的模板 template 转换成 JSON Schema_

`Mock.toJSONSchema(template)`

### Mock.Random

_生成各种随机数据_

##### 一. 数据模板定义规范 DTD

```
格式为：
'name | rule' :  value
 属性名   规则   属性值
```

**注意：**

1. _生成规则_（可选）
2. *生成规则*的含义依赖属性值的类型
3. *生成规则*的含义需要依赖属性值的类型
4. *属性值*决定最终值和类型
5. *生成规则*有 7 种格式：

```
'name|min-max': value               指定最大最小
'name|count': value                 重复次数
'name|min-max.dmin-dmax': value     小数部分指定最大最小
'name|min-max.dcount': value
'name|count.dmin-dmax': value
'name|count.dcount': value
'name|+step': value                 递增
```

**生成规则示例:**

```
1. 属性值是字符串
'name|min-max': string      生成字符串，重复次数大于等于min，小于等于max
'name|count': string        生成字符串，重复次数等于count

2. 属性值是数字
'name|+1': number                       属性值自动加1，初始值为number
'name|min-max': number                  生成整数，min>=整数值<=max，number只是用来确定类型
'name|min-max.dmin-dmax': number       生成浮点数，小数部分保留dmin到dmax位

3. 属性值是布尔型
'name|1': boolean           生成布尔值，值为true的概率是1/2，值为false的概率同样是1/2
'name|min-max': value       生成布尔值，值为value的概率是min/(min+max)，值为!value的概率是max/(min+max)

4. 属性值是对象
'name|count': object        从object中随机选取count个属性
'name|min-max': object      从object中随机选取min到max个属性

5. 属性值是数组
'name|1': array             从array中随机选取1个元素作为最终值
'name|+1': array            从array中顺序选取1个元素作为最终值
'name|count': array         重复array生成新数组，重复次数 == count
'name|min-max': array       通过重复array生成新数组，min=>重复次数<=max。

6. 属性值是函数
'name': function        执行函数，返回值作为最终属性值，函数的上下文为属性'name'所在的对象

7. 属性值是正则表达式
'name': regexp          根据正则表达式regexp反向生成可以匹配它的字符串，用于生成自定义格式的字符串
```

##### 二. 数据占位符定义规范 DPD

```
格式为：
	@占位符
	@占位符(参数 [, 参数])
```

**注意：**

1. @前缀后的字符串是*占位符*
2. *占位符*引用的是 Mock.Random 中的方法
3. *占位符*可以引用数据模板中的属性(优先)
4. *占位符*支持相对路径和绝对路径

```js
var Random = Mock.Random;
Random.email(); //输出: n.clark@miller.io
Mock.mock("@email"); //使用占位符方式(字符串)，输出: y.lee@lewis.org
Mock.mock({ email: "@email" }); //使用占位符方式(对象)，输出: v.lewis@hall.gov
```

```js
Mock.mock({
    name: {
        first: '@FIRST',
        middle: '@FIRST',
        last: '@LAST',
        full: '@first @middle @last'
    }
})
输出:
{
    "name": {
        "first": "Charles",
        "middle": "Brenda",
        "last": "Lopez",
        "full": "Charles Brenda Lopez"
    }
}
```

##### 三. Mock.Random 函数汇总

###### 1. 基本数据类型函数

- Random.boolean( min?, max?, current? )
  _返回随机布尔值
  min 参数 current 出现概率为 min / (min + max)，默认 1
  max 参数 current 相反值 !current 出现概率为 max / (min + max)，默认 1
  current 布尔值 true 或 false_

```
Random.bool(1, 9, false) //输出: true
```

- Random.natural( min?, max? )
  _返回随机自然数
  min 随机自然数的最小值，默认 0
  max 随机自然数的最大值，默认 9007199254740992_

```
Random.natural(60, 100) //输出:  77
```

- Random.integer( min?, max? )
  _返回随机整数
  min 随机整数最小值，默认-9007199254740992
  max 随机整数最大值，默认 9007199254740992_

```
Random.integer(60, 100) //输出: 96
```

- Random.float( min?, max?, dmin?, dmax? )
  _返回随机浮点数
  min 整数部分的最小值，默认-9007199254740992
  max 整数部分最大值，默认 9007199254740992
  dmin 小数部分位数最小值，默认 0
  dmax 小数部分位数最大值，默认 17_

```
Random.float(60, 100, 3, 5) //输出: 70.6849
```

- Random.character( pool? )
- Random.character( 'lower/upper/number/symbol' )
  _返回一个随机字符，默认 lower + upper + number + symbol
  pool 字符串，表示字符池，将从中选择一个字符返回
  lower|upper|number|symbol 表示内置字符池：
  lower: abcdefghijklmnopqrstuvwxyz
  upper: ABCDEFGHIJKLMNOPQRSTUVWXYZ
  number: 0123456789
  symbol: !@#$%^&_()[]\*

```
Random.character('upper') //输出: "X"
Random.character('aeiou') //输出: "u"
```

- Random.string( pool?, min?, max? )
  _返回随机字符串
  pool 字符串，表示字符池，默认 lower + upper + number + symbol
  min 随机字符串最小长度，默认 3
  max 随机字符串最大长度，默认 7_

```
Random.string('壹贰叁肆伍陆柒捌玖拾', 3, 5) //输出: "肆捌伍叁"
```

- Random.range( start?, stop, step? )
  _返回整型数组
  start 数组的整数起始值
  stop 数组的整数结束值（不包含在返回值中）
  step 步长，默认 1_

```
Random.range(1, 10, 2) //输出: [1, 3, 5, 7, 9]
```

###### 2. 日期时间函数

- Random.date( format? )
  _返回随机日期字符串
  format 日期字符串格式，默认 yyyy-MM-dd_

```
Random.date('yyyy-MM-dd') //输出: "1983-01-29"
```

- Random.time( format? )
  _返回随机的时间字符串
  format 时间字符串的格式，默认 HH:mm:ss_

```
Random.time('HH:mm:ss') //输出: "03:57:53"
```

- Random.datetime( format? )
  _返回随机日期和时间字符串
  format 日期和时间字符串格式，默认 yyyy-MM-dd HH:mm:ss_

```
Random.datetime('y-MM-dd HH:mm:ss') //输出: "79-06-24 04:45:16"
```

- Random.now( unit?, format? )
  _返回当前日期和时间字符串
  unit 时间单位，可选值 year、month、week、day、hour、minute、second、week，默认空
  format 日期和时间字符串格式，默认 yyyy-MM-dd HH:mm:ss_

```
Random.now() //输出: "2014-04-29 20:08:38 "
Random.now('second') //输出: "2014-04-29 20:08:38"
```

###### 3. 图像函数

- Random.image( size?, background?, foreground?, format?, text? )
  _生成随机图片地址
  size 图片宽高，格式为 '宽 x 高'，默认 300x250、250x250 ... 随机
  background 图片背景色，默认#000000
  foreground 图片前景色（文字），默认#FFFFFF
  format 图片格式，默认'png，可选值 png、gif、jpg
  text 图片上的文字，默认值为 size_

```
Random.image('200x100', '#00405d', '#FFF', 'Mock.js') //输出: "http://dummyimage.com/200x100/00405d/FFF&text=Mock.js"
```

- Random.dataImage( size?, text? )
  _生成随机 Base64 图片编码_

###### 4. 颜色函数

- Random.color()
  _随机生成颜色，格式为#RRGGBB_

```
Random.color() //输出: "#3538B2"
```

- Random.hex()
  _随机生成颜色，格式为#RRGGBB_

```
Random.hex() //输出: "#3538B2"
```

- Random.rgb()
  _随机生成颜色，格式为 rgb(r, g, b)_

```
Random.rgb() //输出: "rgb(242, 198, 121)"
```

- Random.rgba()
  _随机生成颜色，格式为 rgba(r, g, b, a)_

```
Random.rgba() //输出: "rgba(242, 198, 121, 0.13)"
```

- Random.hsl()
  _随机生成颜色，格式为 hsl(h, s, l)_

```
Random.hsl() //输出: "hsl(345, 82, 71)"
```

###### 5. 文本函数

- Random.paragraph( len?|min?, max? )
  _随机生成一段文本
  len 文本中句子个数，默认 3 到 7
  min 文本中句子最小个数，默认 3
  max 文本中句子最大个数，默认 7_

```
Random.paragraph(1, 3) 输出: "Qdgfqm puhxle twi lbeqjqfi bcxeeecu pqeqr srsx tjlnew oqtqx zhxhkvq pnjns eblxhzzta hifj csvndh ylechtyu."
```

- Random.cparagraph( min?, max? )
  _随机生成一段中文文本_

```
Random.cparagraph(2) //输出: "去话起时为无子议气根复即传月广。题林里油步不约认山形两标命导社干。"
```

- Random.sentence( len?|min?, max? )
  _随机生成一个句子，第一个单词的首字母大写
  len 句子中单词个数，默认 12 到 18
  min 句子中单词最小个数，默认 12
  max 句子中单词最大个数，默认 1_

```
Random.sentence(3, 5) //输出: "Mgl qhrprwkhb etvwfbixm jbqmg."
```

- Random.csentence( min?, max? )
  _随机生成一段中文文本_

```
Random.csentence(1, 3) //输出: "厂存。"
```

- Random.word( len?|min?, max? )
  _随机生成一个单词
  len 单词中字符个数，默认值 3 到 10
  min 单词中字符最小个数，默认 3
  max 单词中字符最大个数，默认 10_

```
Random.word(3, 5) //输出: "kemh"
```

- Random.cword( pool?, min?, max? )
  _随机生成一个汉字
  pool 汉字字符串，将从中选择一个汉字返回
  min 汉字字符串最小长度，默认 1
  max 汉字字符串最大长度，默认 1_

```
Random.cword('零一二三四五六七八九十', 5, 7) //输出: "九七七零四"
```

- Random.title( min?, max? )
  _随机生成一句标题，每个单词的首字母大写
  len 单词中字符个数，默认 3 到 7
  min 单词中字符最小个数，默认 3
  max 单词中字符最大个数，默认 7_

```
Random.title(3, 5) //输出: "Hvjexiondr Pyickubll Owlorjvzys Xfnfwbfk"
```

- Random.ctitle( min?, max? )
  _随机生成一句中文标题
  len 单词中字符个数，默认 3 到 7
  min 单词中字符最小个数，默认 3
  max 单词中字符最大个数，默认 7_

```
Random.ctitle(3, 5) //输出: "出料阶相"
```

###### 6. 姓名函数

- Random.first()
  _随机生成英文名_

```
Random.first() //输出: "Nancy"
```

- Random.last()
  _随机生成英文姓_

```
Random.last() //输出: "Martinez"
```

- Random.name( middle? )
  _随机生成英文姓名
  middle 布尔值，是否生成中间名_

```
Random.name() //输出: "Larry Wilson"
Random.name(true) //输出: "Helen Carol Martinez"
```

- Random.cfirst()
  _随机生成中文名_

```
Random.cfirst() //输出: "曹"
```

- Random.clast()
  _随机生成中文姓_

```
Random.clast() //输出: "艳"
```

- Random.cname()
  _随机生成中文姓名_

```
Random.cname() //输出: "袁军"
```

###### 7. URL 地址函数

- Random.url( protocol?, host? )
  _随机生成 URL
  protocol URL 协议，如 http
  host URL 域名和端口号，如 nuysoft.com:8080_

```
Random.url('http') //输出: "http://splap.yu/qxzkyoubp"
Random.url('http', 'nuysoft.com')  //输出: "http://nuysoft.com/ewacecjhe"
```

- Random.protocol()
  _随机生成一个 URL 协议，返回：http、ftp、gopher、mailto、mid、cid、news、nntp、prospero、telnet、rlogin、tn3270、wais_

```
Random.protocol() //输出: "ftp"
```

- Random.domain()
  _随机生成域名_

```
Random.domain() //输出: "kozfnb.org"
```

- Random.tld()
  _随机生成顶级域名_

```
Random.tld() //输出: "net"
```

- Random.email( domain? )
  _随机生成邮件地址
  domain 邮件地址的域名，如 nuysoft.com_

```
Random.email() //输出: "x.davis@jackson.edu"
Random.email('nuysoft.com') //输出: "h.pqpneix@nuysoft.com"
```

- Random.ip()
  _随机生成一个 IP 地址_

```
Random.ip() //输出: "34.206.109.169"
```

###### 8. 地区函数

- Random.region()
  _随机生成中国大区_

```
Random.region() //输出: "华北"
```

- Random.province()
  _随机生成中国省（直辖市、自治区、特别行政区）_

```
Random.province() //输出: "黑龙江省"
```

- Random.city( prefix? )
  _随机生成中国市
  prefix 布尔值，是否生成所属的省_

```
Random.city() //输出: "唐山市"
Random.city(true) //输出: "福建省 漳州市"
```

- Random.county( prefix? )
  _随机生成中国县
  prefix 布尔值，是否生成所属的省、市_

```
Random.county() //输出: "上杭县"
Random.county(true) //输出: "甘肃省 白银市 会宁县"
```

- Random.zip()
  _随机生成邮政编码（六位数字）_

```
Random.zip() //输出: "908812"
```

###### 9. 辅助函数

- Random.capitalize( word )
  _字符串首字母转换为大写_

```
Random.capitalize('hello') //输出: "Hello"
```

- Random.upper( str )
  _字符串转换为大写_

```
Random.upper('hello') //输出: "HELLO"
```

- Random.lower( str )
  _字符串转换为小写_

```
Random.lower('HELLO') //输出: "hello"
```

- Random.pick( arr )
  _从数组中随机选取一个元素并返回_

```
Random.pick(['a', 'e', 'i', 'o', 'u']) //输出: "o"
```

- Random.shuffle( arr )
  _打乱数组中元素的顺序并返回_

```
Random.shuffle(['a', 'e', 'i', 'o', 'u']) //输出: ["o", "u", "e", "i", "a"]
```

###### 10. 其他函数

- Random.guid()
  _随机生成一个 GUID_

```
Random.guid() //输出: "662C63B4-FD43-66F4-3328-C54E3FF0D56E"
```

- Random.id()
  _随机生成一个 18 位身份证_

```
Random.id() //输出: "420000200710091854"
```

- Random.increment( step? )
  _生成自增整数
  step 步长，默认 1_

```
Random.increment() //输出: 1
Random.increment(100) //输出: 101
```

##### 四. Mock.Random 扩展

_Mock.Random 中的方法与数据模板的@占位符是一一对应，
可以为 Mock.Random 扩展方法，在数据模板中通过@扩展方法引用_

```js
var Random = Mock.Random;
Random.extend({
  constellation: function (date) {
    var constellations = ["白羊座", "金牛座", "双子座", "巨蟹座", "狮子座"];
    return this.pick(constellations);
  },
});

Random.constellation(); // 输出: 水瓶座
Mock.mock("@CONSTELLATION"); // 输出: 天蝎座
Mock.mock({ constellation: "@CONSTELLATION" }); // 输出: {constellation: "射手座"}
```

##### 五. 参考文档

    语法规范 https://github.com/nuysoft/Mock/wiki/Syntax-Specification
    占位符说明文档 https://github.com/nuysoft/Mock/wiki/Mock.Random
    示例 http://mockjs.com/examples.html
