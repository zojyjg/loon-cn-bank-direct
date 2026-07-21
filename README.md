# Loon 中国银行直连规则

此订阅将上游 `blackmatrix7/ios_rule_script` 中已维护的中国银行及银联 Loon 规则合并为一份，不含代理策略；请在 Loon 中以 `DIRECT` 引用。

```ini
RULE-SET,https://raw.githubusercontent.com/zojyjg/loon-cn-bank-direct/main/BankDirect.list,DIRECT
```

将该行放在代理规则和 `FINAL` 之前。规则仅令匹配的银行业务流量直连，Loon 的系统代理和其他分流保持不变。

## 当前来源

ABC、BOC、BOCOM、CCB、CEB、CGB、CMB、ICBC、PSBC、PingAn、UnionPay。

上游已有来源的内容每日自动同步；也可在 GitHub 的 **Actions → Sync bank rules → Run workflow** 手动同步。新增银行应先加入 `sources.json`，确保不会因目录名称歧义而误纳入无关服务。

## 使用边界

本规则只能使相关请求不走代理，无法隐藏 iOS 上 Loon 的 VPN/Network Extension 状态。若 App 直接检测 VPN 状态，仍可能需要临时关闭 Loon。

上游仓库：<https://github.com/blackmatrix7/ios_rule_script/tree/master/rule/Loon>
