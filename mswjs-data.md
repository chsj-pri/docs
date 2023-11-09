### 介绍

这个库提供必要的工具来进行数据驱动的 API 模拟

- 直观的界面来建模数据
- 创建模型之间的关系的能力
- 以类似于实际数据库的方式查询数据的能力

### 安装

```shell
$ npm install @mswjs/data --save-dev
```

### 如何描述数据

使用工厂函数对数据进行建模

```js
// src/mocks/db.js
import { factory, primaryKey } from "@mswjs/data";
export const db = factory({
  // 创建一个“user”模型
  user: {
    // 具有这些属性和值
    id: primaryKey(() => "abc-123"),
    firstName: () => "John",
    lastName: () => "Maverick",
  },
});
```

### 使用主键

每个模型必须具有唯一一个主键，将其视为数据库中特定表的“id”列
任何属性都可以被标记为主键，不一定要命名为“id”

```js
import { factory, primaryKey } from "@mswjs/data";
factory({
  user: {
    id: primaryKey(String),
  },
});
```

```js
import { faker } from "@faker-js/faker";
factory({
  user: {
    id: primaryKey(faker.datatype.uuid),
  },
});
```

### factory

用于建模数据库
接受一个模型字典，并返回一个与描述的模型进行交互的 API 实例
每个 factory 返回封装了一个内存中的数据库实例，其中包含相应的模型
可以通过多次调用 factory 来创建多个数据库实例，但实体和关系不会在不同的数据库实例之间共享

```js
import { factory, primaryKey } from "@mswjs/data";
const db = factory({
  user: {
    id: primaryKey(String),
    firstName: String,
    age: Number,
  },
});
```

### primaryKey

将模型的属性标记为主键

```js
import { factory, primaryKey } from "@mswjs/data";
const db = factory({
  user: {
    id: primaryKey(String),
  },
});

// 创建一个新的“user”，主键“id”等于“user-1”
// 每个实体的主键必须是唯一，用作查询特定实体的标识符
db.user.create({ id: "user-1" });
```

### nullable

将当前模型属性标记为可为空

```js
import { factory, primaryKey, nullable } from '@mswjs/data'
factory({
  user: {
    id: primaryKey(String)
    // "user.title"是一个可为空的属性
    title: nullable(String)
  }
})
```

### oneOf

创建与另一个模型之间的一对一关系

```js
import { factory, primaryKey, oneOf } from "@mswjs/data";
factory({
  user: {
    id: primaryKey(String),
    role: oneOf("userGroup"),
  },
  userGroup: {
    name: primaryKey(String),
  },
});
```

### manyOf

创建与另一个模型之间的一对多关系

```js
import { factory, primaryKey, manyOf } from "@mswjs/data";
factory({
  user: {
    id: primaryKey(String),
    publications: manyOf("post"),
  },
  post: {
    id: primaryKey(String),
    title: String,
  },
});
```

### drop

删除给定数据库实例中的所有实体

```js
import { factory, drop } from "@mswjs/data";
const db = factory(...models);
drop(db);
```

### create

为模型创建一个实体

```js
// 当没有参数调用时，将使用模型定义中指定的获取器函数填充实体属性
const user = db.user.create();
```

```js
// 提供部分初始值
// 所有模型属性都是可选的，包括关系属性
const user = db.user.create({
  firstName: "John",
});
```

### findFirst

返回满足给定查询条件的第一个实体

```js
const user = db.user.findFirst({
  where: {
    id: {
      equals: "abc-123",
    },
  },
});
```

### findMany

返回满足给定查询条件的所有实体

```js
const users = db.user.findMany({
  where: {
    followersCount: {
      gte: 1000,
    },
  },
});
```

### count

返回给定模型的记录数

```js
db.user.create();
db.user.create();
db.user.count(); // 2
```

```js
// 可以接受一个可选的查询参数，在计算记录数之前对记录进行过滤
db.user.count({
  where: {
    role: {
      equals: "reader",
    },
  },
});
```

### getAll

返回给定模型的所有实体

```js
const allUsers = db.user.getAll();
```

### update

更新满足查询条件的第一个实体

```
const updatedUser = db.user.update({
  // 查询要修改的实体
  where: {
    id: {
      equals: 'abc-123',
    },
  },
  // 提供部分下一个数据，将与现有属性合并
  data: {
    // 指定确切的下一个值
    firstName: 'John',
    // 或者，从先前的值和未修改的实体派生下一个值
    role: (prevRole, user) => reformatRole(prevRole),
  },
})
```

### updateMany

更新满足查询条件的多个实体

```js
const updatedUsers = db.user.updateMany({
  // 查询要修改的实体
  where: {
    id: {
      in: ["abc-123", "def-456"],
    },
  },
  // 提供部分下一个数据，将与现有属性合并
  data: {
    firstName: (firstName) => firstName.toUpperCase(),
  },
});
```

### delete

删除满足查询条件的实体

```js
const deletedUser = db.user.delete({
  where: {
    followersCount: {
      equals: 0,
    },
  },
});
```

### deleteMany

删除满足查询条件的多个实体

```js
const deletedUsers = db.user.deleteMany({
  where: {
    followersCount: {
      lt: 10,
    },
  },
});
```

### toHandlers

为给定的模型生成请求处理程序，以与 Mock Service Worker 一起使用，
所有生成的处理程序都会自动连接到相应的模型方法，使您能够对模拟数据库执行 CRUD 操作

```js
import { factory, primaryKey } from "@mswjs/data";
const db = factory({
  user: {
    id: primaryKey(String),
    firstName: String,
  },
});
// 生成REST API请求处理程序
db.user.toHandlers("rest");
// 支持可选的第二个baseUrl参数，以将生成的处理程序限定在给定的端点范围内
db.user.toHandlers("rest", "https://example.com");
db.user.toHandlers("graphql", "https://example.com/graphql");
```

### 可空属性

默认情况下，所有模型属性都是非空的，可以使用 nullable 函数将属性标记为可空

```js
import { factory, primaryKey, nullable } from "@mswjs/data";
const db = factory({
  user: {
    id: primaryKey(String),
    firstName: String,
    // "user.age"是一个可空属性
    age: nullable(Number),
  },
});

db.user.create({
  id: "user-1",
  firstName: "John",
  // 可空属性可以作为初始值显式设置为null
  age: null,
});

db.user.update({
  where: {
    id: {
      equals: "user-1",
    },
  },
  data: {
    // 可空属性可以更新为null
    age: null,
  },
});
```

### 嵌套结构

您可以使用嵌套对象来设计模型的复杂结构

```js
import { factory, primaryKey, nullable } from "@mswjs/data";
const db = factory({
  user: {
    id: primaryKey(String),
    address: {
      billing: {
        street: String,
        city: nullable(String),
      },
    },
  },
});
```

```js
// 可以基于嵌套属性创建和查询数据
db.user.create({
  id: "user-1",
  address: {
    billing: {
      street: "Baker st.",
      city: "London",
    },
  },
});

db.user.update({
  where: {
    id: {
      equals: "user-1",
    },
  },
  data: {
    address: {
      billing: {
        street: "Sunwell ave.",
        city: null,
      },
    },
  },
});
```

```js
// 嵌套指定关系
factory({
  user: {
    id: primaryKey(String),
    address: {
      billing: {
        country: oneOf("country"),
      },
    },
  },
  country: {
    code: primaryKey(String),
  },
});
```
