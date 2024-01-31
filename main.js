// ==UserScript==
// @name         XiaoMi路由器DHCP静态IP分配批量填充工具
// @namespace    https://www.treesystem.cn/
// @version      0.1
// @description  自动批量填充DHCP静态IP绑定表单
// @author       Treesystem
// @match        http://192.168.31.1/cgi-bin/luci/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 检查当前URL是否包含指定的路径
    const currentUrl = window.location.href;
    if (currentUrl.includes('/web/prosetting/dhcpipmacband')) {
        // 等待页面加载完毕，5秒后执行
        setTimeout(() => {
            const bdElement = document.getElementById('bd');
            if (bdElement) {
                // 创建新的div元素来放置批量添加的控件
                const bulkAddDiv = document.createElement('div');
                bulkAddDiv.innerHTML = `
                    <div class="mod-dhcp-ipmacband">
                        <div class="hd">
                            <h3>批量绑定DHCP静态IP分配（提交后3s自动处理，请耐心等待）</h3>
                        </div>
                        <div class="bd">
                            <h4>批量绑定设备：</h4>
                            <div class="form-item"><textarea class="ipt-text" style="width:auto;height:auto;" id="bulkAddTextarea" placeholder="一行代表一个设备\n格式为：设备名称|IP最后一格数字|MAC地址" rows="10" cols="50"></textarea></div>
                        </div>
                        <div class="ft">
                            <button type="button" class="btn btn-primary btn-m" id="bulkAddSubmit"><span>提交</span></button>
                        </div>
                    </div>
                `;
                bdElement.insertAdjacentElement('beforeend',bulkAddDiv);

                document.getElementById('bulkAddSubmit').addEventListener('click', () => {
                    // 模拟点击添加按钮
                    const addlistButton = document.getElementById('addlist');
                    if (addlistButton) {
                        addlistButton.click();
                        // 等待新HTML元素的创建
                        setTimeout(() => {
                            const bandItemsElement = document.getElementById('banditems');
                            if (bandItemsElement) {
                                // 清空当前的条目
                                bandItemsElement.innerHTML = '';
                                // 获取用户输入的批量添加内容
                                const bulkContent = document.getElementById('bulkAddTextarea').value;
                                const lines = bulkContent.split('\n');
                                lines.forEach((line, index) => {
                                    const [deviceName, ipLastPart, macAddress] = line.split('|');
                                    if (deviceName && ipLastPart && macAddress) {
                                        const tr = document.createElement('tr');
                                        tr.setAttribute('data-idx', index + 1);
                                        tr.innerHTML = `
                                            <td class="form-item"><input name="dname${index + 1}" value="${deviceName}" class="ipt-text dname" reqmsg="设备名称" datatype="text" maxlength="50"></td>
                                            <td class="form-item">192.168.31.<input name="ip${index + 1}" value="${ipLastPart}" class="ipt-text ip" reqmsg="IP地址" datatype="n-3" minvalue="1" maxvalue="254" style="width:30px"></td>
                                            <td class="form-item"><input name="mac${index + 1}" value="${macAddress}" class="ipt-text mac" reqmsg="MAC地址" datatype="macaddr"></td>
                                            <td class="center"><a href="#" class="btn btn-dft btn-del-item btn-s"><span>移除</span></a></td>
                                        `;
                                        bandItemsElement.appendChild(tr);
                                    }
                                });

                                // 弹出提示信息
                                alert('批量添加DHCP静态IP条目已填充完成，点击确认检查条目是否正确！');
                            }
                        }, 3000);
                    }
                });
            }
        }, 3000);
    }
})();