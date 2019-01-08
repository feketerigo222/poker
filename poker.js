var cards = [];
var my_hand = [];
var my_rank = 11;
var cpu_rank = 11;
var my_rank_name;
var cpu_rank_name;


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
}

//役判定
rank_judge = (my_hand, my_rank, my_rank_name) => {
    let joker_flg = 0;
    let cnt = 0;
    let current_rank = 11;
    sort(my_hand);
    joker_flg = joker_judge(my_hand, joker_flg);
    cnt = sameNum(my_hand);
    current_rank = various_rank(my_hand, cnt, current_rank, joker_flg);

    if(sameMark(my_hand)){
        if(current_rank > 5){
            current_rank = 5;
        };
    }

    if (stairs_judge(my_hand, joker_flg)) {
        if(sameMark(my_hand)){
            if(current_rank != 0){
                current_rank = rsf(my_hand);
            }
        }else{
            if(current_rank > 6){
                current_rank = 6;
            };
        };
    } ;
    my_rank = current_rank;
    disp_rank(my_rank, my_rank_name);
    returnAce(my_hand);
    if(joker_flg == 1){
        my_hand.push(new Card(4, 15));
    };
}

//最初に並べ替え
sort = (my_hand) => {
    my_hand.sort(function (a, b) {
        if (a.num < b.num) return -1;
        if (a.num > b.num) return 1;
        return 0;
    });
}

//JOKERフラグ判定
joker_judge = (my_hand, joker_flg) => {
    if (my_hand[my_hand.length - 1].mark == 4) {
        my_hand.pop();
        joker_flg = 1;
    };
    return joker_flg;
}

//階段判定
stairs_judge = (my_hand, joker_flg) => {
    if(stairs(my_hand)){
        return true;
    }else if (joker_flg == 1){
        if (joker_stairs(my_hand)){
            return true;
        }else{
            changeAce(my_hand);
            if(joker_stairs(my_hand)){
                return true;
            }else{
                return false;
            };
        };
    }else{
        changeAce(my_hand);
        if(stairs(my_hand)){
            return true;
        }else{
            return false;
        };
    };
}

//数字は階段？
stairs = (my_hand) => {
    let i = my_hand.length;
    while (my_hand[i - 1].num - my_hand[i - 2].num == 1) {
        i--;
        if (i == 1) {
            break;
        };
    };
    if (i == 1) {
        return true;
    } else {
        return false;
    };
}

//Aの変換関数
changeAce = (my_hand) => {
    sort(my_hand);
    while (my_hand[0].num == 1) {
        my_hand[0].num += 13;
        sort(my_hand);
    };
}

//Aを戻す関数
returnAce = (my_hand) =>{
    sort(my_hand);
    while (my_hand[my_hand.length - 1].num == 14){
        my_hand[my_hand.length - 1].num -= 13;
        sort(my_hand);
    };
}

//JOKER使えば作れる？
joker_stairs = (my_hand) => {
    if ((my_hand[3].num - my_hand[2].num == 2 && my_hand[2].num - my_hand[1].num == 1 && my_hand[1].num - my_hand[0].num == 1) ||
        (my_hand[3].num - my_hand[2].num == 1 && my_hand[2].num - my_hand[1].num == 2 && my_hand[1].num - my_hand[0].num == 1) ||
        (my_hand[3].num - my_hand[2].num == 1 && my_hand[2].num - my_hand[1].num == 1 && my_hand[1].num - my_hand[0].num == 2)) {
        return true;
    } else {
        return false;
    };
}

//マークは全て同じ？
sameMark = (my_hand) => {
    let i = 0;
    while (my_hand[i].mark == my_hand[i + 1].mark) {
        i++;
        if (i == my_hand.length - 1) {
            break;
        };
    };
    if (i == my_hand.length - 1) {
        return true;
    } else {
        return false;
    };
}

//ロイヤルストレートフラッシュ判定
rsf = (my_hand, current_rank) => {
    if (my_hand[0].num == 10 || my_hand[my_hand.length - 1].num == 14) {
        current_rank = 1;
        return current_rank;
    } else {
        current_rank = 2;
        return current_rank;
    };
}

//同じ数字の枚数判定
sameNum = (my_hand) => {
    let cnt = 0;
    for (let i = my_hand.length; i >= 2; i--) {
        if (my_hand[i - 1].num == my_hand[i - 2].num) {
            cnt++;
        };
    };
    return cnt;
}

//階段以外の約判定
various_rank = (my_hand, cnt, current_rank, joker_flg) => {
    switch (cnt) {
        case 0:
            switch (joker_flg) {
                case 0:
                    current_rank = 10;
                    return current_rank;
                    break;

                case 1:
                    current_rank = 9;
                    return current_rank;
                    break;
            }
            break;

        case 1:
            switch (joker_flg) {
                case 0:
                    current_rank = 9;
                    return current_rank;
                    break;

                case 1:
                    current_rank = 7;
                    return current_rank;
                    break;
            }
            break;

        case 2:
            if ((my_hand[0].num == my_hand[1].num && my_hand[1].num == my_hand[2].num) ||
                (my_hand[1].num == my_hand[2].num && my_hand[2].num == my_hand[3].num) ||
                (my_hand[my_hand.length - 1].num == my_hand[my_hand.length - 2].num && my_hand[my_hand.length-2].num == my_hand[my_hand.length - 3].num)) {
                switch (joker_flg) {
                    case 0:
                        current_rank = 7;
                        return current_rank;
                        break;

                    case 1:
                        current_rank = 3;
                        return current_rank;
                        break;
                };
                break;
            } else {
                switch (joker_flg) {
                    case 0:
                        current_rank = 8;
                        return current_rank;
                        break;

                    case 1:
                        current_rank = 4;
                        return current_rank;
                        break;
                };
            };
            break;

        case 3:
            if (my_hand[1].num == my_hand[2].num && my_hand[2].num == my_hand[3].num) {
                switch (joker_flg) {
                    case 0:
                        current_rank = 3;
                        return current_rank;
                        break;

                    case 1:
                        current_rank = 0;
                        return current_rank;
                        break;
                };
                break;
            } else {
                current_rank = 4;
                return current_rank;
            };
            break;
    };
}

//役名表示
disp_rank = (my_rank, my_rank_name) =>{
    switch(my_rank){
        case 0:
        my_rank_name = "ファイブカード";
        break;

        case 1:
        my_rank_name = "ロイヤルストレートフラッシュ";
        break;

        case 2:
        my_rank_name = "ストレートフラッシュ";
        break;

        case 3:
        my_rank_name = "フォーカード";
        break;

        case 4:
        my_rank_name = "フルハウス";
        break;

        case 5:
        my_rank_name = "フラッシュ";
        break;

        case 6:
        my_rank_name = "ストレート";
        break;

        case 7:
        my_rank_name = "スリーカード";
        break;

        case 8:
        my_rank_name = "ツーペア";
        break;

        case 9:
        my_rank_name = "ワンペア";
        break;

        case 10:
        my_rank_name = "豚さん";
        break;
    };
    $("#rank_name").text(my_rank_name);
}