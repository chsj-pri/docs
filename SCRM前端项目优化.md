## SCRM前端项目优化

### 从工程方面
1. node npm 升级到最新
2. 升级到webpack5
3. 开启webpack5缓存
4. 排查不合理配置, 如exclude
5. 开发环境引入dll
6. 考虑treeshaking

### 从项目方面（开发效率和打包速度两者兼顾）
1. packages（lerna引入）
2. UI基础组件二次开发
3. 功能组件
4. 业务组件
5. mock接口
6. 微前端
7. icon font
8. 插图存cdn
9. 删除不使用的css
10. pnpm
11. JSDoc


### 参考
	speed-measure-webpack-plugin
	webpack-bundle-analyzer

	Mock
		https://zhuanlan.zhihu.com/p/326550841
		https://zhuanlan.zhihu.com/p/654430352
		https://github.com/mswjs/msw
		https://github.com/faker-js/faker
		https://github.com/mswjs/data
		https://github.com/mswjs/msw-storybook-addon
		https://github.com/nuysoft/Mock/wiki/Getting-Started


	icon font 
		https://zhuanlan.zhihu.com/p/489087139
		https://github.com/jaywcjlove/svgtofont
		https://github.com/leadream/figma-icon-automation/blob/master/README-CN.md
		https://github.com/bolin-L/nicon


	https://www.zhihu.com/people/phodal/columns


	http://product.dangdang.com/27878052.html
	https://zhuanlan.zhihu.com/p/74647711
	对于这些第三方组件来说，也没有什么好说的，一律进行二次封装：
	按需封装输入和输出
	按需修改成自己的样式
	尽可能通用化，而不是依赖于三方组件封装


	https://zhuanlan.zhihu.com/p/535794303?utm_id=0
	https://zhuanlan.zhihu.com/p/643214308


	Yup、Zod、Superstruct、Joi、Vest、class-validator、io-ts、nope


	https://github.com/react-hook-form/react-hook-form

	https://www.zhihu.com/question/338082919/answer/3220324040?utm_id=0
	https://zeroing.jd.com/docs.html#/
	MicroApp


















