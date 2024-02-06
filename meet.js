{
    document.addEventListener("DOMContentLoaded", e => start());

    let chatContainer;

    let charName;

    let targetMessageRow;
    let messageRangeStart;
    let messageMenu;

    let i18nText;

    function start() {
        /**
         * @type {HTMLDivElement}
         */
        chatContainer = document.getElementById("chat-container");

        const aiChatStreamer = document.getElementById("ai-chat-streamer");
        // 获取角色名
        const charDesc = aiChatStreamer.nextElementSibling;
        const charNameContainer = charDesc.children[1].children[1].children[0].children[0];
        charName = charNameContainer.textContent;

        //*
        chrome.storage.sync.get(
            {
                language: 0,
                showScrollBar: true
            }, (items) => {
        //*/
                const container_1 = chatContainer.children[0];

                if (items.language === 0) {
                    // 中文
                    i18nText = {
                        selectAllAbove: "选择以上所有",
                        selectAllBelow: "选择以下所有",
                        unselectAllAbove: "不选以上所有",
                        unselectAllBelow: "不选以下所有",
                        setAsRangeStart: "设为范围起点",
                        selectAllInRange: "选择范围内所有",
                        unselectAllInRange: "不选范围内所有",
                        downloadText: "下载文本",
                        downloadTextPlus: "下载文本+",
                        self: "我"
                    };
                } else if (items.language === 1) {
                    // 英文
                    i18nText = {
                        selectAllAbove: "Select All Above",
                        selectAllBelow: "Select All Below",
                        unselectAllAbove: "Unselect All Above",
                        unselectAllBelow: "Unselect All Below",
                        setAsRangeStart: "Set as Range Start",
                        selectAllInRange: "Select All in Range",
                        unselectAllInRange: "Unselect All in Range",
                        downloadText: "Download Text",
                        downloadTextPlus: "Download Text+",
                        self: "I"
                    };
                }

                // 创建消息菜单
                messageMenu = document.createElement("ul");
                messageMenu.style.position = "absolute";
                messageMenu.style.display = "none";
                messageMenu.className = "contextMenu";
                document.body.appendChild(messageMenu);
        
                // 点击时隐藏菜单
                document.addEventListener("click", e => {
                    messageMenu.style.display = "none";
                });
                const messageMenuData = [
                    {
                        text: i18nText.selectAllAbove,
                        click: e => {
                            let elem = targetMessageRow;
                            do {
                                let checkbox = getCheckBox(elem);
                                if (!checkbox.hasAttribute("data-checked")) {
                                    checkbox.click();
                                }
        
                                elem = elem.previousSibling;
                            } while (elem !== null);
                        }
                    },
                    {
                        text: i18nText.selectAllBelow,
                        click: e => {
                            let elem = targetMessageRow;
                            do {
                                let checkbox = getCheckBox(elem);
                                if (!checkbox.hasAttribute("data-checked")) {
                                    checkbox.click();
                                }
        
                                elem = elem.nextSibling;
                            } while (elem !== null);
                        }
                    },
                    {
                        text: i18nText.unselectAllAbove,
                        click: e => {
                            let elem = targetMessageRow;
                            do {
                                let checkbox = getCheckBox(elem);
                                if (checkbox.hasAttribute("data-checked")) {
                                    checkbox.click();
                                }
        
                                elem = elem.previousSibling;
                            } while (elem !== null);
                        }
                    },
                    {
                        text: i18nText.unselectAllBelow,
                        click: e => {
                            let elem = targetMessageRow;
                            do {
                                let checkbox = getCheckBox(elem);
                                if (checkbox.hasAttribute("data-checked")) {
                                    checkbox.click();
                                }
        
                                elem = elem.nextSibling;
                            } while (elem !== null);
                        }
                    },
                    {
                        text: i18nText.setAsRangeStart,
                        click: e => {
                            messageRangeStart = [...targetMessageRow.parentNode.children].indexOf(targetMessageRow);
                        }
                    },
                    {
                        text: i18nText.selectAllInRange,
                        click: e => {
                            let index = [...targetMessageRow.parentNode.children].indexOf(targetMessageRow);
                            let min;
                            let max;
                            if (messageRangeStart < index) {
                                min = messageRangeStart;
                                max = index;
                            } else {
                                min = index;
                                max = messageRangeStart;
                            }
        
                            for (let i = min; i <= max; ++i) {
                                const elem = targetMessageRow.parentNode.children[i];
                                let checkbox = getCheckBox(elem);
                                if (!checkbox.hasAttribute("data-checked")) {
                                    checkbox.click();
                                }
                            }
                        }
                    },
                    {
                        text: i18nText.unselectAllInRange,
                        click: e => {
                            let index = [...targetMessageRow.parentNode.children].indexOf(targetMessageRow);
                            let min;
                            let max;
                            if (messageRangeStart < index) {
                                min = messageRangeStart;
                                max = index;
                            } else {
                                min = index;
                                max = messageRangeStart;
                            }
        
                            for (let i = min; i <= max; ++i) {
                                const elem = targetMessageRow.parentNode.children[i];
                                let checkbox;
        
                                if (elem.classList.contains("flex-row")) {
                                    const checkbox_1 = elem.children[0];
                                    checkbox = checkbox_1.children[0];
                                } else {
                                    const checkbox_1 = elem.children[elem.children.length - 1];
                                    checkbox = checkbox_1.children[0];
                                }
                                if (checkbox.hasAttribute("data-checked")) {
                                    checkbox.click();
                                }
                            }
                        }
                    }
                ];
                for (const data of messageMenuData) {
                    const li = document.createElement("li");
                    li.className = "contextMenuOption";
                    li.textContent = data.text;
                    li.addEventListener("click", data.click);
                    messageMenu.appendChild(li);
                }

                //*
                if (items.showScrollBar) {
                    // 显示滚动条
                    chatContainer.classList.remove("scrollbar-hide");
                }
                //*/

                // 增加旧消息的上下文菜单
                for (let i = 0, childCount = container_1.children.length; i != childCount; ++i) {
                    const child = container_1.children[i];

                    addContextMenuEvent(child);
                }

                // 监听新消息
                const observer = new MutationObserver((list, observer) => {
                    for (const mutation of list) {
                        if (mutation.type === "childList") {
                            for (const added of mutation.addedNodes) {
                                if (added instanceof HTMLElement) {
                                    // 增加上下文菜单
                                    addContextMenuEvent(added);
                                }
                            }
                        }
                    }
                });
                observer.observe(container_1, {
                    childList: true
                });

                // 监听分享菜单
                const chatMenuObserver = new MutationObserver((list, observer) => {
                    for (const mutation of list) {
                        if (mutation.type === "childList") {
                            for (const added of mutation.addedNodes) {
                                if (
                                    added instanceof HTMLDivElement &&
                                    added.children.length === 2 &&
                                    added.children[1].children.length === 1 &&
                                    added.children[1].children[0].children.length === 5
                                ) {
                                    // 增加导出按钮
                                    const buttonContainer = added.children[1].children[0];
                                    
                                    addButton(buttonContainer, i18nText.downloadText, () => exportText());
                                }
                            }
                        }
                    }
                });
                chatMenuObserver.observe(chatContainer.parentNode, {
                    childList: true
                });
        //*
            }
        );
        //*/

    }

    function addContextMenuEvent(elem) {
        elem.addEventListener("contextmenu", e => {
            e.preventDefault();
            targetMessageRow = elem;
            messageMenu.style.left = `${e.clientX}px`;
            messageMenu.style.top = `${e.clientY}px`;
            messageMenu.style.display = "block";
        });
    }

    function getCheckBox(elem) {
        let checkbox;

        if (elem.classList.contains("flex-row")) {
            const checkbox_1 = elem.children[0];
            checkbox = checkbox_1.children[0];
        } else {
            const checkbox_1 = elem.children[elem.children.length - 1];
            checkbox = checkbox_1.children[0];
        }

        return checkbox;
    }

    function addButton(container, text, click) {
        const lastDiv = container.children[container.children.length - 1];

        const div = document.createElement("div");
        div.className = lastDiv.className;

        const button = document.createElement("button");
        button.className = lastDiv.children[0].className;
        button.addEventListener("click", click);

        const p = document.createElement("p");
        p.className = lastDiv.children[1].className;
        p.textContent = text;

        div.appendChild(button);
        div.appendChild(p);

        container.appendChild(div);
    }

    function exportText() {
        let result = [];

        function writeElementP(p) {
            let segs = [];

            for (let j = 0, segCount = p.childNodes.length; j !== segCount; ++j) {
                const segChild = p.childNodes[j];
                let nextText = "";
                if (segChild.nodeType === 1) {
                    if (segChild.tagName === "EM") {
                        nextText = `*${segChild.textContent}*`;
                    }
                } else if (segChild.nodeType === 3) {
                    nextText = segChild.wholeText;
                }
                if (nextText !== "") {
                    segs.push(nextText);
                }
            }

            const fullText = segs.join("");
            if (fullText !== "") {
                result.push(fullText);
            }
        }

        const container_1 = chatContainer.children[0];
        for (let i = 0, count = container_1.children.length; i !== count; ++i) {
            const child = container_1.children[i];
            let checkbox = getCheckBox(child);
            // 跳过未选中的消息
            if (!checkbox.hasAttribute("data-checked")) {
                continue;
            }

            if (child.classList.contains("flex-row")) {
                const child_4 = child.children[2];
                const child_5 = child_4.children[1];
                const child_6 = child_5.children[0];
                let child_7;
                for (let j = 0, childCount = child_6.children.length; j !== childCount; ++j) {
                    const child = child_6.children[j];
                    if (child.classList.contains("text-fgMain-200")) {
                        child_7 = child;
                        break;
                    }
                }

                result.push(`${charName}:`);
                for (let j = 0, childCount = child_7.children.length; j !== childCount; ++j) {
                    const childP = child_7.children[j];
                    writeElementP(childP);
                }
                result.push("");
            } else {
                const child_4 = child.children[1];
                const child_5 = child_4.children[1];
                const child_6 = child_5.children[0];

                const childP = child_6.children[0];
                result.push(`${i18nText.self}:`);
                writeElementP(childP);
                result.push("");
            }
        }

        const resultText = result.join("\n");

        // 下载文本文件
        const a = document.createElement("a");
        a.download = "share.txt";
        a.style.display = "none";

        const blob = new Blob([resultText]);
        a.href = URL.createObjectURL(blob);

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
    }
}