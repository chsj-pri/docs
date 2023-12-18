### 例子

```javascript
function App() {
  // 存储 后端返回数据
  const [zen, setZen] = React.useState("");
  // 存储 加载状态
  const [isLoading, setIsLoading] = React.useState(false);
  // 存储 是否请求成功
  const [isError, setIsError] = React.useState(false);
  // 存储 后端返回的错误数据
  const [errorMessage, setErrorMessage] = React.useState("");

  const fetchData = () => {
    // 开始获取数据，将isLoading置为true
    setIsLoading(true);

    fetch("https://api.github.com/zen")
      .then(async (response) => {
        // 如果请求返回status不为200 则抛出后端错误
        if (response.status !== 200) {
          const { message } = await response.json();

          throw new Error(message);
        }

        return response.text();
      })
      .then((text: string) => {
        // 请求完成将isLoading置为false
        setIsLoading(false);
        // 接口请求成功，将isError置为false
        setIsError(false);
        // 存储后端返回的数据
        setZen(text);
      })
      .catch((error) => {
        // 请求完成将isLoading置为false
        setIsLoading(false);
        // 接口请求错误，将isError置为true
        setIsError(true);
        // 存储后端返回的错误数据
        setErrorMessage(error.message);
      });
  };

  React.useEffect(() => {
    // 初始化请求数据
    fetchData();
  }, []);

  return (
    <div>
      <h1>Zen from Github</h1>
      <p>{isLoading ? "加载中..." : isError ? errorMessage : zen}</p>
      {!isLoading && (
        <button onClick={fetchData}>{isError ? "重试" : "刷新"}</button>
      )}
    </div>
  );
}
```

```javascript
import { useQuery } from "react-query";
const fetchData = () => {
  return fetch("https://api.github.com/zen").then(async (response) => {
    // 如果请求返回status不为200 则抛出后端错误
    if (response.status !== 200) {
      const { message } = await response.json();

      throw new Error(message);
    }

    return response.text();
  });
};

function App() {
  const zenQuery = useQuery({ queryKey: ["zen"], queryFn: fetchData });
  return (
    <div>
      <h1>Zen from Github</h1>
      <p>
        {zenQuery.isLoading || zenQuery.isFetching
          ? "加载中..."
          : zenQuery.isError
          ? zenQuery.error?.message
          : zenQuery.data}
      </p>
      {!zenQuery.isLoading && !zenQuery.isFetching && (
        <button
          onClick={() => {
            zenQuery.refetch();
          }}
        >
          {zenQuery.isError ? "重试" : "刷新"}
        </button>
      )}
    </div>
  );
}
```

### 概括

    React Query 是一个用于管理数据获取和状态的库，具有以下主要特征：

    1. 基于 React：React Query 是专为 React 应用设计的，它与 React 生态系统紧密集成，使数据管理更加直观和方便。
    2. 声明式数据获取：React Query 提供了 `useQuery` 和 `useMutation` 钩子，以声明式的方式管理数据获取和数据变更操作。
    3. 缓存和自动失效：库内置了数据缓存和自动失效机制，以减少不必要的网络请求，并提高应用性能。
    4. 强大的查询和过滤：React Query 允许你定义复杂的查询参数，以筛选和过滤数据。
    5. 数据状态管理：通过 React Query，你可以轻松地管理数据的加载中、错误、成功等不同状态，以及在不同状态下采取相应的操作。
    6. 服务器端数据同步：React Query 支持从服务器端同步数据，使数据与服务器保持同步，同时允许手动刷新。
    7. 自定义请求和数据转换：你可以自定义数据请求，处理和转换逻辑，以满足特定需求，例如类型转换、数据结构平铺等。
    8. 异步和并行请求：React Query 支持同时发起多个并行请求，以提高应用性能和速度。
    9. 插件和扩展性：库支持插件系统，可以通过插件来扩展功能，例如 DevTools 插件用于调试和监控。
    10. 零依赖：React Query 是一个独立的库，不依赖其他数据管理库，简化了应用的依赖关系。

    总的来说，React Query 是一个强大的工具，用于简化和提高 React 应用中数据获取和管理的效率，特别适用于处理复杂的数据交互需求。

### 安装

npm i @tanstack/react-query
npm i -D @tanstack/eslint-plugin-query

### 查询键

1. 查询键内的元素可以是嵌套数组、对象(深度比对)、字符串、数字

```
['zen', {form: 'confucius'}]
['zen', ['confucius', 'Lao Tzu']]
```

2. 查询键的值不能重复，需要保持唯一
3. 查询键变量的值变化后，将重新发起请求，并将查询键的值作为参数传入查询函数

```javascript
let userId;
let productId;

const usersQuery = useQuery({
  queryKey: [userId],
  queryFn: fetchUsers,
});

const productsQuery = useQuery({
  queryKey: [productId],
  queryFn: fetchProducts,
});

const usersQuery = useQuery({
  queryKey: ["users", userId],
  queryFn: fetchUsers,
});

const productsQuery = useQuery({
  queryKey: ["products", productId],
  queryFn: fetchProducts,
});
```

### 查询函数

```javascript
// 一个普通的Promise函数
const getLocation = async ({ queryKey, signal, pageParam, direction, meta }) =>
  new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
```

### 并行请求

1. 使用 Promise.all 合并某两个请求

```javascript
const getReposAndGists = (username) => {
  return Promise.all([
    fetch(`https://api.github.com/users/${username}/repos`).then((res) =>
      res.json()
    ),
    fetch(`https://api.github.com/users/${username}/gists`).then((res) =>
      res.json()
    ),
  ]);
};

const reposAndGistsQuery = useQuery({
  queryKey: ["reposAndGists", username],
  queryFn: () => getReposAndGists(username),
});
```

2. 使用 useQueries 进行请求（动态生成请求）

```javascript
const [users, setUsers] = React.useState([
      'facebook',
      'vuejs',
      'nestjs',
      'mongodb',
    ]);

    const getRepos = (username) =>
      fetch(`https://api.github.com/users/${username}/repos`).then((res) =>
        res.json()
      );

    const userQueries = useQueries({
      queries: users.map((user) => {
        return {
          queryKey: ['user', user],
          queryFn: () => getRepos(user),
        };
      }),
    });

    <button onClick={() => setUsers(['microsoft', 'tesla'])}>
```

### 依赖请求

`B接口的某个参数依赖A接口请求返回的内容`

```javascript
const labelsQuery = useQuery(["repos", owner, repo, "labels"], () =>
  fetch(`https://api.github.com/repos/${owner}/${repo}/labels`).then((res) =>
    res.json()
  )
);

const labels = labelsQuery.data;

const issuesQuery = useQuery(
  ["repos", owner, repo, "issues"],
  () =>
    fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues?labels=${labels[1].name}`
    ).then((res) => res.json()),
  {
    /**
     * 该配置项在value为true时，会触发接口请求。
     * 因此当第一个接口请求返回后，此时该配置项表达式为true
     * 会触发请求github中的issue列表
     * ①
     */
    enabled: !!labels,
  }
);
```

    问题：依赖查询接口一直为loading
    解决方案：使用fetchStatus判断是否为idle，表示当前查询函数不在运行

### 缓存状态

`const {status, fetchStatus, isLoading、isSuccess、isError} = useQuery()`
**status 属性值:** loading、success、error (isLoading、isSuccess、isError)  
**fetchStatus 属性 (进行后端请求查询时):** idle、fetching、paused

### 状态变更

##### 请求后端数据成功后:

    1. 请求结果将会在status中标记为success或error
    2. 在写入缓存时，此时的缓存状态是fresh(最新)状态，但是很快(默认过期时间是0ms)就会变为stale(老旧)状态
    3. 如果使用react的每个组件都被卸载后，缓存状态将会被标记为inactive(不活跃)状态，此时数据将不会被删除，直到一段时间后(默认为5分钟)，react-query将会从缓存中删除该条数据
    4. 在变为inactive(不活跃)状态之前，数据将会在fresh(最新)与stale(老旧)之间来回切换，同时接口请求状态也会在idle与fetching之间切换

##### 缓存更新:

###### 是否会触发查询函数，并从后端接口获取数据，与缓存状态有关：

    1. 如果缓存状态是stale(老旧)，表示该查询将会有资格重新获取
    2. 如果缓存状态是fresh(最新)，表示不会重新获取
    3. 默认情况下，后端返回的数据缓存状态将会立即从fresh状态变为stale状态(即默认staleTime: 0)
    4. 当配置中staleTime设置一个毫秒数时，缓存将会在staleTime毫秒后过期，状态从fresh变为stale
    5. 如果staleTime设置为Infinity，表示缓存不会过期，查询的数据将只会获取一次，且会在整个网页的生命周期内缓存
    6. 当状态变为stale并不会立即重新获取，而是需要满足一定的触发条件才可以

###### 触发条件（重新获取数据操作）：

    1. 组件挂载时  当组件首次加载，将会触发数据的获取。如果组件被卸载后再次被加载，此时也会触发数据的重新获取
    2. 查询键（queryKey）值改变时
    3. 页面重新被聚焦  当用户把浏览器重新聚焦时会自动重新获取数据，此触发条件默认开启，将refetchOnWindowFocus选项设置为false可以关闭此触发条件
    4. 网络重新连接  在当前用户断网重新联网后会重新获取数据，此触发条件默认开启的，将refetchOnReconnect选项设置为false可以关闭此触发条件
    5. 定时刷新  配置设置refetchInterval为毫秒，此时无论数据是fresh还是stale状态，在配置的毫秒时间间隔内都会重新获取数据，除定时刷新外的其它触发条件，都需要状态是stale才可以触发

**queryKey 与 Query 实例一一对应，Query 实例直接与服务端交互**
![image-20231103100554325](/Users/chenshengji/Library/Application Support/typora-user-images/image-20231103100554325.png)

### 清理缓存

    1. 在缓存状态处于inactive(不活跃)状态或者查询数据的组件卸载时，超过5分钟（默认值）后，将会自动清除缓存数据
    2. 通过配置cacheTime为毫秒数设置超时时间
    3. 将cacheTime设置为0，当查询数据在inactive状态时，立即从缓存中删除
    4. 当缓存被删除后，此时的表现和这个查询数据从未加载过一样，在查询数据重新从后端返回前将看到加载状态(loading)

```
const userQuery = useQuery({
  queryKey: ["user", username],
  queryFn: () => fetch(`https://api.github.com/users/${username}`)
  	.then(res => res.json()),
  	{ cacheTime: 0 })
});
```

### 错误重试

    当一个查询无法重新获取时，将会基于指数退避算法的时间间隔，尝试请求3次，从1s的延迟起步，到30s的最大延迟
    下面是默认重试策略的相关配置：

```
const exampleQuery = useQuery("example", fetchExample, {
  retry: 3,
  retryDelay: (attempt) => {
    return Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000);
  },
  // 或retryDelay: 5000
});
```

### 错误处理

```
import { ErrorBoundary } from "react-error-boundary";
const reposQuery = useQuery(
  {
    queryKey: ["users"],
    queryFn: () =>
      fetchWithError("https://api.github.com/users/facebook/repos"),
  },
  { useErrorBoundary: true, onError: (error) => console.log(error, "onError") }
);

function QueryError({ error }) {
  return (
    <div>
      <h1>出现错误</h1>
      <p>{error.message}</p>
    </div>
  );
}

<ErrorBoundary FallbackComponent="{QueryError}"> ... </ErrorBoundary>;

```

## 使用 QueryClient

```
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();
<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>;
```

```
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 1000,
      cacheTime: 10 * 1000,
      retry: 1,
    },
  },
});
```

### 默认查询函数

```
const queryGithub = ({ queryKey }) => {
  const BASE_URL = `https://api.github.com/`;
  const apiPath = queryKey.join("/");
  const requestUrl = `${BASE_URL}${apiPath}`;
  return fetch(requestUrl).then((res) => res.json());
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: queryGithub,
    },
  },
});
```

### 使用 queryClient 请求数据

```
import { useQueryClient } from "react-query";
// 此处省略一堆代码
const queryClient = useQueryClient();
const data = await queryClient.fetchQuery(
  ["repos", "facebook", "react", "issues"],
  queryGithub
);

```

### 更新查询数据

```
import { useQueryClient } from "react-query";
const queryClient = useQueryClient();
queryClient.refetchQueries(['repo']) // 包括非活跃查询以及活跃查询
queryClient.invalidateQueries(['repo']) // 活跃查询
```

### 查询过滤器

```
const repoQuery = useQuery(['repo', org, repo]); // ①
const repoIssuesQuery = useQuery(['repo', org, repo, 'issues']); // ②
const openIssuesQuery = useQuery(['repo', org, repo, 'issues', {state: 'open'}]); // ③

queryClient.refetchQueries(['repo', org, repo]); // 全部都会被刷新 ① ② ③
queryClient.refetchQueries(['repo', org, repo, "issues"]); // ②、③被刷新
queryClient.refetchQueries(['repo', org, repo, "issues"], {exact: true}); // ②被刷新
```

### 匹配数据状态及查询的多种状态

**数据状态:**
fresh 代表该查询在设定的时间内都是最新的
stale 表示当前数据已经过期，等待被某些动作触发刷新
fetching 表示当前正在获取数据的查询

**数据类型:**
active： 表示某个查询有任何一个组件挂载，react-query 就认为它处于活跃状态
inactive： 表示某个查询没有任何一个组件挂载，react-query 会认为该查询是非活跃状态
all： 以上两种类型

```
// 重新查询数据已经过期(slate) 且 当前处于活跃状态
queryClient.refetchQueries(
  ['repo', org, repo, "issues"],
  {stale: true, type: "active"}
);
```

### 取消查询

    1. 如果组件中的查询在卸载前未完成数据加载，那么react-query将会自动取消该请求
    2. 某个查询键在获取数据的过程中有更改，此时数据请求也会被取消

```
// 事件监听
const delayQuery = useQuery({
  queryKey: ["delay"],
  queryFn: ({signal}) => {
      signal?.addEventListener("abort", () => {
      clearTimeout(timeout);
    });
  }
});

//传入AbortController
// 将实例化后的AbortController传入fetch时，一旦手动触发取消请求，fetch将会立即取消本次的请求，无需做其它的设置。
const userQuery = useQuery(
  queryKey: ["users"],
  queryFn: ({signal}) => fetch("/api/users", {signal}).then(res => res.json())
);

// 手动调用取消
queryClient.cancelQueries(["users"])
```

### fetching 状态

    1. 表示是否正在获取数据（isFetching），当第一次加载数据时，没有任何数据，此时isLoading为true
    2. 当缓存中已存储了用户数据，只是在后台重新刷新数据，此时isFetching为true，isLoading为false，并且不影响之前缓存数据的展示

```
type QueryStatus = 'pending' | 'error' | 'success';
type FetchStatus = 'fetching' | 'paused' | 'idle';
```

```
// 获取全局fetching状态（useIsFetching）
import { Spin } from 'antd';
function QueryLoader() {
  const isFetching = useIsFetching();
  if (isFetching) {
    return <Spin />
  }
  return null;
}
```

```
// 支持查询过滤器
function RepoLoader({owner, repo}) {
  const isFetching = useIsFetching(["repo", owner, repo]);
  if (isFetching) {
    return <Spin />
  }
  return null;
}
```

### Placeholder Data（占位数据）

```
const userQuery = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser
  },
  {
    placeholderData: {
      avatar_url: "https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/mirror-assets/168e0858b6ccfd57fe5~tplv-t2oaga2asx-no-mark:180:180:180:180.awebp",
    }
  }
);

// 注意依赖查询
const userIssues = useQuery({
    queryKey: ["userIssues", userQuery.data.login],
    queryFn: fetchUserIssues
  },
  {
    enabled: !userQuery.isPlaceholderData
      && userQuery.data?.login,
  }
);
```

### Initial Data（硬编码数据）

```
const hardCodedAdminUsers = [{
    id: 1,
    login: "orange",
    name: "修仙大橙子",
    avatar_url: "https://p3-passport.byteimg.com/img/77c0f65~100x100.awebp",
}];

const adminUsersQuery = useQuery(
    ["adminUsers"],
    fetchAdminUsers, {
        initialData: hardCodedAdminUsers,
    }
);

const adminUsersQuery = useQuery(
    ["adminUsers"],
    fetchAdminUsers, {
        initialData: hardCodedAdminUsers,
        staleTime: 1000 * 60 * 60 * 24, // 1 day
        initialDataUpdatedAt: 1677073883689, // 2023-02-22 21:51:23 数据在2023-02-23 21:51:23之前都不会过期
    }
)
```

### 从其它查询中获取初始化数据（Initial Data）

```
const queryClient = useQueryClient();
const issueDetailQuery = useQuery(
    ["issue", repo, owner, issueNumber],
    fetchIssue, {
        initialData: () => {
            const issues = queryClient.getQueryData(["issues", repo, owner])
            if (!issues) return undefined;
            const issue = issues.find(issue => issue.number === issueNumber)
            return issue;
        }
    },
)
```

```
const issueDetailQuery = useQuery(
    ["issue", repo, owner, issueNumber],
    fetchIssue, {
        staleTime: 1000 * 60,
        initialData: () => {
            const issues = queryClient.getQueryData(["issues", repo, owner])
            if (!issues) return undefined;
            const issue = issues.find(issue => issue.number === issueNumber)
            return issue;
        },
        initialDataUpdatedAt: () => {
            const { dataUpdatedAt } = queryClient.getQueryState(["issues", repo, owner])
            return dataUpdatedAt;
        }
    },
)
```

### 增删改 useMutation

```
async function changeName(newName) {
  const response = await fetch("https://api.github.com/user", {
    method: "PATCH",
    headers: {
      authorization: `token {这里替换成你自己的github token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      name: newName,
    }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message);
  }
  return result;
}

const Username = () => {
  const userQuery = useQuery(["user"], fetchUser);
  const changeNameMutation = useMutation(changeName);
  if (userQuery.isLoading) return <p>加载数据中...</p>;

  return (
    <>
      <button
        onClick={() => {
          const newName = prompt("你希望修改成什么名字?");
          changeNameMutation.mutate(newName);
        }}>
        {changeNameMutation.isLoading ? "更改中..." : ""}
        {userQuery.data.name}
      </button>
      {" "}
      {changeNameMutation.isError && <p>{changeNameMutation.error}</p>}{" "}
      {changeNameMutation.isSuccess && (
        <p>github用户名修改成功！欢迎回来： {changeNameMutation.data.name}.</p>
      )}{" "}
    </>
  );
};

```

    useMutation钩子不会在组件加载时就直接请求，需要手动调用mutate方法并传入请求参数，
    将所有与之相关的数据（isLoading当前是否正在请求，isError当前是否请求失败，isSuccess当前是否请求成功，data后端返回的成功数据），都记录下来，方便后续调用

```
// 重置信息:
const timerRef = useRef()
const changeNameMutation = useMutation(changeName, {
    onSuccess: () => {
        timerRef.current = setTimeout(() => {
            changeNameMutation.reset() // 调用reset方法进行清除，changeNameMutation内将会保存相关的请求信息缓存
        }, 3000)
    },
    onMutate: () => {
        clearTimeout(timerRef.current)
    }
});
```

### 乐观更新

**乐观的估计后端一定可以更新成功，提前将用户修改的内容展现给他**

```
const addCommentMutation = useMutation(addComment, {
    onMutate: (variables) => {
        const savedCache = queryClient.getQueryData(
            ["comments", org, repo, issueNumber]
        );


        const comment = {
            id: Math.random().toString(),
            body: variables.comment,
            created_at: new Date(),
            user: {
                login: username,
            }
        }
        queryClient.setQueryData(
            ["comments", org, repo, issueNumber],
            (comments) => comments.concat(comment)
        );


        return () => {
            queryClient.setQueryData(
                ["comments", org, repo, issueNumber],
                savedCache
            )
        }
    },
    onSuccess: (data, variables, restoreCache) => {
        restoreCache();
        queryClient.setQueryData(
            ["comments", org, repo, issueNumber],
            (comments) => comments.concat(data)
        );
    },
    onSettled: (data, variables) => {
        queryClient.invalidateQueries(["comments", org, repo, issueNumber]);
    },
    onError: (error, variables, restoreCache) => {
        restoreCache();
    }
})
```

### 分页(keepPreviousData)

    通过将keepPreviousData: true配置项传入useQuery钩子，每当查询键发生改变时，查询将会继续提供最后一次的查询数据，直到新的查询数据可用为止，
    这个特性不仅可以用于分页，对于排序等场景也非常好用

```
const Issues = ({ org, repo }) => {
  // ...
  const issuesQuery = useQuery(
    ["issues", org, repo, { page, perPage }],
    fetchIssues,
    { keepPreviousData: true }
  );

  return (
    <div>
      <button onClick={() => setPage((page) => page - 1)} disabled={page === 1}>
        上一页
      </button>
      <p>
        Page {page} {issuesQuery.isFetching ? "..." : ""}
      </p>
      <button
        onClick={() => setPage((page) => page + 1)}
        disabled={
          !issuesQuery.data ||
          issuesQuery.data.length === 0 ||
          issuesQuery.isPreviousData //
        }
      >
        下一页
      </button>
    </div>
  );
};

```

### 预加载分页数据

```
const Issues = ({ org, repo }) => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const perPage = 10;
  const issuesQuery = useQuery(
    ["issues", org, repo, { page, perPage }],
    fetchIssues,
    { keepPreviousData: true }
  );

  useEffect(() => {
    queryClient.prefetchQuery(
      ["issues", org, repo, { page: page + 1, perPage }],
      fetchIssues
    );
  }, [org, repo, page, perPage, queryClient]);

  // ...
};
```

无限加载数据 useInfiniteQuery 1. useInfiniteQuery 与 useQuery 在大多数的设计上是一致的，包括都可以传入查询键和查询函数，并且会返回后端数据（data）, 是否第一次获取数据中（isLoading）, 是否错误（isError）, 是否正在加载数据中（isFetching）等 2. 一些区别的地方：useInfiniteQuery 钩子的查询函数会接收到一个 pageParam 的参数，该参数为当前的翻页状态，你可以通过这个参数，获取相关的数据

```
const fetchInfiniteIssues = async ({ queryKey, pageParam = 1 }) => {
  const [issues, org, repo] = queryKey;
  const response = await fetch(
    `https://api.github.com/repos/${org}/${repo}/issues?page=${pageParam}`
  ); // 1. pageParam参数
  const json = await response.json();
  return json;
};

const InfiniteIssues = () => {
  const issuesInfiniteQuery = useInfiniteQuery(
    ["issues", org, repo],
    fetchInfiniteIssues,
    {
      getNextPageParam: (lastPage, pages) => {
        // 2. 返回pageParam
        if (lastPage.length === 0) {
          return;
        }
        return pages.length + 1;
      },
    }
  );

  // 监听页面是否滚动到底部加载下一页数据
  useScrollToBottomAction(
    document,
    () => {
      // ①
      if (issuesInfiniteQuery.isFetchingNextPage) return;
      issuesInfiniteQuery.fetchNextPage();
    },
    500
  );

  return (
    <div>
      {issuesInfiniteQuery.data.pages.map(
        (
          page,
          index // 3. 数据将会被挂载在pages
        ) => (
          <Fragment key={index}>
            {page.map((issue) => (
              <Issue key={issue.id} issue={issue} />
            ))}
          </Fragment>
        )
      )}
      <button
        onClick={
          () => issuesInfiniteQuery.fetchNextPage() // 4. fetchNextPage加载更多
        }
        disabled={
          !issuesInfiniteQuery.hasNextPage ||
          issuesInfiniteQuery.isFetchingNextPage
        }
      >
        {issuesInfiniteQuery.isFetchingNextPage
          ? "正在加载下一页数据..."
          : "点击加载更多数据"}
      </button>
    </div>
  );
};

function useScrollToBottomAction(container, callback, offset = 0) {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleScroll = () => {
      let scrollContainer =
        container === document ? document.scrollingElement : container;
      if (
        scrollContainer.scrollTop + scrollContainer.clientHeight >=
        scrollContainer.scrollHeight - offset
      ) {
        callbackRef.current();
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [container, offset]);
}
```

### 双向无限查询

```
const InfiniteIssues = () => {
  const issuesInfiniteQuery = useInfiniteQuery(
    ["issues", org, repo, { startingPage: 3 }],
    fetchInfiniteIssues,
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.issueList.length === 0) {
          return;
        }
        return lastPage.pageParam + 1;
      },
      getPreviousPageParam: (firstPage, pages) => {
        if (firstPage.pageParam <= 1) {
          return;
        }
        return firstPage.pageParam - 1;
      },
    }
  );

  return (
    <div>
      <button
        onClick={() => issuesInfiniteQuery.fetchPreviousPage()}
        disabled={
          !issuesInfiniteQuery.hasPreviousPage ||
          issuesInfiniteQuery.isFetchingPreviousPage
        }
      >
        {issuesInfiniteQuery.isFetchingPreviousPage
          ? "加载上一页数据中..."
          : "点击加载更多"}
      </button>

      {issuesInfiniteQuery.data.pages.map((page, index) => (
        <Fragment key={index}>
          {page.issueList.map((issue) => (
            <Issue key={issue.id} issue={issue} />
          ))}
        </Fragment>
      ))}

      <button
        onClick={() => issuesInfiniteQuery.fetchNextPage()}
        disabled={
          !issuesInfiniteQuery.hasNextPage ||
          issuesInfiniteQuery.isFetchingNextPage
        }
      >
        {issuesInfiniteQuery.isFetchingNextPage
          ? "加载下一页数据中..."
          : "点击加载更多"}
      </button>
    </div>
  );
};
```

### Suspense

```
import { Suspense } from "react";
const App = ({ userId }) => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <User userId={userId} />
      <Gists userId={userId} />
    </Suspense>
  );
};

const User = ({ userId }) => {
  const userQuery = useQuery(["user", userId], () => fetchUser(userId), {
    suspense: true,
  });
  return <div>{userQuery.data.name}</div>;
};

const Gists = ({ userId }) => {
  const gistsQuery = useQuery(["gists", userId], () => fetchGists(userId), {
    suspense: true,
  });
  return <div>{gistsQuery.data.length} Gists</div>;
};
```

    在render函数中，我们可以写入一个异步请求，请求数据；
    react会从我们缓存中读取这个缓存
    如果有缓存了，直接进行正常的render；
    如果没有缓存，那么会抛出一个异常，这个异常是一个promise。
    当这个promise完成后（请求数据完成），react会继续回到原来的render中（实际上是重新执行一遍render），把数据render出来。
    完全同步写法，没有任何异步callback之类的东西

### 降低渲染次数

```
const DisplayId = () => {
  const idQuery = useQuery(["id"], fetchId, {
    refetchInterval: 1000,
    select: (data) => data.id, // 降低渲染次数
  });
  return <div>ID: {idQuery.data}</div>;
};
```

    react-query将会做深度等价检查，从select函数返回的数据与之前是否匹配，如果匹配那么react-query就不会重新渲染该组件；
    使用select选择返回的id属性，由于数据没有发生改变，都不会触发重新渲染的操作

### 使用 DevTools 来观察缓存状态变化

```
import { ReactQueryDevtools } from 'react-query/devtools';
<ReactQueryDevtools initialIsOpen />
```

### react-query 与 zustand 结合使用

```
// setup your store
const useStore = create(set => {
    someFetchMutation: async (data) => {
        const response = await fetch(someUpdates);
        const results = await callThisDuringYourMutation(response);
        return results
    },
    callThisDuringYourMutation: async (response) => { //  voodoo },
        anotherAsyncThing: async () => {}
    })

// this will be your parent hook where you manage your react-query hooks and your zustand hooks
const useQueryStore = () => {
    const someAsyncFetchMutation = useStore.getState().someFetchMutation;
    const anotherAsyncAction = useStore.getState().anotherAsyncAction;

    const queryClient = useQueryClient()

    // I can use one of my zustand methods as my react-query mutation function
    // now when I call my mutation, I will be inside my zustand store and can do more things
    const { mutateAsync } = useMutation(someAsyncFetchMutation);
    const commitMutation = useCallback(
        async (data) => {
                // now we're in an async callback and we can call any combination of our functions we want
                const result = await mutateAsync(data)


                // call another async thing here, or in someAsyncFetchMutation
                await anotherAsyncAction(result)

                // and I could update my react-query here too
                queryClient.setQueryData(...)
            },

            [someFetchMutation, anotherAsyncAction, mutateAsync])

    // you can then use this 'parent' hook wherever you want, and expose this callback to run your mutation
    return {
        commitMutation
    }
}
```

### 实例 1

```
/**
实现点击查询按钮查询
*/
import React from 'react';
import { useQuery, useMutation, QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function fetchData() {
  // 这里模拟一个异步数据请求，你应该替换为你的实际数据请求逻辑
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: '查询的数据' });
    }, 1000);
  });
}

function App() {
  const { data, isLoading } = useQuery('data', fetchData);

  const handleClick = () => {
    // 在点击查询按钮时重新触发数据请求
    queryClient.invalidateQueries('data');
  };

  return (
    <div>
      <h1>React Query 示例</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>Data: {data.data}</p>
          <button onClick={handleClick}>查询</button>
        </div>
      )}
    </div>
  );
}

export default function QueryComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}
```

### 实例 2

```
import React from 'react';
import { useQuery, useMutation, QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function fetchData() {
  // 模拟异步数据请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: '查询的数据' });
    }, 1000);
  });
}

function App() {
  const { data, isLoading } = useQuery('data', fetchData, {
    enabled: false, // 禁用自动查询
  });

  const queryClient = useQueryClient();

  const queryData = useMutation(fetchData, {
    onMutate: () => {
      // 在发起查询前，可以执行一些操作，比如显示 loading 状态
    },
    onError: (error) => {
      // 处理查询错误
    },
    onSuccess: () => {
      // 查询成功后的操作
    },
  });

  const handleClick = () => {
    // 手动触发查询
    queryData.mutate();
  };

  return (
    <div>
      <h1>React Query 示例</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>Data: {data.data}</p>
          <button onClick={handleClick}>查询</button>
        </div>
      )}
    </div>
  );
}

export default function QueryComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}
```

### 实例 3

```
/**
对服务器返回的数据进行处理
*/
import React from 'react';
import { useQuery, QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function fetchData() {
  // 模拟服务器返回的数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: 1, name: 'John', age: 30 });
    }, 1000);
  });
}

function App() {
  const { data, isLoading } = useQuery('data', fetchData, {
    select: (response) => {
      // 在这里对服务器返回的数据进行处理
      return {
        userId: response.id,
        userName: response.name,
        userAge: response.age,
      };
    },
  });

  return (
    <div>
      <h1>React Query 示例</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>User ID: {data.userId}</p>
          <p>User Name: {data.userName}</p>
          <p>User Age: {data.userAge}</p>
        </div>
      )}
    </div>
  );
}

export default function QueryComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}
```

### 参考

https://tanstack.com/query/latest/docs/react/overview
https://juejin.cn/column/7105422212789714980
https://juejin.cn/post/7195923686716211259
https://juejin.cn/post/7169515109172609032
https://mp.weixin.qq.com/s?__biz=Mzg3NTcwMTUzNA==&mid=2247486199&idx=1&sn=24b01dea0aa1342d8b82c156ebcf6f2c&source=41#wechat_redirect
