const saveOptions = () => {
    const languageElem = document.getElementById("language");
    const showScrollBarElem = document.getElementById("showScrollBar");

    chrome.storage.sync.set(
        {
            language: parseInt(languageElem.value),
            showScrollBar: showScrollBarElem.checked
        }, () => {}
    );
}

const restoreOptions = () => {
    const languageElem = document.getElementById("language");
    const showScrollBarElem = document.getElementById("showScrollBar");

    chrome.storage.sync.get(
        {
            language: 0,
            showScrollBar: true
        }, (items) => {
            changeLanguage(items.language);

            languageElem.value = items.language.toString();
            showScrollBarElem.checked = items.showScrollBar;
        }
    );

    // 修改语言后即时更新界面
    languageElem.addEventListener("change", e => changeLanguage(parseInt(languageElem.value)));
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("saveButton").addEventListener("click", saveOptions);

function changeLanguage(lang) {
    // 修改界面上的语言
    let i18nText;

    if (lang === 0) {
        i18nText = {
            title: "FlowGPT Plus 配置",
            language: "语言",
            showScrollBar: "显示滚动条",
            save: "保存"
        };
    } else {
        i18nText = {
            title: "FlowGPT Plus Setting",
            language: "Language",
            showScrollBar: "Show Scroll Bar",
            save: "Save"
        };
    }

    document.title = i18nText.title;
    document.getElementById("languageSpan").textContent = i18nText.language;
    document.getElementById("showScrollBarSpan").textContent = i18nText.showScrollBar;
    document.getElementById("saveButton").textContent = i18nText.save;
}