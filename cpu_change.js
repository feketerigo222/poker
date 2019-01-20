cpuChange =(cpu_hand,cpu_rank)=>{
    cpu_hand = cpuSplice(cpu_hand,cpu_rank);
    cpu_hand = cpuAdd(cpu_hand);
    returnAce(cpu_hand);
    return cpu_hand;
}

cpuSplice = (cpu_hand, cpu_rank) => {
    cpu_rank = rank_judge(cpu_hand);
    let joker_flg = 0;
    joker_flg = joker_judge(cpu_hand, joker_flg);
    switch (joker_flg) {
        case 0:
            cpu_hand = normalCpuChange(cpu_hand, cpu_rank);
            return cpu_hand;
            break;
            
            case 1:
            cpu_hand = jokerCpuChange(cpu_hand, cpu_rank);
            returnAce(cpu_hand);
            cpu_hand.push(new Card(4, 15));
            return cpu_hand;
            break;
        };
    // returnAce(cpu_hand);
    console.log(cpu_hand);
}

cpuAdd =(cpu_hand)=>{
    
    let addarray = cards.slice(0, 5 - cpu_hand.length);
    cards.splice(0, 5 - cpu_hand.length);
    Array.prototype.push.apply(cpu_hand, addarray);
    console.log(cpu_hand);
    return cpu_hand;
}

normalCpuChange = (cpu_hand, cpu_rank) => {
    sort(cpu_hand);
    cpu_rank = rank_judge(cpu_hand);
    switch (cpu_rank) {
        case 10:
            // cpu_hand = sameMarkMock(cpu_hand);
            // console.log(cpu_hand.length);
            // if (cpu_hand.length == 5) {
            //     cpu_hand = stairMock(cpu_hand);
            //     return cpu_hand;
            // }
            // console.log(cpu_hand.length);
            // if (cpu_hand.length == 5) {
            //     cpu_hand = sameThreeMark(cpu_hand);
            //     return cpu_hand;
            // };
            // console.log(cpu_hand.length);
            // if (cpu_hand.length == 5) {
            //     cpu_hand = [];
            //     return cpu_hand;
            // };
            // return cpu_hand;
            // break;

            cpu_hand = sameMarkMock(cpu_hand);            
            if (cpu_hand.length == 4) {
                return cpu_hand;
                break;
            }
            cpu_hand = stairMock(cpu_hand);
            if (cpu_hand.length == 4) {
                return cpu_hand;
                break;
            }
            cpu_hand = sameThreeMark(cpu_hand);            
            if (cpu_hand.length == 3) {
                return cpu_hand;
                break;
            }            
            cpu_hand = [];
            return cpu_hand;
            break;

        case 9:
            cpu_hand = sameMarkMock(cpu_hand);
            if (cpu_hand.length == 4) {
                return cpu_hand;
                break;
            };
            cpu_hand = stairMock(cpu_hand);
            if (cpu_hand.length == 4) {
                return cpu_hand;
                break;
            };
            cpu_hand = onePairSampling(cpu_hand);
            return cpu_hand;
            break;

        case 8:
            cpu_hand = twoPairSampling(cpu_hand);
            return cpu_hand;
            break;

        case 7:
            cpu_hand = threeCardSampling(cpu_hand);
            return cpu_hand;
            break;
    };
    return cpu_hand;
}

jokerCpuChange = (cpu_hand, cpu_rank) => {
    sort(cpu_hand);
    switch (cpu_rank) {
        case 9:
            cpu_hand = sameMarkMock(cpu_hand);
            if (cpu_hand.length == 3) {
                return cpu_hand
                break;
            };
            cpu_hand = onePairstairMock(cpu_hand);
            if (cpu_hand.length == 3) {
                return cpu_hand;
                break;
            };
            cpu_hand = [];
            return cpu_hand;
            break;

        case 7:
            cpu_hand = jokerThreeCardSampling(cpu_hand);
            return cpu_hand;
            break;
    };
}


//同じマーク4つ？
sameMarkMock = (cpu_hand) => {
    let cpu_hand2 = cpu_hand.slice();
    for (var i = 0; i < cpu_hand.length; i++) {
        cpu_hand2.splice(i, 1);
        // console.log(cpu_hand2);
        if (sameMark(cpu_hand2)) {
            return cpu_hand2;
            break;
        };
        cpu_hand2 = cpu_hand.slice();
        // console.log(cpu_hand2);
    };
    return cpu_hand2;
}

//豚さんの時階段なりそう？
stairMock = (cpu_hand, joker_flg) => {
    sort(cpu_hand);
    let cpu_hand2 = cpu_hand.slice();
    joker_flg = 1;
    for (var i = 0; i < 5; i++) {
        cpu_hand2.splice(i, 1);
        console.log(joker_flg);
        if (stairs_judge(cpu_hand2, joker_flg)) {
            returnAce(cpu_hand2);
            return cpu_hand2;
            break;
        };
        cpu_hand2 = cpu_hand.slice();
        returnAce(cpu_hand);
    };
    joker_flg = 0;
    return cpu_hand2;
}

//豚の時マーク3つ？
sameThreeMark = (cpu_hand) => {
    let cpu_hand2 = cpu_hand.slice();
    for (var i = 0; i < 4; i++) {
        cpu_hand2.splice(i, 1);
        let cpu_hand3 = cpu_hand2.slice();
        for (var j = i; j < 4; j++) {
            cpu_hand3.splice(j, 1);
            if (sameMark(cpu_hand3)) {
                return cpu_hand3;
                break;
            };
            cpu_hand3 = cpu_hand2.slice();
        };
        if (cpu_hand.length == 3) {
            return cpu_hand3;
            break;
        };
        cpu_hand2 = cpu_hand.slice();
    };
    if (cpu_hand.length == 3) {
        return cpu_hand3;
    } else {
        return cpu_hand2
    };
}

//ワンペア時、ペアの2枚を取る
onePairSampling = (cpu_hand) => {
    sort(cpu_hand);
    for (var i = 0; cpu_hand[i].num != cpu_hand[i + 1].num; i++) {};
    cpu_hand = cpu_hand.splice(i, 2);
    return cpu_hand;
}

//ツーペア時、残りの一枚を抜き取る
twoPairSampling = (cpu_hand) => {
    sort(cpu_hand);
    if (cpu_hand[1].num == cpu_hand[2].num && cpu_hand[3].num == cpu_hand[4].num) {
        cpu_hand.splice(0, 1);
        return cpu_hand;
    } else if (cpu_hand[0].num == cpu_hand[1].num && cpu_hand[3].num == cpu_hand[4].num) {
        cpu_hand.splice(2, 1);
        return cpu_hand;
    } else if (cpu_hand[0].num == cpu_hand[1].num && cpu_hand[2].num == cpu_hand[3].num) {
        cpu_hand.splice(4, 1);
    };
    return cpu_hand;
}

//スリーカード時に三枚を抜き出す
threeCardSampling = (cpu_hand) => {
    sort(cpu_hand);
    if (cpu_hand[0].num == cpu_hand[1].num && cpu_hand[1].num == cpu_hand[2].num) {
        cpu_hand.splice(3, 2);
    } else if (cpu_hand[1].num == cpu_hand[2].num && cpu_hand[2].num == cpu_hand[3].num) {
        cpu_hand.splice(0, 1);
        cpu_hand.splice(3, 1);
    } else if (cpu_hand[2].num == cpu_hand[3].num && cpu_hand[3].num == cpu_hand[4].num) {
        cpu_hand.splice(0, 2);
    };
    return cpu_hand;
}

//ジョーカー所持時、３枚で階段もどきが出来るか？
onePairstairMock = (cpu_hand) => {
    sort(cpu_hand);
    let cpu_hand2 = cpu_hand.slice();
    let joker_flg = 1;
    for (var i = 0; i < 5; i++) {
        cpu_hand2.splice(i, 1);
        if (jokerStairsMockJudge(cpu_hand2, joker_flg)) {
            returnAce(cpu_hand2);
            return cpu_hand2;
            break;
        };
        cpu_hand2 = cpu_hand.slice();
    };
    joker_flg = 0;
    return cpu_hand2;
}


jokerStairsMockJudge = (my_hand, joker_flg) => {
    if (stairs(my_hand)) {
        return true;
    } else if (joker_flg == 1) {
        if (jokerStairsMock(my_hand)) {
            return true;
        } else {
            changeAce(my_hand);
            if (jokerStairsMock(my_hand)) {
                return true;
            } else {
                return false;
            };
        };
    } else {
        changeAce(my_hand);
        if (stairs(my_hand)) {
            return true;
        } else {
            return false;
        };
    };
}

jokerStairsMock = (cpu_hand) => {
    if ((cpu_hand[2].num - cpu_hand[1].num == 2 && cpu_hand[1].num - cpu_hand[0].num == 1) ||
        (cpu_hand[2].num - cpu_hand[1].num == 1 && cpu_hand[1].num - cpu_hand[0].num == 2)) {
        return true;
    } else {
        return false;
    };
}

//ジョーカー所持時、ペア2枚を抜き出す
jokerThreeCardSampling = (cpu_hand) => {
    sort(cpu_hand);
    if (cpu_hand[0].num == cpu_hand[1].num) {
        cpu_hand.splice(2, 2);
    } else if (cpu_hand[1].num == cpu_hand[2].num) {
        cpu_hand.splice(0, 1);
        cpu_hand.splice(2, 1);
    } else if (cpu_hand[2].num == cpu_hand[3].num) {
        cpu_hand.splice(2, 2);
    };
    return cpu_hand;
}