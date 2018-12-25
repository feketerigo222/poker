var cards = [];

//開始ボタン
function start() {
    initCard();
    shuffleCard();    
}

//カードを山札にセット
function initCard() {
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

//カードを表示する関数
function dispCard(card) {    
    var imgurl = ""; 
    for (i = 0; i < card.length; i++) {        
        imgurl = `${card[i].mark}_${card[i].num}`;
        console.log(imgurl);
        $("#disp").append(`<img src=img/${imgurl}.png alt=card${i}>`);
    }      
}

//カードシャッフル
function shuffleCard() {
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

console.log(cards);

var my_hand = [];

//手札を引くボタン
first = () => {
    draw();
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
$("#disp").on("click","img",function(){
    $(this).toggleClass("clicked");
});



//交換するボタン
change =()=>{
        var cnt = $(".clicked").length;
        var a = $(".clicked").attr("src");
        console.log(a);
        $(".clicked").remove();
        var addarray = cards.slice(0,cnt);
        dispCard(addarray);
        Array.prototype.push.apply(my_hand, addarray);
        cards.splice(0,cnt);
        console.log(my_hand);
        console.log(cards);
}