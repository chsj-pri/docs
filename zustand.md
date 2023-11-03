安装
	npm install zustand

创建store
	import { create } from 'zustand'
	const useStore = create((set) => ({
	  bears: 0,
	  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
	  removeAllBears: () => set({ bears: 0 }),
	}))

绑定组件
	function BearCounter() {
	  const bears = useStore((state) => state.bears)
	  return <h1>{bears} around here...</h1>
	}

	function Controls() {
	  const increasePopulation = useStore((state) => state.increasePopulation)
	  return <button onClick={increasePopulation}>one up</button>
	}



获取所有数据
	const state = useBearStore()
	导致组件在每次状态改变时进行更新

选择多个状态片段
	使用严格相等性（old === new）来检测更改
	const nuts = useBearStore((state) => state.nuts)

	import { createWithEqualityFn } from 'zustand/traditional'
	import { shallow } from 'zustand/shallow'
	
	// 使用createWithEqualityFn而不是create
	const useBearStore = createWithEqualityFn(
	  (set) => ({
	    bears: 0,
	    increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
	    removeAllBears: () => set({ bears: 0 }),
	  }),
	  Object.is // 指定默认的相等性函数，可以是浅层比较
	)
	
	// 使用Object pick，当state.nuts或state.honey发生变化时重新渲染组件。
	const { nuts, honey } = useBearStore(
	  (state) => ({ nuts: state.nuts, honey: state.honey }),
	  shallow
	)
	
	// 使用Array pick，当state.nuts或state.honey发生变化时重新渲染组件。
	const [nuts, honey] = useBearStore(
	  (state) => [state.nuts, state.honey],
	  shallow
	)
	
	// 使用Mapped picks，当state.treats按顺序更改、计数或键时重新渲染组件。
	const treats = useBearStore((state) => Object.keys(state.treats), shallow)
	
	const treats = useBearStore(
	  (state) => state.treats,
	  (oldTreats, newTreats) => compare(oldTreats, newTreats)
	)

覆盖状态
	import omit from 'lodash-es/omit'
	const useFishStore = create((set) => ({
	  salmon: 1,
	  tuna: 2,
	  deleteEverything: () => set({}, true), // 清除整个存储空间，包括操作（actions）在内
	  deleteTuna: () => set((state) => omit(state, ['tuna']), true),
	}))

异步操作
	const useFishStore = create((set) => ({
	  fishies: {},
	  fetch: async (pond) => {
	    const response = await fetch(pond)
	    set({ fishies: await response.json() })  // 只需在准备就绪时调用set，zustand不关心您的操作是异步还是同步的
	  },
	}))

在操作（actions）中从状态（state）中读取数据
	const useSoundStore = create((set, get) => ({
	  sound: 'grunt',
	  action: () => {
	    const sound = get().sound // 通过get方法在函数外部访问状态（state）
	    // ...
	  },
	}))

在组件之外读取/写入状态并对其变化做出反应
	const useDogStore = create(() => ({ paw: true, snout: true, fur: true }))

	// 获取非响应式的新状态
	const paw = useDogStore.getState().paw
	
	// 监听所有更改，每次更改时都会同步触发
	const unsub1 = useDogStore.subscribe(console.log)
	
	// 更新状态，将触发监听器
	useDogStore.setState({ paw: false })
	
	// 取消订阅监听器
	unsub1()
	
	// 当然，您也可以像往常一样使用钩子
	const Component = () => {
	  const paw = useDogStore((state) => state.paw)
	  ...
	 }

使用选择器（selector）进行订阅
	subscribe方法可以接受额外的签名参数：
	subscribe(selector, callback, options?: { equalityFn, fireImmediately }): Unsubscribe

	import { subscribeWithSelector } from 'zustand/middleware'
	const useDogStore = create(
	  subscribeWithSelector(() => ({ paw: true, snout: true, fur: true }))
	)
	
	// 监听所选项变化，例如当 "paw" 变化时
	const unsub2 = useDogStore.subscribe((state) => state.paw, console.log)
	
	// 订阅还提供了之前的值
	const unsub3 = useDogStore.subscribe(
	  (state) => state.paw,
	  (paw, previousPaw) => console.log(paw, previousPaw)
	)
	
	// 订阅还支持可选的相等性函数
	const unsub4 = useDogStore.subscribe(
	  (state) => [state.paw, state.fur],
	  console.log,
	  { equalityFn: shallow }
	)
	
	// 订阅并立即触发
	const unsub5 = useDogStore.subscribe((state) => state.paw, console.log, {
	  fireImmediately: true,
	})

使用zustand而不使用React
	import { createStore } from 'zustand/vanilla'
	const store = createStore(() => ({ ... }))
	const { getState, setState, subscribe } = store
	export default store

	import { useStore } from 'zustand'
	import { vanillaStore } from './vanillaStore'
	const useBoundStore = (selector) => useStore(vanillaStore, selector) // 使用 useStore hook 来使用原生的存储库

订阅更新
	const useScratchStore = create(set => ({ scratches: 0, ... }))

	const Component = () => {
	  // Fetch initial state
	  const scratchRef = useRef(useScratchStore.getState().scratches)
	  // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
	  useEffect(() => useScratchStore.subscribe(
	    state => (scratchRef.current = state.scratches)
	  ), [])

使用Immer减少嵌套结构
	import { produce } from 'immer'
	const useLushStore = create((set) => ({
	  lush: { forest: { contains: { a: 'bear' } } },
	  clearForest: () =>
	    set(
	      produce((state) => {
	        state.lush.forest.contains = null
	      })
	    ),
	}))

	const clearForest = useLushStore((state) => state.clearForest)
	clearForest()

自定义中间件
	// Log every time state is changed
	const log = (config) => (set, get, api) =>
	  config(
	    (...args) => {
	      console.log('  applying', args)
	      set(...args)
	      console.log('  new state', get())
	    },
	    get,
	    api
	  )

	const useBeeStore = create(
	  log((set) => ({
	    bees: false,
	    setBees: (input) => set({ bees: input }),
	  }))
	)

内置的中间件
	import { create } from 'zustand'
	import { persist, createJSONStorage } from 'zustand/middleware'
	const useFishStore = create(
	  persist(
	    (set, get) => ({
	      fishes: 0,
	      addAFish: () => set({ fishes: get().fishes + 1 }),
	    }),
	    {
	      name: 'food-storage', // unique name
	      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
	    }
	  )
	)

	import { create } from 'zustand'
	import { immer } from 'zustand/middleware/immer'
	const useBeeStore = create(
	  immer((set) => ({
	    bees: 0,
	    addBees: (by) =>
	      set((state) => {
	        state.bees += by
	      }),
	  }))
	)

devtools中间件
	import { devtools } from 'zustand/middleware'
	const usePlainStore = create(devtools(store))

React context
	import { createContext, useContext } from 'react'
	import { createStore, useStore } from 'zustand'

	const store = createStore(...) // vanilla store without hooks
	
	const StoreContext = createContext()
	
	const App = () => (
	  <StoreContext.Provider value={store}>
	    ...
	  </StoreContext.Provider>
	)
	
	const Component = () => {
	  const store = useContext(StoreContext)
	  const slice = useStore(store, selector)
	  ...
	}