在class组件中使用hooks



在class组件中使用hooks

方法1：将Hook包装成HOC
	import { useEffect, useState } from 'react';
	export function useScreenWidth(): number {
	  const [width, setWidth] = useState(window.innerWidth);
	  useEffect(() => {
	    const handler = (event: any) => {
	      setWidth(event.target.innerWidth);
	    };
	    // 监听浏览器窗口变化
	    window.addEventListener('resize', handler);
	    // 组件unmount时要解除监听
	    return () => {
	      window.removeEventListener('resize', handler);
	    };
	  }, []);

	  return width;
	}


	import React from 'react';
	import { useScreenWidth } from '../hooks/useScreenWidth';
	export const withHooksHOC = (Component: any) => {
	  return (props: any) => {
	    const screenWidth = useScreenWidth();
	
	    return <Component width={screenWidth} {...props} />;
	  };
	};


	import React from 'react';
	import { withHooksHOC } from './withHooksHOC';
	interface IHooksHOCProps {
	  width: number;
	}
	
	class HooksHOC extends React.Component<IHooksHOCProps> {
	  render() {
	    return <p>width: {this.props.width}</p>;
	  }
	}
	
	export default withHooksHOC(HooksHOC);


方法2：将Hook包装成函数组件
	import { FunctionComponent } from 'react';
	import { useScreenWidth } from '../hooks/useScreenWidth';

	type ScreenWidthChildren = (screenWidth: number) => React.ReactNode;
	
	interface IScreenWidthProps {
	  children: ScreenWidthChildren;
	}
	
	export const ScreenWidth: FunctionComponent<IScreenWidthProps> = ({
	  children,
	}) => {
	  const screenWidth: number = useScreenWidth();
	
	  return children(screenWidth);
	};
	
	import React from 'react';
	import { ScreenWidth } from './ScreenWidth';
	export class HooksRenderProps extends React.Component {
	  render() {
	    return (
	      <ScreenWidth>
	        {(width) => <p style={{ fontSize: '48px' }}>width: {width}</p>}
	      </ScreenWidth>
	    );
	  }
	}


方法3: renderWithHooks
class MyComponent extends React.Component {
  @renderWithHooks
  render() {
    const { count, setCount } = useState(0);

    return (
      <div>
        <p>Count: {count}</p>
        <button onClick={() => setCount(count + 1)}>Increment</button>
      </div>
    );
  }
}