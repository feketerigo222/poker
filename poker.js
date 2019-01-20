var cards = [];
var my_hand = [];
var my_rank = 11;
var cpu_rank = 11;
var my_rank_name;
var cpu_rank_name;
var difficultyNum = 0;


//開始ボタン

start = () => {
    initCard(); //山札セット
    shuffleCard(); //山札シャッフル
    console.log(cards);
    first();
    $("#startbutton").hide();
    $("#changebutton").show();
    $("#judgebutton").show();
}

//手札を引くボタン
first = () => {
    draw(); //手札を引く
    cpu_draw();
    console.log(cpu_hand);
    console.log(cards);
}

//難易度関連
$('[name = difficulty]').change(function () {
    difficultyNum = $('[name = difficulty] option:selected').val();
})


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
    cards[52] = new Card(4, 15);
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
    let imgurl = "";
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
    // console.log(my_hand);
    // console.log(cards);
    dispCard(my_hand);
    my_rank_name = rank(my_hand);
    $("#rank_name").text(my_rank_name);
}

//CPUの手札準備
cpu_draw = () => {
    cpu_hand = cards.slice(0, 5);
    cards.splice(0, 5);
    for (i = 0; i < 5; i++) {
        $("#cpu_disp").append(`<img src = img/0_0.png alt=card${i}>`);
    };
    // $("#deck").append(`<img src = img/0_0.png alt=card${i}>`);
}

//表示カードをクリックしたら画像変更＆class付与
$("#disp").on("click", "img", function () {
    $(this).toggleClass("clicked");
});

//交換するボタン
change = () => {
    let cnt = $(".clicked").length;
    for (let i = 0; i < cnt; i++) {
        let card_src = $(`.clicked:eq(${i})`).attr("src");
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
    let addarray = cards.slice(0, cnt);
    dispCard(addarray);
    Array.prototype.push.apply(my_hand, addarray);
    cards.splice(0, cnt);
    console.log(my_hand);
    console.log(cards);
    my_rank_name = rank(my_hand);
    $("#rank_name").text(my_rank_name);
    $("#changebutton").hide();
}

//役判定＆表示
rank = (my_hand, my_rank, my_rank_name) => {
    my_rank = rank_judge(my_hand);
    my_rank_name = disp_rank(my_rank, my_rank_name);
    return my_rank_name;
}


//勝ち負け判定
showdown = (my_rank, my_hand, cpu_rank, cpu_hand) => {
    console.log(difficultyNum);
    if(difficultyNum == 1){
        cpu_hand = cpuChange(cpu_hand,cpu_rank);
    };
    let imgurl = "";
    $("#cpu_disp img").remove();
    for (i = 0; i < cpu_hand.length; i++) {
        imgurl = `${cpu_hand[i].mark}_${cpu_hand[i].num}`;
        // console.log(imgurl);
        $("#cpu_disp").append(`<img src=img/${imgurl}.png alt=card${i}>`);
    }
    cpu_rank_name = rank(cpu_hand, cpu_rank, cpu_rank_name);
    $("#cpu_rank_name").text(cpu_rank_name);
    my_rank = rank_judge(my_hand);
    cpu_rank = rank_judge(cpu_hand);
    if (my_rank < cpu_rank) {
        $("#result").text("win");
    } else if (my_rank > cpu_rank) {
        $("#result").text("lose");
    } else {
        $("#result").text("draw");
    };
    $("#judgebutton").hide();
    $("#changebutton").hide();
    $("#difficulty").hide();
    $("#onemorebutton").show();
}