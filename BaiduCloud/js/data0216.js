    /**
     * Created by Administrator on 2016/12/30 0030.
     */

    /*
     1.写数据
     2.拿到数据渲染数据
     3.文件夹新建，重命名，删除
     4.鼠标移入改变状态，点击左上角选中，改变状态
     5.重命名，只有一个被选中的时候才可以重命名。弹窗默认是当前文字，
     6.删除，所有勾选的被删除（包括所有有子集），数据别忘记删
     7.右上角，页面有几个文件，显示加载几个文件
     8.全选功能
     9.双击进入子集，面包屑导航
     10.框选，拖拽放入
     */
    //  初始数据
    var data = [
        {
            id: 1,
            name: '秒味课堂',
            pId: 0
        }, {
            id: 2,
            name: '我的应用数据',
            pId: 0
        }, {
            id: 3,
            name: 'HTML5',
            pId: 0
        }
    ];
    var as = document.getElementsByClassName('tools-btn');//新建、重命名、删除
    var gridView = document.getElementsByClassName('grid-view ')[0];//图标视图
    var reName = document.getElementById('reName');//重命名弹窗
    var box = document.getElementsByClassName('box')[0];//重命名input
    var sure = document.getElementsByClassName('sure')[0];//√
    var cancel = document.getElementsByClassName('cancel')[0];//×
    var checkAll = document.getElementById('checkAll');//全选
    var gridViewItems = gridView.children;//所有新建
    var checkboxs = gridView.getElementsByTagName('span');//所有checkbox
    var fileNames = document.getElementsByClassName('file-name');//所有新建名
    var fileAll = document.getElementsByClassName('fileAll')[0];//全部文件
    var historyManager = document.getElementsByClassName('history-manager')[0];//鼠标双击进入显示
    var historyLi = historyManager.getElementsByTagName('li')[1];//鼠标双击进入显示的第二个li
    var disabled = document.getElementsByClassName('disabled')[0];//遮罩层
    var arrSure = [creaSure, renameSure];//把两个确定函数放进数组
    var tipInner = document.getElementById('tip-inner');//提示框
    var tipText = document.getElementsByClassName('tip-text')[0];//提示框文字
    var tipWidth = tipInner.offsetWidth;//提示框自身宽度
    var loadNum = document.getElementsByClassName('load-num')[0];//页面加载数量
    var loadN = 0;//控制加载数量
    var back = document.getElementById('back');//返回上一级
    var all = document.getElementById('all');//返回上一级

    //获取重命名宽高位置
    var asWidth = as[1].offsetWidth;
    var asHeight = as[1].offsetHeight;
    var asLeft = as[1].offsetLeft;
    var asTop = as[1].offsetTop;

    // 双击进入函数
    var arrId = [];//存储双击的ID
    var str = '';//用于设置hash
    var h = null;//截取hash中路径
    var hName = null;//
    var nowPid = 0;//当前pid
    var arrHash = [];//存储hash路径
    var arrData = [];//存储双击过的数据

    var num = data.length;//控制id
    var n = 0;//控制新建文件夹重复后边序号
    var index = null;//知道点击的是新建还是重命名
    var arrChange = [];//放删除的文件夹中的n值
    var createName = '新建文件夹';
    var onOff = true;//全选未选中为true
    var valNum = 1;//重命名后缀
    var isNew = true;//解决连续新建
    var arrChoose = [];
    //右键
    var main = document.getElementById('main');//右键范围层
    var fileMenu = document.getElementById('file-menu');//文件夹右键菜单
    var domMenu = document.getElementById('dom-menu');//空白右键菜单
    var fileLis = fileMenu.getElementsByClassName('item');//文件夹右键菜单中所有li
    var domLis = fileMenu.getElementsByClassName('item');//空白右键菜单中所有li

    //框选
    var pos = {};
    var isDrag = false;//拖拽
    var isRect = false;//框选
    var isDelete = false;
    var boxChoose = document.getElementById('boxChoose');
    var shadow = document.getElementById('shadow');
    var viewMain = document.getElementsByClassName('view-main')[0];
    var isDuang = null;
    var nowId = 0;//当前id

    data.sort(function (a, b) {
        return b.id - a.id;
    });
/*    //渲染数据
    for (var i = 0; i < data.length; i++) {
        create(data[i]);
    }*/
    //  写数据
    function create(info) {
        var gridViewItem = document.createElement('div');
        var fileIcon = document.createElement('div');
        var fileName = document.createElement('div');
        var checkbox = document.createElement('span');
        gridViewItem.className = 'grid-view-item';
        fileIcon.className = 'file-icon';
        fileName.className = 'file-name';
        if (info) {
            fileName.innerHTML = info.name;
        }
        gridViewItem.appendChild(fileIcon);
        gridViewItem.appendChild(fileName);
        gridViewItem.appendChild(checkbox);
        gridView.appendChild(gridViewItem);
        if (info) {
            gridViewItem.num = info.id;
        } else {
            if (data.length){
                gridViewItem.num = data[0].id + 1;
            }
        }
        //鼠标移入改变状态，点击左上角选中，改变状态
        gridViewItem.onmouseover = function () {
            for (var i = 0; i < data.length; i++) {
                if (checkbox.className == '') {
                    this.className += ' back-color-over';
                    checkbox.className = 'checkbox-over';
                }
            }
        };
        gridViewItem.onmouseout = function () {
            for (var i = 0; i < data.length; i++) {
                if (checkbox.className == 'checkbox-over') {
                    this.className = 'grid-view-item';
                    checkbox.className = '';
                }
            }
        };
        checkbox.onclick = function () {
            if (this.className == 'checkbox-over') {
                this.className = 'checkbox-lick';
                gridViewItem.className = 'grid-view-item back-color-lick';
            } else if (this.className == 'checkbox-lick') {
                this.className = 'checkbox-over';
                gridViewItem.className = 'grid-view-item back-color-over';
            }
            isCheck();
        };
        //双击进入子文件夹
        gridViewItem.ondblclick = function () {
            doubleClick(gridViewItem);
        }
    }

    //  新建文件夹
    as[0].onclick = function () {
        if (isNew) {
            isNew = false;
            index = 0;
            create();
            reName.style.display = 'block';
            reName.style.left = '0px';
            box.value = createName;
            box.select();//默认选中input框中的文字
            //把新创建的放在第一位
            if (gridView.children.length >= 2) {
                gridView.insertBefore(gridView.lastElementChild, gridView.firstElementChild);
            }
            isCheck();
        }
    };
    //确定
    sure.onclick = function () {
        isNew = true;
        // 提示框
        tip();
        arrSure[index]();
        //已全部加载，共几个
        loadN = 0;
        for(var i = 0;i<data.length;i++){ if="" (data[i].pid="=" nowpid){="" loadn++;="" }="" loadnum.innerhtml="loadN;" };="" 提示框函数="" function="" tip()="" {="" tipinner.style.marginleft="-tipWidth" 2;="" tipinner.style.display="block" ;="" settimeout(function="" ()="" },="" 1000);="" 弹窗延迟消失函数="" popup()="" rename.style.opacity="0;" rename.style.display="" 300);="" 取消="" cancel.onclick="function" isnew="true;" (index)="" else="" gridview.removechild(gridview.children[0]);="" 全选="" checkall.onclick="function" (onoff)="" this.classname="check-over" for="" (var="" i="0;" <="" gridviewitems.length;="" i++)="" gridviewitems[i].classname="grid-view-item back-color-lick" checkboxs[i].classname="checkbox-lick" disabled.style.width="asWidth" +="" 'px';="" disabled.style.height="asHeight" disabled.style.left="asLeft" disabled.style.top="asTop" onoff="false;" 判断全选函数="" ischeck()="" var="" m="0;" checkboxs.length;="" (checkboxs[i].classname="=" 'checkbox-lick')="" m++;="" (m=""> 1) {//当选中大于1时，遮罩层显示在重命名的位置，不能点击
            disabled.style.width = asWidth + 'px';
            disabled.style.height = asHeight + 'px';
            disabled.style.left = asLeft + 'px';
            disabled.style.top = asTop + 'px';
        } else if (m < 2) {//当选中小于2时，遮罩层恢复初始
            disabled.style.width = '';
            disabled.style.height = '';
            disabled.style.left = '';
            disabled.style.top = '';
        }
        if (m == checkboxs.length && checkboxs.length != 0) {
            checkAll.className = 'check-over';
            onOff = false;
        } else {
            checkAll.className = 'check';
            onOff = true;
        }
    }

    //  删除
    var deData = [];
    fileLis[2].onclick = as[2].onclick = function () {
        tipText.innerHTML = '删除成功';
        for (var i = 0; i < checkboxs.length; i++) {
            if (checkboxs[i].className == 'checkbox-lick') {
                //删除对应数据
                for (var j = 0; j < data.length; j++) {
                    if (data[j].id == gridViewItems[i].num) {
                        //把删除的放进数组，并从小打到排序
                        var prev = data[i].name.substr(createName.length + 1, 1);
                        if (data[i].name == createName) {
                            arrChange.push(prev);
                        }
                        if (Number(prev) > 1) {
                            arrChange.push(prev);
                        }
                        arrChange.sort(function (a, b) {
                            return a - b;
                        });
                        deData.push(data[j]);
                        deFn(data[j]);
                    }
                }
                // console.log(data);
                //删除对应结构
                gridView.removeChild(checkboxs[i].parentNode);
                i--;
                //提示框
                tip();
                if (typeof Number(prev) == 'number') {
                    n--;
                }
            }
        }
        //删除对应文件数据以及文件内所有数据
        for (var i = 0;i<dedata.length;i++){ for="" (var="" j="0;j<data.length;j++){" if="" (dedata[i].id="=" data[j].id){="" data.splice(j,1);="" }="" console.log(data)="" ischeck();="" 已全部加载，共几个="" loadn="0;" for(var="" i="0;i<data.length;i++){" (data[i].pid="=" nowpid){="" loadn++;="" console.log(loadn);="" loadnum.innerhtml="loadN;" };="" 当前文件夹内的所有数据="" function="" defn(obj)="" {="" (data.some(function="" (a){return="" a.pid="=" obj.id})){="" obj.id){="" dedata.push(data[i]);="" return="" defn(data[i]);="" }else{="" return;="" 重命名="" filelis[1].onclick="as[1].onclick" =="" ()="" index="1;" <="" checkboxs.length;="" i++)="" (checkboxs[i].classname="=" 'checkbox-lick')="" rename.style.left="checkboxs[i].parentNode.offsetLeft" +="" 'px';="" rename.style.display="block" ;="" box.value="fileNames[i].innerHTML;" box.select();="" 新建确定函数="" creasure()="" tiptext.innerhtml="新建成功" 判断执行删除数据还是执行n值="" (arrchange.length)="" 如果有删除数据="" (box.value="=" createname)="" 新建默认值不改变="" 判断删除数组中第一位是不是空字符串，为空执行第一个，否则执行第二个="" (arrchange[0]="=" '')="" filenames[0].innerhtml="createName" else="" '('="" arrchange[0]="" ')';="" 执行过就表示在页面中已经生成了新的数据，后缀为删除数据的第一个，页面中有的话，删除数组中也要删除="" arrchange.splice(0,="" 1);="" 没有删除或者没有重命名执行="" (!n)="" 初始化新建="" !="createName)" 新建默认值改变时n值不累计="" n--;="" 新建文件夹名为默认值="" 不是初始化新建时，文件名重命名="" 不是初始新建，新建默认值不变="" (n="" 1)="" 每次新建进行n++="" n++;="" num++;="" var="" j.id="num;//新建文件夹id" j.name="fileNames[0].innerHTML;" (arrid.length)="" j.pid="arrId[arrId.length" -="" 1];="" data.push(j);="" console.log(data);="" 弹窗消失="" popup();="" 每次数据排序按id从大到小，删除的能与数据同步="" data.length;="" data.sort(function="" (a,="" b)="" b.id="" a.id;="" });="" 重命名确定函数="" renamesure()="" arrfile="[];" arrequal="[];" 循环所有checkboxs="" 拿到被选中的checkbox="" 判断是重命名有没有改变，哪一个文件夹名改变="" (filenames[i].innerhtml="" gridviewitems[i].classname="grid-view-item" checkboxs[i].classname="" 把重命名的后缀记录放进数组="" prev="fileNames[i].innerHTML.substr(createName.length" 1,="" arrchange.push(prev);="" (number(prev)=""> 1) {
                        arrChange.push(prev);
                    }
                    arrChange.sort(function (a, b) {
                        return a - b;
                    });
                    for (var j = 0; j < fileNames.length; j++) {
                        arrFile.push(fileNames[j].innerHTML);
                    }
                    arrFile.splice(i, 1);
                    if (arrFile.some(function (a) {
                            return a == box.value
                        })) {//有重命名的进
                        for (var j = 0; j < arrFile.length; j++) {//循环所有有已有名字
                            if (box.value == arrFile[j].substr(0, box.value.length)) {//前几位相等就进来
                                if (arrFile[j].length == box.value.length + 3) {
                                    if (arrFile[j].substr(box.value.length, 1) == '(') {
                                        if (typeof Number(arrFile[j].substr(box.value.length + 1, 1)) == 'number') {
                                            if (arrFile[j].substr(box.value.length + 2, 1) == ')') {
                                                //进来的都是可以后缀排序的
                                                arrEqual.push(arrFile[j].substr(box.value.length + 1, 1));
                                            }
                                        }
                                    }
                                }
                                console.log(arrEqual);
                                if (box.value == arrFile[j]) {//重命名与已有名字完全相等
                                    valNum++;
                                    if (arrEqual.some(function (a) {
                                            return a == valNum
                                        })) {
                                        for (var k = 0; k < arrEqual.length; k++) {
                                            if (valNum == arrEqual[k]) {
                                                fileNames[i].innerHTML = box.value + '(' + arrEqual[k] + ')';
                                            }
                                        }
                                    } else {
                                        console.log(valNum);
                                        fileNames[i].innerHTML = box.value + '(' + valNum + ')';
                                    }
                                }
                            }
                        }
                    } else {
                        // alert(1)
                        fileNames[i].innerHTML = box.value;
                        data[i].name = fileNames[i].innerHTML;//改变数据中对应的name
                    }
                } else {
                    reName.style.display = '';
                }
            }
        }
    }

    //双击进入函数
    function doubleClick(gridViewItem) {
        // gridView.innerHTML = '';
        fileAll.style.display = 'none';
        historyManager.style.display = 'block';
        //把双击的id 放进arrId数组里
        arrId.push(gridViewItem.num);
        //把双击的数据存进数组里
        for (var i = 0;i<data.length;i++){ if="" (gridviewitem.num="=" data[i].id){="" arrdata.push(data[i]);="" }="" 设置hash值="" str="" +="gridViewItem.children[1].innerHTML" '="" ';="" location.hash="#path=" str;="" 把当前的hash值放入数组="" arrhash.push(location.hash);="" 当前pid="" nowpid="gridViewItem.num;" 生成面包屑导航函数="" function="" navcreate()="" {="" arrid长度大于等于2时，才可以生成a标签，="" (arrid.length="">= 2) {
            for(var i = 0;i<arrid.length-1;i++){ for(var="" j="0;j<data.length;j++){" if="" (data[j].id="=" arrid[i]){="" createa(data[j].name);="" }="" 生成span标签="" var="" span="document.createElement('span');" for="" (var="" i="0;i<data.length;i++){" (data[i].id="=" arrid[arrid.length-1]){="" span.innerhtml="data[i].name;" historyli.appendchild(span);="" 一条a标签数据="" function="" createa(stra)="" {="" a="document.createElement('a');" spanarrow="document.createElement('span');" a.href="javascript:;" ;="" a.innerhtml="strA;" spanarrow.classname="history-manager-separator-arrow" spanarrow.innerhtml=">" historyli.appendchild(a);="" historyli.appendchild(spanarrow);="" a.onclick="function" ()="" 给a标签设置hash值="" h="arrHash[i].split('=')[1].split('/');" hname="h[h.length-2];" (a.innerhtml="=" hname){="" location.hash="arrHash[i];" str="arrHash[i].split('=')[1];" 返回上一级="" back.onclick="function" 每返回上级，arrhsh删除一位最后值="" arrhash.pop();="" 设置hash值，每次返回hash值取arrhsh中的最后一位="" (arrhash.length){="" }else="" arrhash为空时，location.hash值为空="" fileall.style.display="block" historymanager.style.display="" };="" 全部文件="" all.onclick="function" 根据hash值重新渲染页面="" window.onload="window.onhashchange" =="" hash值改变，文件夹列表，面包屑导航清空="" gridview.innerhtml="" historyli.innerhtml="" (location.hash="=" ''){="" 返回第一级时，数据清空="" nowpid="0;" arrid="[];" arrhash="[];" 截取hash路径中最后一个文件名="" 每次根据hash值找到当前pid，arrid根据hash改变跟着改变="" <="" data.length;="" i++)="" (data[i].name="=" hname)="" (arrid[j]="=" data[i].id){="" arrid.splice(j+1);="" 根据当前hash值截取剩下的arrhash，="" (arrhash[i]="=" location.hash){="" arrhash.splice(i+1);="" 根据hash值重新渲染面包屑导航="" navcreate();="" 根据hash值重新渲染文件夹列表="" loadn="0;" (data[i].pid="=" nowpid){="" create(data[i]);="" loadn++;="" loadnum.innerhtml="loadN;" ischeck();="" 右键菜单="" main.oncontextmenu="function" (ev)="" 阻止默认行为="" ev.preventdefault();="" l="ev.clientX;" t="ev.clientY;" (ev.target.parentnode="=" gridview="" ||="" ev.target.parentnode.parentnode="=" gridview){="" 在文件夹上右键="" filemenu.style.display="block" dommenu.style.display="none" filemenu.style.left="l" +="" 'px';="" filemenu.style.top="t" 不在文件加上右键="" dommenu.style.left="l" dommenu.style.top="t" 在文件夹上右键，选中当前="" gridviewitems[i].children[2].classname="" gridviewitems[i].classname="grid-view-item" ev.target.children[2].classname="checkbox-lick" ev.target.classname="grid-view-item back-color-lick" (ev.target.parentnode.parentnode="=" ev.target.parentnode.children[2].classname="checkbox-lick" ev.target.parentnode.classname="grid-view-item back-color-lick" 点击document右键菜单消失="" document.onclick="function" 右键打开="" filelis[0].onclick="function" (gridviewitems[i].children[2].classname="=" 'checkbox-lick'){="" doubleclick(gridviewitems[i]);="" 框选="" viewmain.onmousedown="function" arrchoose="[];//每次按下先清空，重现帅选选中的文件夹" pos.x="ev.clientX;" pos.y="ev.clientY;" 在文件夹上按下="" 在文件夹父级按下="" (ev.target.children[2]){="" 在文件夹父级按下如果文件夹选中移动实现拖拽="" (ev.target.children[2].classname="=" isdrag="true;" 在文件夹父级按下如果文件夹未选中移动实现框选="" isrect="true;" 在文件夹子集按下="" 在文件夹子集按下如果文件夹选中移动实现拖拽="" (ev.target.parentnode.children[2].classname="=" 在文件夹子集按下如果文件夹未选中移动实现框选="" 不在文件夹上按下移动实现框选="" 把当前页面选中的文件放入arrchoose中="" (gridviewitems[i].classname="=" 'grid-view-item="" back-color-lick'){="" arrchoose.push(gridviewitems[i]);="" console.log(isdrag,isrect);="" 弹窗显示时，不能框选="" (rename.style.display="=" 'block'){="" document.onmousemove="function" 画方块="" (isrect){="" w="Math.abs(l-pos.x);" il="l<pos.x?l:pos.x;" it="t<pos.y?t:pos.y;" boxchoose.style.left="iL" boxchoose.style.top="iT" boxchoose.style.width="w" boxchoose.style.height="h" if(duang(boxchoose,gridviewitems[i])){="" 碰到的="" checkboxs[i].classname="checkbox-lick" }else{="" 没碰到的="" 拖拽="" (isdrag){="" newl="ev.clientX;" newt="ev.clientY;" shadow.style.display="block" shadow.style.left="newL" shadow.style.top="newT" shadow.innerhtml="arrChoose.length;" if(duang(shadow,gridviewitems[i])){="" 如果碰到的的文件夹与选中的文件夹都不相等，说明拖到了其他未选中的文件夹="" (arrchoose.every(function="" (a){return="" !="gridViewItems[i]})){" 记录拖到的文件夹的名字="" isduang="gridViewItems[i].children[1].innerHTML;" isdelete="true;" document.onmouseup="function" boxchoose.style.csstext="" shadow.style.csstext="" (isdelete){="" 循环所有数据="" 拿到当前pid下的所有数据="" 拿到当前pid下与碰撞文件夹名字相同的id="" isduang){="" nowid="data[i].id;" console.log(nowid);="" 拿到选中的数据，并把选中的数据pid改为上边记录的nowid="" arrchoose[j].children[1].innerhtml){="" data[i].pid="nowId;" console.log(data)="" 删除结构="" (gridviewitems[i]="=" arrchoose[j]){="" gridview.removechild(gridviewitems[i]);="" 已全部加载，共几个="" 碰撞检测="" duang(obj1,="" obj2)="" pos1="obj1.getBoundingClientRect();" pos2="obj2.getBoundingClientRect();" (pos1.right="" pos2.left="" pos1.bottom="" pos2.top="" pos1.left=""> pos2.right || pos1.top > pos2.bottom) {
            return false;
        } else {
            return true;
        }
    }
    /*
        问题
            1.新建重命名
            2.利用截取hash值在数据中找id，截取hash值有可能相同，
            3.右键菜单，功能实现不完整
     * */</arrid.length-1;i++){></data.length;i++){></dedata.length;i++){></data.length;i++){>