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

function displayWords() {
    chrome.storage.local.get(['coin'], function (object) {
        let pageList = document.getElementById('displayWords');
        if (object.coin) {
            searchWords = object.coin;
            for (let i = 0; i < searchWords.length; i++) {
                let listItem = document.createElement('li');
                listItem.innerText = searchWords[i].convert_type;
                pageList.appendChild(listItem);
            }
        }
    });
}

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
    chrome.tabs.executeScript(null, {
        file: 'static/js/content_script.js'
    });
};

document.getElementById('clearList').onclick = function () {
    chrome.storage.local.clear();
};

coinList();
displayWords();
