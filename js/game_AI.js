// 原样本中的id经实验无法传入js中，故改用x,y,z参数传入后再用get_id还原id

// 对游戏流程的引导和规则维护主要依靠setNum函数的限制判断，骰子函数也需要限制防止重复投掷
// 对玩家的反馈引导依靠窗口实现

//todo:骰子的一次性使用遇到问题，需要对setNum或者标记全局变量进行
//解决方案1，放置骰子之后将rNum改为0，借用setNum的保护机制无效化

var A_score = 0;// 玩家A的得分
var B_score = 0;// 玩家B的得分
var rNum = 0; // 用于储存骰子的数字
var round = 0; // 0代表A的回合，1代表B的回合(A先手),2代表游戏结束
var rDone = 1; // 1代表可以投掷骰子，0代表骰子已投掷，需要与setNum函数的限制联动
var first=1;//第一回合，B的棋盘是空的
// 利用二维数组储存棋盘的数字，用于后续处理（判断游戏是否结束和计分）
A = [
[0,0,0],
[0,0,0],
[0,0,0]
]
B = [
[0,0,0],
[0,0,0],
[0,0,0]
]
// 可以加入round变量,用于

// 00.该函数用于生成1~6间的随机数，模拟骰子，赋值给全局变量rNum
// randomNum()
function randomNum(){
    if(rDone==1){
        rNum=Math.floor((Math.random()*6) + 1);
        rDone = 0;
        return rNum;
    }else{
        document.getElementById("window").innerHTML = '已投掷过骰子，请先放置';
    }
}


// 01.该函数用于放置骰子
// (x,y)为坐标,z为棋盘区域
function setNum(x,y,z){

    var Tid;
    if(rNum==0){
        document.getElementById("window").innerHTML = '请先投掷骰子';
        return
    }
    if(z!=round&&round!=2){
        // 下错棋盘
        if(round==0){
            document.getElementById("window").innerHTML = '现在是玩家A的回合，请在A的位置放置';
        }else if(round==1){
            document.getElementById("window").innerHTML = '现在是玩家B的回合，请在B的位置放置';
        }else{
            document.getElementById("window").innerHTML = '游戏结束';
        }
    }else{
        // 棋盘正确，接下来考虑是否可下
        if(round==0){
            // A的回合
            if(A[x][y]==0){
                Tid = get_id(x,y,z)
                document.getElementById(Tid).innerHTML = rNum;
                A[x][y] = rNum;
                round = 1;
                attack(x,z);
                rDone = 1; //确保放置成功后，再解锁对骰子的限制
                rNum = 0; //在放置成功后，将rNum重置为0，此时在调用setNum会触发未投掷的保护机制
                document.getElementById("window").innerHTML = '现在是玩家B的回合';


                computer(A,B);//AI放在setnum()的A的回合里面
                round=0;
            }else{
                document.getElementById("window").innerHTML = '该位置已有骰子';
            }
        }else{
            if(B[x][y]==0){
                //computer(A,B);
                Tid = get_id(x,y,z)
                document.getElementById(Tid).innerHTML = rNum;
                B[x][y] = rNum;
                round = 0;
                attack(x,z);
                rDone = 1; //确保放置成功后，再解锁对骰子的限制
                rNum = 0; //在放置成功后，将rNum重置为0，此时在调用setNum会触发未投掷的保护机制
                document.getElementById("window").innerHTML = '现在是玩家A的回合';
            }else{
                document.getElementById("window").innerHTML = '该位置已有骰子';
            }
        }
        //完成骰子放置之后更新回合数（根据全局变量round）
        if(round==0){
            document.getElementById("playerName").innerHTML = 'A';
        }else if(round==1){
            document.getElementById("playerName").innerHTML = 'B';
        }else{
            document.getElementById("playerName").innerHTML = '';
        }

        // 已完成骰子放置，重新解锁投掷骰子（重新解锁环节可能存在问题，需要确保已放置之后再解锁）
        // todo:rDone的重置需要在放置完成后再进行
        // rDone = 1;
    }
    update_score();

    //todo:在这里对进度条的值进行更新
    document.getElementById("VS").value = A_score;
    document.getElementById("VS").max = A_score + B_score;

    // todo:判断游戏结束的函数
    game_over();
}
function computer(){
    //sleep()加动画后再加上去
//    var bt=document.getElementById("#play")
//    bt.click()
    randomNum();
    flag=0;
    //sleep()加动画后再加上去
    //先遍历A的棋盘，如果遇到和rNum相同的数字，就放在B的同一行把A的数字消掉
    for(var i=0;i<3;i++){
        for(var j=0;j<3;j++){
            if(A[i][j]==rNum){
                    for(var k=0;k<3;k++){
                        if(B[i][k]==0){
                              flag=1;
                              Tid = get_id(i,k,1);
                              document.getElementById(Tid).innerHTML = rNum;
                              B[i][k]=rNum;
                              attack(i,1);
                              break;
                        }
                    }
            }
            if(flag)break
        }
        if(flag) break;
    }
    //
    if(!flag){
        for(var i=0;i<3;i++){
        for(var j=0;j<3;j++){
            if(B[i][j]==rNum){
                    for(var k=0;k<3;k++){
                        if(B[i][k]==0){
                              flag=1;
                              Tid = get_id(i,k,1);
                              document.getElementById(Tid).innerHTML = rNum;
                              B[i][k]=rNum;
                              attack(i,1);
                              break;
                        }
                    }
            }
            if(flag)break
        }
        if(flag) break;
    }
    }

    if(!flag){
    for(var  j=0;j<3;j++){
        for(var i=0;i<3;i++){
            if(B[i][j]==0){
                Tid = get_id(i,j,1);
                document.getElementById(Tid).innerHTML = rNum;
                B[i][j]=rNum;
                attack(i,1);
                flag=1;
                break;
            }
        }
        if(flag)break;
    }
   }
    update_score();
    game_over();
    rDone=1;
    rNum=0;
}
//function computer(){
//    randomNum();
//    while(1){
//            var i=Math.floor((Math.random()*2));
//            var j=Math.floor((Math.random()*2));
//            if(B[i][j]==0){
//                Tid = get_id(i,j,1);
//                document.getElementById(Tid).innerHTML = rNum;
//                B[i][j]=rNum;
//                attack(i,1);
//                break;
//            }
//    }
//
//    update_score();
//    game_over();
//    rDone=1;
//    rNum=0;
//}
//一个很蠢的遍历算法
//function computer(){
//    randomNum();
//    flag=0;
//    for(var  i=0;i<3;i++){
//        for(var j=0;j<3;j++){
//            if(B[i][j]==0){
//                Tid = get_id(i,j,1);
//                document.getElementById(Tid).innerHTML = rNum;
//                B[i][j]=rNum;
//                attack(i,1);
//                flag=1;
//                break;
//            }
//        }
//        if(flag)break;
//    }
//    document.getElementById("window").innerHTML = '现在是玩家A的回合，请在A的位置放置';
//    rDone=1;
//    rNum=0;
//    update_score();
//    game_over();
//}
// 02.该函数用于消除对方棋盘上的骰子
// 传入参数为x行数和z我方棋盘，rNum为全局变量（后续可能需要对rNum的变化进行限制）
function attack(x,z){
    var i;
    var Tid;
    if(z==0){
        // 消除对象为B盘
        for(i = 0;i < 3;i++){
            if(B[x][i]==rNum){
                B[x][i] = 0;
                Tid = get_id(x,i,1);
                document.getElementById(Tid).innerHTML = 0;
                // alert("执行"+Tid)//返回的Tid有错误【已解决】
            }
        }
    }else{
        // 消除对象为A盘
        for(i = 0;i < 3;i++){
            if(A[x][i]==rNum){
                A[x][i] = 0;
                Tid = get_id(x,i,0);
                document.getElementById(Tid).innerHTML = 0;
            }
        }
    }
}


// randonNun函数会在新增一个函数之后宕机？(已解决，原因是变量未声明)



// 03.定位模块，该函数利用（x,y,z）生成对应的button id
//在电脑模式不需要作任何修改
function get_id(x,y,z){
    var Tid;
    if(z==0){
        Tid = 'A';
    }else{
        Tid = 'B';
    }
    var tNum = x * 3 + y + 1;
    Tid = Tid + tNum;
    return Tid
}

// 04.计分模块，在每次放置之后进行双方分数的更新，同时通过分数版展示
function update_score(){
    var sum1 = 0;
    var sum2 = 0;
    for(var i = 0;i<3;i++){
        // list用于统计每行的点数分布
        var list1 = [0,0,0,0,0,0,0,0];
        var list2 = [0,0,0,0,0,0,0,0];
        for(var j = 0;j<3;j++){
            //遍历A,B两表，并且每行统计一次分数
            list1[A[i][j]] =  list1[A[i][j]] + 1;
            list2[B[i][j]] =  list2[B[i][j]] + 1;
        }
        //单行统计完毕，将本行的数字累加
        for(var k = 0;k<7;k++){
            sum1 = sum1 + list1[k] * list1[k] * k;
            sum2 = sum2 + list2[k] * list2[k] * k;
        }
    }
    // 对全局变量进行更新
    A_score = sum1;
    B_score = sum2;
    // 对计分板进行更新
    document.getElementById("A_score").innerHTML = A_score;
    document.getElementById("B_score").innerHTML = B_score;

}
// todo:该函数错误
// 05.判断游戏是否结束，拟在每次setNum之后调用
// 如果游戏结束，就将round改变为2
function game_over(){
    var A_counter = 0;
    var B_counter = 0;
    for(var i = 0;i<3;i++){
        for(var j = 0;j<3;j++){
            if(A[i][j]!=0){
                A_counter = A_counter + 1;
            }
            if(B[i][j]!=0){
                B_counter = B_counter + 1;
            }
        }
    }
    if(A_counter==9||B_counter==9){
        round = 2;
        if(A_score>B_score){
            document.getElementById("window").innerHTML = 'A Win!';
        }else if(A_score<B_score){
            document.getElementById("window").innerHTML = 'B Win!';
        }else{
            document.getElementById("window").innerHTML = '平局';
        }

    }
}
(function () {

 let odice = document.querySelector('.dice')
 let oview = document.querySelector('.view')
 let oplay = document.querySelector('#play') // 按钮
 oplay.onclick = playTheGame

 // 当骰子动画执行后
 odice.addEventListener('webkitAnimationEnd', () => {
  odice.style.animationName = 'none' // 更改动画属性，以待下一次动画的正常执行
  // 可能出现的情况集合
  let _posible = [
   { value: 1, x: 0, y: 0 },
   { value: 2, x: 90, y: 0 },
   { value: 3, x: 0, y: -90 },
   { value: 4, x: 0, y: 90 },
   { value: 5, x: -90, y: 0 },
   { value: 6, x: 0, y: 180 },
  ]
  // 准备抽取的随机数
  let _random =randomNum();
  // 抽取的随机结果
  let _result = _posible[_random-1]
  setTimeout(() => { // 浏览器反应不过来加过渡
   // 让骰子旋转到正确的角度
   odice.style.transform = `
    rotateX(${ _result.x }deg) rotateY(${ _result.y }deg)
   `
//   renderView(_result.value) // 渲染视图
  }, 0);

 })

 function playTheGame() { // 游戏方法
  // 骰子转起来
  // 有的时候浏览器在连续使用js操作css的时候会出现问题（反应不过来），比如，效果不能正常显示，此时可以尝试利用setTimeout-0来将目标代码放入到异步队列中等待执行
  // setTimeout(() => {
   odice.style.animationName = 'rotate'
  // }, 0);
 }


// function renderView(result) { // 渲染结果到页面视图
//  oview.innerHTML =_result
// }

})();
