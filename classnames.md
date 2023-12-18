# Classnames

> 一个用于有条件地连接 classNames 的简单 JavaScript 工具

### 安装

```bash
npm install classnames
```

## 使用方法

`classNames` 函数接受任意数量的参数，可以是字符串或对象

参数 `'foo'` 等同于 `{ foo: true }`

如果与给定键关联的值为假值，该键将不包含在输出中

```js
classNames("foo", "bar"); // => 'foo bar'
classNames("foo", { bar: true }); // => 'foo bar'
classNames({ "foo-bar": true }); // => 'foo-bar'
classNames({ "foo-bar": false }); // => ''
classNames({ foo: true }, { bar: true }); // => 'foo bar'
classNames({ foo: true, bar: true }); // => 'foo bar'

// 各种类型的大量参数
classNames("foo", { bar: true, duck: false }, "baz", { quux: true }); // => 'foo bar baz quux'

// 其他假值将被忽略
classNames(null, false, "bar", undefined, 0, 1, { baz: null }, ""); // => 'bar 1'
```

数组将按照上述规则递归展平：

```js
const arr = ["b", { c: true, d: false }];
classNames("a", arr); // => 'a b c'
```

### 动态类名

```js
let buttonType = "primary";
classNames({ [`btn-${buttonType}`]: true });
```

### 与 React.js 一起使用

```js
import React, { useState } from "react";

export default function Button(props) {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  let btnClass = "btn";
  if (isPressed) btnClass += " btn-pressed";
  else if (isHovered) btnClass += " btn-over";

  return (
    <button
      className={btnClass}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {props.label}
    </button>
  );
}
```

### 将条件类表达为一个对象

```js
import React, { useState } from "react";
import classNames from "classnames";

export default function Button(props) {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const btnClass = classNames({
    btn: true,
    "btn-pressed": isPressed,
    "btn-over": !isPressed && isHovered,
  });

  return (
    <button
      className={btnClass}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {props.label}
    </button>
  );
}
```

### 混合使用对象、数组和字符串参数，只有真值参数才会包含在结果中：

```js
const btnClass = classNames("btn", this.props.className, {
  "btn-pressed": isPressed,
  "btn-over": !isPressed && isHovered,
});
```

### 使用`dedupe`

会删除重复的类，并确保在后续参数中指定的假类从结果集中排除

这个版本较慢（大约 5 倍），因此它是作为可选项提供的

```js
const classNames = require("classnames/dedupe");

classNames("foo", "foo", "bar"); // => 'foo bar'
classNames("foo", { foo: false, bar: true }); // => 'bar'
```

### 使用`bind`

```js
const classNames = require("classnames/bind");

const styles = {
  foo: "abc",
  bar: "def",
  baz: "xyz",
};

const cx = classNames.bind(styles);
const className = cx("foo", ["bar"], { baz: true }); // => 'abc def xyz'
```

示例：

```js
/* components/submit-button.js */
import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./submit-button.css";

const cx = classNames.bind(styles);

export default function SubmitButton({ store, form }) {
  const [submissionInProgress, setSubmissionInProgress] = useState(
    store.submissionInProgress
  );
  const [errorOccurred, setErrorOccurred] = useState(store.errorOccurred);
  const [valid, setValid] = useState(form.valid);

  const text = submissionInProgress ? "Processing..." : "Submit";
  const className = cx({
    base: true,
    inProgress: submissionInProgress,
    error: errorOccurred,
    disabled: valid,
  });

  return <button className={className}>{text}</button>;
}
```
