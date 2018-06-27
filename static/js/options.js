let coinList = function () {
    let url = "https://api.coinmarketcap.com/v2/listings/";
    $.get(url, function (data) {
        let coinlist = data.data;
        coinlist.sort(function (a, b) {
                let s = a.symbol;
                let e = b.symbol;
                if (s > e) {
                    return 1
                } else if (s < e) {
                    return -1;
                } else {
                    return 0;
                }
            }
        );
        let html = "";
        for (let i = 0; i < coinlist.length; i++) {
            html += "<option value=" + coinlist[i].id + ">" + coinlist[i].symbol + "</option>"
        }
        $("#coinlist").append(html);
    });
};

let remove = function (index) {
    chrome.storage.local.get(['coin'], function (object) {
        let coinData = object.coin || [];
        coinData.splice(index, 1);
        chrome.storage.local.set({coin: coinData});
        displayWords();
    });
};

let displayWords = function () {
    chrome.storage.local.get(['coin'], function (object) {
        let display = $('#displayList');
        if (object.coin) {
            searchWords = object.coin;
            let html = "";
            for (let i = 0; i < searchWords.length; i++) {
                let listItem = document.createElement('li');
                html += "<li>" + searchWords[i].coin_name + "\\" + searchWords[i].convert_type + "<span><button id='" + i + "aaaaa'>remove</button></span></spN></li>";
            }
            display.html(html);
        }
    });
};

$("#displayList").on("click","li button",function(){      //只需要找到你点击的是哪个ul里面的就行
    remove($(this)[0].id)
});

document.getElementById('coinSubmit').onclick = function () {
    let coin_id = $('#coinlist option:selected').val();
    let coin_name = $('#coinlist option:selected').text();
    let convert_type = $('#convertlist option:selected').val();
    chrome.storage.local.get(['coin'], function (object) {
        let coinData = object.coin || [];
        coinData.push(
            {
                "coin_id": coin_id,
                "coin_name": coin_name,
                "convert_type": convert_type
            }
        );
        chrome.storage.local.set({coin: coinData});
        displayWords();
    });
    // chrome.tabs.executeScript(null, {
    //     file: 'static/js/content_script.js'
    // });
};

document.getElementById('clearList').onclick = function () {
    chrome.storage.local.clear();
};

coinList();
displayWords();
