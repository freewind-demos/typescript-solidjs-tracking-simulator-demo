import { createSignal, createEffect, createMemo } from './core';

console.log('\n=== 初始化阶段 ===\n');

// 创建信号
const [count, setCount] = createSignal(0, 'count');
const [multiplier, setMultiplier] = createSignal(2, 'multiplier');

// 创建一个计算属性，它依赖于count和multiplier
const doubledCount = createMemo(() => count() * multiplier(), 'doubledCount');

// 创建一个副作用，它会在count或multiplier变化时执行
createEffect(() => {
  console.log(`\n[Output] Current values:
  - count = ${count()}
  - multiplier = ${multiplier()}
  - doubledCount = ${doubledCount()}\n`);
}, 'outputEffect');

// 模拟一些状态更新
console.log('\n=== 更新count ===\n');
setCount(1);

console.log('\n=== 更新multiplier ===\n');
setMultiplier(3);

console.log('\n=== 再次更新count ===\n');
setCount(2);
