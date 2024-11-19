// 全局上下文，用于追踪当前正在执行的副作用
let currentEffect: (() => void) | null = null;
let currentEffectName: string | null = null;

// 创建一个代理对象来追踪属性访问
function createTrackableObject<T extends object>(obj: T, name: string): T {
  const subscribers = new Map<string | symbol, Set<() => void>>();
  const subscriberNames = new Map<string | symbol, Set<string>>();

  return new Proxy(obj, {
    get(target, prop) {
      // 如果有正在执行的副作用，将其添加到订阅列表中
      if (currentEffect && currentEffectName) {
        if (!subscribers.has(prop)) {
          subscribers.set(prop, new Set());
          subscriberNames.set(prop, new Set());
        }
        subscribers.get(prop)!.add(currentEffect);
        subscriberNames.get(prop)!.add(currentEffectName);
        
        console.log(`[Tracking] Property "${String(prop)}" of "${name}" is being tracked by effect "${currentEffectName}"`);
        console.log(`[Dependencies] "${name}.${String(prop)}" is now tracked by:`, Array.from(subscriberNames.get(prop)!));
      }
      return target[prop as keyof T];
    },
    set(target, prop, value) {
      const oldValue = target[prop as keyof T];
      target[prop as keyof T] = value;
      
      console.log(`[Update] Setting "${name}.${String(prop)}" from ${oldValue} to ${value}`);
      
      // 通知所有订阅者
      if (subscribers.has(prop)) {
        console.log(`[Notify] Notifying effects for "${name}.${String(prop)}":`, Array.from(subscriberNames.get(prop)!));
        subscribers.get(prop)!.forEach(effect => effect());
      }
      return true;
    }
  });
}

// 创建信号
export function createSignal<T>(initialValue: T, name: string): [() => T, (newValue: T) => void] {
  console.log(`[Signal] Creating signal "${name}" with initial value:`, initialValue);
  const state = createTrackableObject({ value: initialValue }, name);
  
  return [
    () => state.value,
    (newValue: T) => {
      state.value = newValue;
    }
  ];
}

// 创建计算属性
export function createMemo<T>(computation: () => T, name: string): () => T {
  console.log(`[Memo] Creating computed property "${name}"`);
  const [get, set] = createSignal<T>(computation(), name);
  
  createEffect(() => {
    set(computation());
  }, `${name}Computation`);
  
  return get;
}

// 创建副作用
export function createEffect(effect: () => void, name: string) {
  console.log(`[Effect] Creating effect "${name}"`);
  const execute = () => {
    currentEffect = execute;
    currentEffectName = name;
    console.log(`[Effect] Running effect "${name}"`);
    effect();
    currentEffect = null;
    currentEffectName = null;
  };
  
  execute();
}
