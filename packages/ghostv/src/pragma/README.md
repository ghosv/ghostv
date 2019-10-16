# pragma

+ snabbdom 的 VNode 转化部分参考 [snabbdom-pragma](https://github.com/Swizz/snabbdom-pragma)。
+ snabbdom-pragma 的 createElement 采用直接转为 snabbdom 的 VNode 的方式，自底向上构建 VNode。
+ 本库采用兼容 React 的 Node/Element 的方案，自顶向下构建 GhostVElement，渲染时将 GhostVElement 转化为 VNode。
