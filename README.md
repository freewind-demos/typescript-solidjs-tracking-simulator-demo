# SolidJS 响应式追踪模拟器

这个项目是一个使用TypeScript实现的SolidJS响应式系统模拟器，用于展示和学习SolidJS中最核心的依赖追踪机制。

## 项目目的

1. 深入理解SolidJS的响应式系统工作原理
2. 展示细粒度依赖追踪的实现方式
3. 通过详细的日志展示依赖收集和更新传播的过程

## 核心特性

- 使用Proxy实现响应式对象
- 自动依赖收集
- 细粒度更新
- 计算属性（类似SolidJS的createMemo）
- 副作用（类似SolidJS的createEffect）
- 详细的追踪日志

## 项目结构

```
src/
  ├── core.ts     # 核心实现：响应式系统
  └── demo.ts     # 使用示例
```

## 安装和运行

```bash
# 安装依赖
pnpm install

# 运行演示
pnpm start
```

## 使用方法

项目提供了三个主要API：

1. `createSignal`: 创建一个响应式信号
```typescript
const [count, setCount] = createSignal(0, 'count');
```

2. `createMemo`: 创建一个计算属性
```typescript
const doubled = createMemo(() => count() * 2, 'doubled');
```

3. `createEffect`: 创建一个副作用
```typescript
createEffect(() => {
  console.log(`Current count: ${count()}`);
}, 'logEffect');
```

## 日志输出说明

系统会输出详细的追踪日志，包括：

- `[Signal]`: 信号创建
- `[Tracking]`: 依赖追踪过程
- `[Dependencies]`: 当前依赖关系
- `[Update]`: 值更新
- `[Notify]`: 通知订阅者
- `[Effect]`: 副作用执行

## 示例输出

运行demo后，你可以看到完整的依赖追踪过程：

```
[Signal] Creating signal "count" with initial value: 0
[Tracking] Property "value" of "count" is being tracked by effect "logEffect"
[Dependencies] "count.value" is now tracked by: [ 'logEffect' ]
[Update] Setting "count.value" from 0 to 1
[Notify] Notifying effects for "count.value": [ 'logEffect' ]
```

这些日志帮助你理解：
1. 何时创建了响应式对象
2. 哪些效果在追踪哪些属性
3. 当值改变时，更新是如何传播的

## 学习要点

1. 响应式系统的核心是自动依赖收集
2. Proxy可以用来拦截对象的读写操作
3. 通过全局上下文（currentEffect）实现依赖收集
4. 更新传播遵循单向数据流

## 扩展思路

1. 添加批量更新功能
2. 实现清理功能（cleanup）
3. 添加嵌套响应式对象支持
4. 实现资源处理（类似createResource）
5. 添加错误边界
