### 安装

```shell
npm install zustand
```

### 创建 store

```js
import { create } from "zustand";
const useBearStore = create((set) => ({
  bears: 0, // bear数量
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })), // +1 action
  removeAllBears: () => set({ bears: 0 }), // 删除所有的action
}));
```

### 绑定组件

```js
function BearCounter() {
  // 返回bear数量的状态
  const bears = useBearStore((state) => state.bears);
  return <h1>{bears} around here...</h1>;
}
```

```js
function Controls() {
  // 返回+1的action
  const increasePopulation = useBearStore((state) => state.increasePopulation);
  return <button onClick={increasePopulation}>one up</button>;
}
```

### 获取所有数据

```js
const state = useBearStore();
```

> 导致组件在每次状态改变时进行更新

### 选择多个状态

**使用严格相等性（old === new）来检测更改**

```js
const nuts = useBearStore((state) => state.nuts);
```

**使用 EqualityFn**

```js
import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";

// 使用createWithEqualityFn而不是create
const useBearStore = createWithEqualityFn(
  (set) => ({
    bears: 0,
    nuts: 0,
    honey: 0,
    treats: {},
    increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
    removeAllBears: () => set({ bears: 0 }),
  }),
  Object.is // 指定默认的相等性函数，可以是浅层比较
);

// 使用Object pick，当state.nuts或state.honey发生变化时重新渲染组件
const { nuts, honey } = useBearStore(
  (state) => ({ nuts: state.nuts, honey: state.honey }),
  shallow
);

// 使用Array pick，当state.nuts或state.honey发生变化时重新渲染组件
const [nuts, honey] = useBearStore(
  (state) => [state.nuts, state.honey],
  shallow
);

// 使用Mapped picks，当state.treats按顺序更改、计数或键时重新渲染组件
const treats = useBearStore((state) => Object.keys(state.treats), shallow);

// 使用自定义函数compare
const treats = useBearStore(
  (state) => state.treats,
  (oldTreats, newTreats) => compare(oldTreats, newTreats)
);
```

### 覆盖状态

```js
import omit from "lodash-es/omit";
const useFishStore = create((set) => ({
  salmon: 1,
  tuna: 2,
  deleteEverything: () => set({}, true), // 清除整个存储空间，包括操作（actions）在内
  deleteTuna: () => set((state) => omit(state, ["tuna"]), true), // 保留salmon、deleteEverything、deleteTuna
}));
```

### 异步操作

```js
const useFishStore = create((set) => ({
  fishies: {},
  fetch: async (pond) => {
    const response = await fetch(pond);
    set({ fishies: await response.json() }); // 只需在准备就绪时调用set，zustand不关心您的操作是异步还是同步的
  },
}));
```

### 在操作（actions）中从状态（state）中读取数据

```js
const useSoundStore = create((set, get) => ({
  sound: "grunt",
  action: () => {
    const sound = get().sound; // 通过get方法在函数外部访问状态（state）
    console.log(sound);
  },
}));
```

### 在组件之外读取/写入状态并对其变化做出反应

```js
const useDogStore = create(() => ({ paw: true, snout: true, fur: true }));
// 获取非响应式的新状态
const paw = useDogStore.getState().paw;
// 监听所有更改，每次更改时都会同步触发
const unsub1 = useDogStore.subscribe(console.log);
// 更新状态，将触发监听器
useDogStore.setState({ paw: false });
// 取消订阅监听器
unsub1();

// 当然，您也可以像往常一样使用钩子
const Component = () => {
  const paw = useDogStore((state) => state.paw);
  // ...
};
```

> 使用选择器（selector）进行订阅
> subscribe 方法可以接受更多的参数签名：

```js
subscribe(selector, callback, options?: { equalityFn, fireImmediately }): Unsubscribe
```

```js
import { subscribeWithSelector } from "zustand/middleware";
const useDogStore = create(
  subscribeWithSelector(() => ({ paw: true, snout: true, fur: true }))
);

// 监听所选项变化，例如当 "paw" 变化时
const unsub2 = useDogStore.subscribe((state) => state.paw, console.log);

// 订阅还提供了之前的值
const unsub3 = useDogStore.subscribe(
  (state) => state.paw,
  (paw, previousPaw) => console.log(paw, previousPaw)
);

// 订阅还支持可选的相等性函数
const unsub4 = useDogStore.subscribe(
  (state) => [state.paw, state.fur],
  console.log,
  { equalityFn: shallow }
);

// 订阅并立即触发
const unsub5 = useDogStore.subscribe((state) => state.paw, console.log, {
  fireImmediately: true,
});
```

### 非 React 环境使用 zustand

```js
// vanillaStore.js
import { createStore } from "zustand/vanilla";
const store = createStore(() => ({}));
const { getState, setState, subscribe } = store;
export default store;
```

```js
import { useStore } from "zustand";
import { vanillaStore } from "./vanillaStore";
const useBoundStore = (selector) => useStore(vanillaStore, selector); // 使用 useStore hook 来使用原生的存储库
```

### 订阅更新

```js
const useScratchStore = create((set) => ({ scratches: 0 }));

const Component = () => {
  // 获取初始状态
  const scratchRef = useRef(useScratchStore.getState().scratches);
  // 在组件挂载时连接到存储，卸载时断开连接，在引用中捕获状态变化
  useEffect(
    () =>
      useScratchStore.subscribe(
        (state) => (scratchRef.current = state.scratches)
      ),
    []
  );
};
```

### 使用 Immer 减少嵌套结构

```js
import { produce } from "immer";
const useLushStore = create((set) => ({
  lush: { forest: { contains: { a: "bear" } } },
  clearForest: () =>
    set(
      produce((state) => {
        state.lush.forest.contains = null;
      })
    ),
}));

const clearForest = useLushStore((state) => state.clearForest);
clearForest();
```

### 自定义中间件

```js
// 每次状态发生变化时记录日志
const log = (config) => (set, get, api) =>
  config(
    (...args) => {
      console.log("  applying", args);
      set(...args);
      console.log("  new state", get());
    },
    get,
    api
  );

const useBeeStore = create(
  log((set) => ({
    bees: false,
    setBees: (input) => set({ bees: input }),
  }))
);
```

### 内置的中间件

```js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
const useFishStore = create(
  persist(
    (set, get) => ({
      fishes: 0,
      addAFish: () => set({ fishes: get().fishes + 1 }),
    }),
    {
      name: "food-storage", // unique name
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
```

```js
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
const useBeeStore = create(
  immer((set) => ({
    bees: 0,
    addBees: (by) =>
      set((state) => {
        state.bees += by;
      }),
  }))
);
```

### devtools 中间件

```js
import { devtools } from "zustand/middleware";
const usePlainStore = create(devtools(store));
```

### 结合 React Context 使用

```js
import { createContext, useContext } from "react";
import { createStore, useStore } from "zustand";

const store = createStore({}); // vanilla store without hooks

const StoreContext = createContext();

const App = () => (
  <StoreContext.Provider value={store}>{/*...*/}</StoreContext.Provider>
);

const Component = () => {
  const store = useContext(StoreContext);
  const slice = useStore(store, selector);
  //   ...
};
```

### 更新状态

**扁平数据更新**

使用 set 函数更新新状态，它将与存储中的现有状态进行*浅层* _合并_

**深度嵌套对象**

- 例如：

```ts
type State = {
  deep: {
    nested: {
      obj: { count: number };
    };
  };
};
```

- 正常方法

```js
normalInc: () =>
  set((state) => ({
    deep: {
      ...state.deep,
      nested: {
        ...state.deep.nested,
        obj: {
          ...state.deep.nested.obj,
          count: state.deep.nested.obj.count + 1,
        },
      },
    },
  })),
```

> 类似于 React 或 Redux，正常的方法是复制状态对象的每个级别；
> 这通过使用展开运算符 ... 完成，通过手动将其与新的状态值合并来完成；
> 非常冗长！

- 使用 Immer

```js
immerInc: () =>
  set(produce((state: State) => {
    ++state.deep.nested.obj.count;
  })),
```

- 使用 optics-ts
- 使用 Ramda

### 模拟 reducer 模式

```js
// grumpy-store.js
export const actions = { increase: "INCREASE", decrease: "DECREASE" };

// 使用reducer处理所有action
function reducer(state, { type, payload }) {
  switch (type) {
    case actions.increase:
      return { grumpiness: state.grumpiness + payload.by };
    case actions.decrease:
      return { grumpiness: state.grumpiness - payload.by };
  }
}

const useGrumpyStore = create((set) => ({
  grumpiness: 0,
  dispatch: (action) => set((state) => reducer(state, action)), // 声明单一的dispatch作为action
}));
exprot default useGrumpyStore;
```

```js
import useGrumpyStore, {actions} from './grumpy-store';
function MyComponent() {
  const [grumpiness, dispatch] = useGrumpyStore((state) => [state.grumpiness, state.dispatch]);

  const handleClick = () => {
    const action = { type: actions.increase, payload: { by: 2 } };
    dispatch(action);
  };

  return (
    <>
      <span>{grumpiness}</span>
      <button onClick={handleClick}>
    </>
  );
}
```

### 将 state 和 action 分离的最佳实践

```js
// bound-store.js
const useBoundStore = create(() => ({
  count: 0,
  text: "hello",
}));
export default useBoundStore;

export const inc = () =>
  useBoundStore.setState((state) => ({ count: state.count + 1 }));

export const setText = (text) => useBoundStore.setState({ text });
```

### 切片模式最佳实践

```js
// fish-slice.js
export const createFishSlice = (set) => ({
  fishes: 0,
  addFish: () => set((state) => ({ fishes: state.fishes + 1 })),
});
```

```js
// bear-slice.js
export const createBearSlice = (set) => ({
  bears: 0,
  addBear: () => set((state) => ({ bears: state.bears + 1 })),
  eatFish: () => set((state) => ({ fishes: state.fishes - 1 })),
});
```

```js
// bear-fish-slice.js
export const createBearFishSlice = (set, get) => ({
  addBearAndFish: () => {
    get().addBear();
    get().addFish();
  },
});
```

```js
import { create } from "zustand";
import { createBearSlice } from "./bear-slice";
import { createFishSlice } from "./fish-slice";
import { createBearFishSlice } from "./bear-fish-slice";
import { persist } from "zustand/middleware";

const useBoundStore = create(
  persist(
    (...a) => ({
      ...createBearSlice(...a),
      ...createFishSlice(...a),
      ...createBearFishSlice(...a),
    }),
    { name: "bound-store" }
  )
);
```

### 重置到初始状态

```js
import { create } from "zustand";

// define types for state values and actions separately
const initialState = {
  salmon: 0,
  tuna: 0,
};

// create store
const useSlice = create()(function (set, get) {
  return {
    ...initialState,
    addSalmon: function (qty) {
      set({ salmon: get().salmon + qty });
    },
    addTuna: function (qty) {
      set({ tuna: get().tuna + qty });
    },
    reset: function () {
      // 重置
      set(initialState);
    },
  };
});
```

### 使用 computed

```shell
npm i zustand-computed
```

```js
import computed from "zustand-computed";

const computeState = (state) => ({
  countSq: state.count ** 2,
});

const useStore = create(
  computed(
    (set) => ({
      count: 1,
      inc: () => set((state) => ({ count: state.count + 1 })),
      dec: () => set((state) => ({ count: state.count - 1 })),
    }),
    (state) => ({ countSq: state.count ** 2 })
  )
);
```
