https://docs.pmnd.rs/zustand/guides/updating-state
https://juejin.cn/post/7177216308843380797?searchId=20231102135523B98C84B1525C190D779C
https://juejin.cn/post/7182462103297458236?searchId=20231102133906810F03F716E94B08CCE5

https://juejin.cn/post/7254443448562974775
https://juejin.cn/post/7257441061873696829
https://juejin.cn/post/6885000986763460615
https://juejin.cn/post/7137309684045709348
https://juejin.cn/post/7295291053299728418
https://zhuanlan.zhihu.com/p/267410440
https://blog.csdn.net/weixin_41718879/article/details/121862351
https://www.jianshu.com/p/2223db6db4bd




❶ 状态共享
	// store.ts
	import create from 'zustand'

	export const useStore = create(set => ({
	  count: 1,
	  inc: () => set(state => ({ count: state.count + 1 })),
	}))
	
	// Control.tsx
	import { useStore } from './store';
	
	function Control() {
	  return <button onClick={()=>{
	    useStore.setState((s)=>({...s,count: s.count - 5 }))
	    }}>－5</button>
	}
	
	// AnotherControl.tsx
	import { useStore } from './store';
	
	function AnotherControl() {
	  const inc = useStore(state => state.inc)
	  return <button onClick={inc}> +1 </button>
	}
	
	// Counter.tsx
	import { useStore } from './store';
	
	function Counter() {
	  const { count } = useStore()
	  return <h1>{count}</h1>  
	}
	
	单实例
	ustand 的 store 状态既可以在 react 世界中消费，也可以在 react 世界外消费。

❷ 状态变更

	在复杂的场景下，我们往往需要自行组织相应的状态变更方法，不然不好维护。这也是考验一个状态管理库好不好用的一个必要指标。
	这种方式没法处理异步，且没法互相调用，
	
	默认将所有的函数保持同一引用。所以用 zustand 写的方法，默认都不会造成额外的重复渲染。
	方法需要调用当前快照下的值或方法
	
	const initialState = { designId: undefined, loading: false };
	
	export const useStore = create((set, get) => ({
	  ...initialState,
	  deprecateDraft: async () => {
	    set({ loading: true });
	    const res = await dispatch('/hitu/remote/ds/deprecate-draft', get().designId);
	    set({ loading: false });
	
	    if (res) {
	      message.success('草稿删除成功');
	    }
	
	    // 重新获取一遍数据
	    get().refetch();
	  },
	  refetch: () => {
	    if (get().designId) {
	      mutateKitchenSWR('/hitu/remote/ds/versions', get().designId);
	    }
	  },
	})

❸ 状态派生
	复杂的例子，比如基于 rgb 、hsl 值和色彩模式，得到一个包含色彩空间的对象。
	在 hooks 场景下，状态派生的方法可以使用 useMemo，例如：
	const App = () => {
	  const [name,setName]=useState('')
	  const url = useMemo(() => URL_HITU_DS_BASE(name || ''),[name])
	  // ...
	}


	const App = () => {
	  const url = useStore( s => URL_HITU_DS_BASE(s.name || ''));
	  // ...
	}

❹ 性能优化
	useWhyDidYouUpdate
	基于 zustand 的 useStore 和 selector 用法，我们可以实现低成本、渐进式的性能优化。


❺ 数据分形与状态组合

	如果子组件能够以同样的结构，作为一个应用使用，这样的结构就是分形架构。
	应用上来说很简单，就是更容易拆分并组织代码，而且具有更加灵活的使用方式
	
	const { create } = require('zustand');
	
	const createBearSlice = (set) => ({
	  bears: 0,
	  addBear: () => set((state) => ({ bears: state.bears + 1 })),
	  eatFish: () => set((state) => ({ fishes: state.fishes - 1 })),
	});
	
	const createFishSlice = (set) => ({
	  fishes: 0,
	  addFish: () => set((state) => ({ fishes: state.fishes + 1 })),
	});
	
	const useBoundStore = create((...a) => ({
	  ...createBearSlice(...a),
	  ...createFishSlice(...a),
	}));
	
	我用的更多的是基于这种分形架构下的各种中间件。由于这种分形架构，状态就具有了很灵活的组合性，例如将当前状态直接缓存到 localStorage。在 zustand 的架构下， 不用额外改造，直接加个 persist 中间件就好。

❻ 多环境集成

	实际的复杂应用中，一定会存在某些不在 react 环境内的状态数据，以图表、画布、3D 场景最多。一旦要涉及到多环境下的状态管理
	
	// 1. 创建Store
	const useDogStore = create(() => ({ paw: true, snout: true, fur: true }))
	
	// 2. react 环境外直接拿值
	const paw = useDogStore.getState().paw
	
	// 3. 提供外部事件订阅
	const unsub1 = useDogStore.subscribe(console.log)
	
	// 4. react 世界外更新值
	useDogStore.setState({ paw: false })
	
	const Component = () => {
	  // 5. 在 react 环境内使用
	  const paw = useDogStore((state) => state.paw)
	  ...


基于 Zustand 的渐进式状态管理

状态管理会有一个重要但容易被忽略的核心需求：在遇到更加复杂的场景时，我们能不能用当前的模式轻松地承接住？


为了满足上述的目标，这个组件具有下述功能：

展示图标列表；
选择、删除图标；
搜索图标；
切换 antd 图标和 iconfont 图标类目；
添加与删除 Iconfont 脚本（暂不准备加编辑）；
切换 iconfont 脚本展示不同的 iconfont 脚本下的图标；

Step 1: store 初始化 ：State

import create from 'zustand';

// 注意一个小细节，建议直接将该变量直接称为 useStore
export const useStore = create(() => ({
  panelTabKey: 'antd',
})


import { Segmented } from 'antd';

import { useStore } from '../store';

const PickerPanel = () => {
  const { panelTabKey } = useStore();

  return (
    // ...
    <Segmented
      value={panelTabKey}
      onChange={(key) => {
        useStore.setState({ panelTabKey: key });
      }}

      // 其他配置
      size={'small'}
      options={[
        { label: 'Ant Design', value: 'antd' },
        { label: 'Iconfont', value: 'iconfont' },
      ]}
      block
    />
    
    // ...
  );
};

Step 2: 状态变更方法：Action

	我们用 setState 来管理非常简单的状态，这些状态基本上用不着为其单独设定相应的变更功能。但是随着业务场景的复杂性增多，我们不可避免地会遇到存在一次操作需要变更多个状态的场景。
	:::info
	而这些具有特定功能的状态变更方法，我统一称之为 Action。
	:::
	在图标选择器中，Action 其中之一的体现就是选择图标的操作。选择图标这个操作，除了设定当前选中的图标以外，还需要关闭 popover、清除筛选关键词（否则下次打开还是有筛选词的）。
	
	import create from 'zustand';


	export const useStore = create(() => ({
	  panelTabKey: 'antd',
	  iconList: ...,
	  
	  open: false,
	  filterKeywords: '',
	  icon: null,
	})
	
	import { useStore } from '../store';
	
	const IconList = () => {
	  const { iconList } = useStore();
	  return (
	    <div>
	      {iconList.map((icon) => (
	        <IconThumbnail onClick={(icon) => {
	            useStore.setState({ icon, open: false, filterKeywords: undefined });
	        })} />
	      ))}
	    </div>
	  );
	};


	import create from 'zustand';
	// 添加第一个入参 set 
	export const useStore = create((set) => ({
	  panelTabKey: 'antd',
	  iconList: ...,
	
	  open: false,
	  filterKeywords: '',
	  icon: null,
	  
	  // 新增选择图标的 action
	  selectIcon: (icon) => {
	    set({ icon, open: false, filterKeywords: undefined });
		},
	})
	
	import { useStore } from '../store';
	
	const IconList = () => {
	  const { iconList, selectIcon } = useStore();
	  return (
	    <div>
	      {iconList.map((icon) => (
	        <IconThumbnail onClick={selectIcon} />
	      ))}
	    </div>
	  );
	};
	
	另外值得一提的两个小点：
	
	Action 支持 async/await，直接给函数方法添加 async 符号即可；
	zustand 默认做了变量的优化，只要是从 useStore解构获得的函数，默认是引用不变的，也就是使用 zustand store 的函数本身并不会造成不必要的重复渲染。


Step 3: 复杂状态派生：Selector

	在 Step2 中大家应该有看到 iconList 这个状态，在上例中由于 iconList  并不是重点，因此简化了写法。但事实上在图标选择器组件中， iconList 并不是一个简简单单的状态，而是一个复合的派生状态。
	在选择器组件中， iconList 首先需要基于 是 Ant Design 的tab 或者 Iconfont 的 tabs 做原始图标数据源的进行切换，同时还需要支持相应的检索能力。而由于 Ant Design Tab 和 Iconfont 下的 list 具有不同的数据结构，因此筛选逻辑的实现也是不同的。


	import create from 'zustand';
	export const useStore = create(() => ({
	  // 数据源
	  panelTabKey: 'antd',
	  antdIconList,
	  iconfontIconList,
	
	  //...
	})
	                               
	// 展示用户会看到 icon list
	export const displayListSelector = (s: typeof useStore) => {
	  // 首先判断下来自哪个数据源
	  const list = s.panelTabKey === 'iconfont' ? s.iconfontIconList : s.antdIconList
	  // 解构拿到 store 中的关键词
	  const { filterKeywords } = s;
	
	  // 然后做一轮筛选判断
	  return list.filter((i) => {
	    if (!filterKeywords) return true;
	
	    // 根据不同的图标类型使用不同的筛选逻辑
	    switch (i.type) {
	      case 'antd':
	      case 'internal':
	        return i.componentName.toLowerCase().includes(filterKeywords.toLowerCase());
	
	      case 'iconfont':
	        return i.props.type.toLowerCase().includes(filterKeywords.toString());
	    }
	  });
	};



	import { useStore, displayListSelector } from '../store';
	const IconList = () => {
	  const { selectIcon } = useStore();
	  const iconList = useStore(displayListSelector);
	  
	  return (
	    <div>
	      {iconList.map((icon) => (
	        <IconThumbnail onClick={selectIcon} />
	      ))}
	    </div>
	  );
	};


Step 4: 结构组织与类型定义

	import create from 'zustand';
	// 添加第一个入参 set 
	export const useStore = create((set) => ({
	  panelTabKey: 'antd',
	  iconList: ...,
	  antdIconList,
	
	  open: false,
	  filterKeywords: '',
	  icon: null,


	  iconfontScripts: [],
	  iconfontIconList: [],
	  onIconChange: null,
	  
	  // 新增选择图标方法
	  selectIcon: (icon) => {
	    set({ icon, open: false, filterKeywords: undefined });
		},
	  // 移除图标方法
	  resetIcon: () => {
	    set({ icon: undefined });
	  },
	
	  addSript:()=>{ /*...*/ },
	  updateScripts:()=>{ /*...*/ },
	  removeScripts:()=>{ /*...*/ },
	  selectScript:async (url)=>{ /*...*/ }
	  // ...
	})
	
	// 展示用户会看到 icon list
	export const displayListSelector = (s: typeof useStore) => {
	  // 首先判断下来自哪个数据源
	  const list = s.panelTabKey === 'iconfont' ? s.iconfontIconList : s.antdIconList
	  // 解构拿到 store 中的关键词
	  const { filterKeywords } = s;
	
	  // 然后做一轮筛选判断
	  return list.filter((i) => {
	    if (!filterKeywords) return true;
	
	    // 根据不同的图标类型使用不同的筛选逻辑
	    switch (i.type) {
	      case 'antd':
	      case 'internal':
	        return i.componentName.toLowerCase().includes(filterKeywords.toLowerCase());
	
	      case 'iconfont':
	        return i.props.type.toLowerCase().includes(filterKeywords.toString());
	    }
	  });
	};

Step 5: 复杂 Action 交互：get()

Step 6: 从应用迈向组件：Context 与 StoreUpdater

Step 7: 性能优化：又是 selector ?

Step 8: 研发增强：Devtools


zustand是一种非常简单的实现，简单到让人觉得是不是总有一些场合是无法覆盖到的。而这就是我觉得zustand是一件艺术品的原因。因为他总有巧妙的方式来不失优雅的适配任何我想要的场景。



create