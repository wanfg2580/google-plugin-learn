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
    });
    displayWords()
};

let displayWords = function () {
    console.log("display")
    chrome.storage.local.get(['coin'], function (object) {
        let display = $('#displayList');
        if (object.coin) {
            console.log("coin");
            searchWords = object.coin;
            console.log(searchWords);
            let html = "";
            for (let i = 0; i < searchWords.length; i++) {
                let listItem = document.createElement('li');
                html += "<li>" + searchWords[i].coin_name + "\\" + searchWords[i].convert_type + "<span><button onclick='remove(i)'>remove</button></span></spN></li>";
            }
            display.html(html);
        }
    });
};

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
    });
    // chrome.tabs.executeScript(null, {
    //     file: 'static/js/content_script.js'
    // });
    setTimeout('displayWords()',1000 *5);
    displayWords();
    console.log("get")
};

document.getElementById('clearList').onclick = function () {
    chrome.storage.local.clear();
};

coinList();
displayWords();
