let getCoinPrice = function() {
    chrome.storage.local.get(['coin'], function (object) {
        if (object.coin) {
            let coinList = object.coin;
            let html = "";
            for (let i = 0; i < coinList.length; i++) {
                let price = getPrice(coinList[i].coin_id, coinList[i].convert_type);
                html += "<li>" + coinList[i].coin_name + "/" + coinList[i].convert_type + ": " + price + "</li>"
            }
            $(".cph-list").html(html);
        }
    });
};

let getPrice = function (coin_id, convert_type) {
    let url = "https://api.coinmarketcap.com/v2/ticker/" + coin_id + "/?convert=" + convert_type;
    $.ajaxSetup({
        async: false
    });
    $.get(url, function (data) {
        price = data.data.quotes[convert_type].price;
    });
    return price;
};

let initPage = function () {
    $(document.body).append("<div class='cph'><div class='cph-list'><ul></ul></div></div>");
};

let lastPriceGet = function() {
    getCoinPrice();
    setTimeout('lastPriceGet()', 60 * 1000);
};

initPage();
// getCoinPrice();
lastPriceGet();
