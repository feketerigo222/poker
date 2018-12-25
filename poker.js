var cards = [];
var my_hand = [];

//開始ボタン

start = () => {
    initCard(); //山札セット
    shuffleCard(); //山札シャッフル
    console.log(cards);
}

//手札を引くボタン
first = () => {
    draw(); //手札を引く
}


//カードを山札にセット
initCard = () => {
    x = 0;
    for (i = 1; i <= 13; i++) {
        cards[x] = new Card(0, i);
        x++;
        cards[x] = new Card(1, i);
        x++;
        cards[x] = new Card(2, i);
        x++;
        cards[x] = new Card(3, i);
        x++;
    }
    cards[52] = new Card(4, 14);
}

//カードシャッフル
shuffleCard = () => {
    for (i = 0; i < 53; i++) {
        r = Math.floor(Math.random() * 13 * 4);
        w = cards[i];
        cards[i] = cards[r];
        cards[r] = w;
    }
}

function Card(mark, num) {
    this.mark = mark;
    this.num = num;
}

//カードを表示する関数
dispCard = (card) => {
    var imgurl = "";
    for (i = 0; i < card.length; i++) {
        imgurl = `${card[i].mark}_${card[i].num}`;
        // console.log(imgurl);
        $("#disp").append(`<img src=img/${imgurl}.png alt=card${i}>`);
    }
}

//山札から引きつつ山札削除＆表示
draw = () => {
    my_hand = cards.slice(0, 5);
    cards.splice(0, 5);
    console.log(my_hand);
    console.log(cards);
    dispCard(my_hand);
}

//表示カードをクリックしたら画像変更＆class付与
$("#disp").on("click", "img", function () {
    $(this).toggleClass("clicked");
});

//交換するボタン
change = () => {
    var cnt = $(".clicked").length;
    for (var i = 0; i < cnt; i++) {
        var card_src = $(`.clicked:eq(${i})`).attr("src");
        // console.log(card_src);
        card_src = card_src.split("_");
        card_src[0] = card_src[0].replace("img/", "");
        card_src[1] = card_src[1].replace(".png", "");
        // console.log(card_src[0]);
        // console.log(card_src[1]);
        my_hand.some(function (v, i) {
            if (v.mark == card_src[0] && v.num == card_src[1]) my_hand.splice(i, 1); //id:3の要素を削除
        });
    }
    $(".clicked").remove();
    var addarray = cards.slice(0, cnt);
    dispCard(addarray);
    Array.prototype.push.apply(my_hand, addarray);
    cards.splice(0, cnt);
    console.log(my_hand);
    console.log(cards);
}

//役判定