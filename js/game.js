/**
 *
 * HTML文档加载完毕后执行window.onload里的方法，createTime方法创建计时器并设置计时器的初始参数，
 * createRecord方法初始化游戏记录的相关功能，createGame方法设置游戏事件和记录并初始化显示拼图，
 * createButtons方法初始化各个按钮，并添加相关事件。
 * 点击选择难度的按钮时会设置拼图分的块数，点击开始会使计时器开始倒计时，
 * 在剩余时间0s之前通过拖拽左侧拼图的小格进行拼图，拼图完成会提示 ‘挑战成功’，否则提示 ‘超时,挑战失败！’
 *
 *
 *
 */


/*判断标志*/
var sign = false;

/**
 * 初始化图片数组
 * @type {string[]}
 */
var imgs = [
    "./imgs/img0.jpg",
    "./imgs/img1.jpg",
    "./imgs/img2.jpg",
    "./imgs/img3.jpg",
    "./imgs/img4.jpg",
    "./imgs/img5.jpg",
    "./imgs/img6.jpg",
    "./imgs/img7.jpg",
    "./imgs/img8.jpg",
    "./imgs/img9.jpg",
    "./imgs/img10.jpg",
    "./imgs/img11.jpg",
    "./imgs/img12.jpg",
    "./imgs/img14.jpg",
    "./imgs/img18.jpg",
    "./imgs/img19.jpg",
    "./imgs/img20.jpg",
    "./imgs/img21.jpg",
    "./imgs/img22.jpg"
]

/**
 * js事件对象
 *
 */
var EventUtil = {

    /**
     * 添加事件
     */
    addHandler: function (element, type, handler) {
        if (element.addEventListener) {
            //使用DOM2级方法添加事件
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            //使用IE方法添加事件
            element.attachEvent("on" + type, handler);
        } else {
            //使用DOM0级方法添加事件
            element["on" + type] = handler;
        }
    },

    /**
     * 删除事件
     */
    removeHandler: function (element, type, handler) {
        if (event.removeEventListener) {
            //使用DOM2级方法删除事件
            element.removeEventListener(type, handler, false);
        } else if (element.detachEvent) {
            //使用IE方法删除事件
            element.detachEvent("on" + type, handler);
        } else {
            //使用DOM0级方法删除事件
            element["on" + type] = null;
        }
    },

    /**
     * 使用这个方法跨浏览器取得event对象
     */
    getEvent: function (event) {
		
		//如果event为空则event=window.event,生成event对象
        return event ? event : window.event;
    },

    /**
     *
     * 返回事件的实际目标
     *
     */
    getTarget: function (event) {
        return event.target || event.srcElement;
    },

    /**
     * 阻止事件的默认行为
     *
     * 该方法将通知 Web 浏览器不要执行与事件关联的默认动作（如果存在这样的动作）。
     * 例如，如果 type 属性是 "submit"，在事件传播的任意阶段可以调用任意的事件句柄，
     * 通过调用该方法，可以阻止提交表单。注意，如果 Event 对象的 cancelable
     * 属性是 fasle，那么就没有默认动作，或者不能阻止默认动作。无论哪种情况，调用该方法都没有作用。
     **/

    preventDefault: function (event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },


    /**
     * 立即停止事件在DOM中的传播
     * 终止事件在传播过程的捕获、目标处理或起泡阶段进一步传播。
     * 调用该方法后，该节点上处理该事件的处理程序将被调用，事件不再被分派到其他节点
     */
    stopPropagation: function (event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    }
}


/*创建box的方法*/
function createBox(id, side, rightX, rightY) {
    /**
     * 初始化box的ID、side、rightX、rightY、
     * posX、posY、canvasId参数
     */
    var o = new Object();
    o.ID = id;
    o.side = side;
    o.rightX = rightX;
    o.rightY = rightY;
    o.posX = rightX;
    o.posY = rightY;
    o.canvasId = id;

    /*返回box的id*/
    o.getId = function () {
        return this.ID;
    }

    /*返回小格的id*/
    o.getCanvasId = function () {
        return this.canvasId;
    }
    /*设置小格的id*/
    o.setCanvasId = function (newID) {
        this.canvasId = newID;
    }
    /*得到小格的x轴方向的起始点位置*/
    o.getPositionX = function () {
        return this.posX;
    }
    /*得到小格的Y轴方向的起始点位置*/
    o.getPositionY = function () {
        return this.posY;
    }
    /*设置小格的X、Y轴的坐标*/
    o.setPostionXY = function (x, y) {
        this.posX = x;
        this.posY = y;
        //this.dom.style.left=x+"px";
        //this.dom.style.top=y+"px";
    }

    /*检查box的id是否等于等与格的id*/
    o.check = function () {
        if (this.canvasId == this.ID) {
            return true;
        } else {
            return false;
        }
    }

    return o;
}

/**
 * 创建包装器
 */
function createWrapper(side, posX, posY, dom) {
    var o = new Object();

    /**
     * 设置Object对象的side、posX、posY、dom属性的初始值
     */
    o.side = side;
    o.posX = posX;
    o.canvasArr = [];
    o.posY = posY;
    o.dom = dom;

    o.init = function () {

        /*设置属性定位元素的左部位置*/
        dom.style.left = this.posX;
        /*设置属性定位元素的上部位置*/
        dom.style.top = this.posY;

        /*设置元素的宽度*/
        dom.style.width = this.side;
        /*设置元素的高度*/
        dom.style.height = this.side;

        /**
         * 设置元素定位方法的类型
         * static（静态的）、
         * relative（相对的）、
         * absolute（绝对的）、
         * fixed（固定的）
         **/
        dom.style.position = "relative";
    }


    /*添加画布的函数*/
    o.addCanvas = function (canvas) {
        /*将canvas添加到canvasArr数组中*/
        this.canvasArr.push(canvas);
    }

    /**
     * 交换拼图的格子的方法
     * 将box1的格子上的图片移动到box2的格子上
     *
     */
    o.swapBox = function (box1, box2, img) {
        /*获取box1的格子id*/
        var canvasID2 = box2.getCanvasId();
        /*获取box2的格子id*/
        var canvasID1 = box1.getCanvasId();

        /*将box2上的图片移动到box1的格子上*/
        this.canvasArr[canvasID1].draw(box2, img);
        /*设置box2的格子id*/
        box2.setCanvasId(canvasID1);

        /*将box1上的图片移动到box2的格子上*/
        this.canvasArr[canvasID2].draw(box1, img);
        /*设置box1的格子id*/
        box1.setCanvasId(canvasID2);

        将画布上格子box1和box2的id互换
        this.canvasArr[canvasID1].setDomId(box2.getId());
        this.canvasArr[canvasID2].setDomId(box1.getId());
    }

    /**
     * 对左侧的拼图进行随机初始化的方法
     */
    o.random = function (boxes, img) {

        for (var i = 0; i < boxes.length; i++) {

            /*随机产生一个小于等于格子数的正整数r1*/

            var r1 = Math.floor(Math.random() * boxes.length);

            /*随机产生一个小于等于格子数的正整数r2*/
            var r2 = Math.floor(Math.random() * boxes.length);

            /**
             * 调用swapBox()方法将图片随机打乱
             */
            this.swapBox(boxes[r1], boxes[r2], img);
        }
    }

    /**
     * 返回得到posX的方法
     */
    o.getPosX = function () {
        return this.posX;
    }

    /**
     * 返回posY的方法
     */
    o.getPosY = function () {
        return this.posY;
    }

    /**
     * 返回side的方法
     */
    o.getSide = function () {
        return this.side;
    }
    return o;
}

/**
 * 创建一个图形的容器
 * 即创建拼图的一个小格
 * side 长度和宽度
 * posX、posY代表绘图的起始点坐标
 */
function createCanvas(id, side, posX, posY, dom, divDom) {
    var o = new Object();

    /**
     * 初始化对象的id、side、posX、posY、dom、divDom等属性的值
     */
    o.id = id;
    o.side = side;
    o.posX = posX;
    o.posY = posY;
    o.dom = dom;
    o.divDom = divDom;

    /**
     * 设置dom的id
     */
    o.setDomId = function (id) {
        this.divDom.id = id;
    }

    /**
     * 获取dom的id
     */
    o.getDomId = function () {
        return this.divDom.id;
    }

    /**
     * 初始化各种参数
     */
    o.init = function () {
        /*初始化绘制的小格的宽*/
        dom.width = this.side;

        /*初始化绘制的小格的高*/
        dom.height = this.side;
        divDom.id = id;

        /*设置小格可以拖拽*/
        divDom.style.draggable = "true";

        /*设置小格的左部位置*/
        divDom.style.left = this.posX + "px";

        /*设置小格的上侧位置*/
        divDom.style.top = this.posY + "px";

        /*设置小格的宽度*/
        divDom.width = this.side;
        /*设置小格的高度*/
        divDom.height = this.side;
        /*设置小格的边框宽度为1px 颜色为蓝色 右边框是实线 */
        divDom.style.border = "1px blue solid ";

        /*设置小格的最小高度*/

        divDom.style.minHeight = this.side + "px";
        /*设置小格的最小宽度*/

        divDom.style.minWidth = this.side + "px";

        /*设置小格的布局方式为absolute*/
        divDom.style.position = "absolute";
    }

    /**
     * 画出拼图的小格
     */
    o.draw = function (box, img) {

        /*getContext("2d")方法返回一个用于在画布上绘图的2d环境*/
        var context = dom.getContext("2d");

        /*绘制图片*/
        context.drawImage(img, box.getPositionX(), box.getPositionY(), side, side, 0, 0, side, side);
    }
    return o;
}

/**
 * 检查拼图是否完成
 */
function check(boxes) {
    for (var i = 0; i < boxes.length; i++) {
        if (!boxes[i].check()) return false;
    }
    return true;
}

/**
 * 刷新界面
 */
function freshDom() {

    var main = document.createElement("div");
    main.id = "main";
    main.class = "main";
    /**
     * 将game重新刷新
     */
    document.getElementsByClassName("game")[0].replaceChild(main, document.getElementById("main"));
}

function createRecord(easyDom, normalDom, difficultDom, hardDom) {
    /*初始化一个Object对象*/
    var o = new Object();

    /**
     * 设置o对象的easyDom、
     * normalDom、
     * difficultDom、
     * hardDom属性的值
     */
    o.easyDom = easyDom;
    o.normalDom = normalDom;
    o.difficultDom = difficultDom;
    o.hardDom = hardDom;


    /**
     * 显示拼图记录的函数
     */
    o.showRecord = function () {

        /**
         * localStorage.easyRecord：取出存储在浏览器的key=easyRecord的数据
         *如果能取出数据，即localStorage.easyRecord不为空，那么就让
         * easyDom.firstChild.nodeValue 的值等于 localStorage.easyRecord
         * 否则就让easyDom.firstChild.nodeValue等于0
         *
         */
        localStorage.easyRecord ? easyDom.firstChild.nodeValue = localStorage.easyRecord : 0;

        /**
         * 和上一条类似
         */

        localStorage.normalRecord ? normalDom.firstChild.nodeValue = localStorage.normalRecord : 0;
        /**
         * 和上一条类似
         */

        localStorage.difficultRecord ? difficultDom.firstChild.nodeValue = localStorage.difficultRecord : 0;
        /**
         * 和上一条类似
         */

        localStorage.hardRecord ? hardDom.firstChild.nodeValue = localStorage.hardRecord : 0;
    }

    /**
     * 存储游戏记录的方法
     *
     * @param newRecord
     * @param n
     */
    o.savaUserRecord = function (newRecord, n) {

        /**
         * 判断newRecord是否等于0
         */
        if (newRecord != 0) {

            /**
             * 如果不等于0，则通过参数n对游戏记录是什么难度进行区分
             */
            switch (n) {

                /**
                 * n=3执行这段代码
                 * 说明游戏技术记录为简单模式
                 */
                case 3:
                    /**
                     * 如果浏览器存储的简单模式为空，即目前浏览器中没有简单模式的记录
                     * 或者新的要存储的记录的时间小于存储在浏览器的记录的时间
                     *即当前新记录为当前模式下的最好记录
                     *
                     */
                    if (!localStorage.easyRecord || newRecord < localStorage.easyRecord) {

                        /*将新纪录存储到浏览器*/
                        localStorage.easyRecord = newRecord;

                        /**
                         * 调用showRecord方法展示游戏记录
                         *
                         */

                        this.showRecord();
                        //easyDom.firstChild.nodeValue=localStorage.easyRecord;

                    }
                    break;
                /**
                 * n=4执行这段代码
                 * 说明游戏技术记录为一般模式
                 */
                case 4:
                    if (!localStorage.normalRecord || newRecord < localStorage.normalRecord) {
                        localStorage.normalRecord = newRecord;
                        this.showRecord();
                        // normalDom.firstChild.nodeValue=localStorage.normalRecord;
                    }
                    break;
                /**
                 * n=5执行这段代码
                 * 说明游戏技术记录为困难模式
                 */
                case 5:
                    if (!localStorage.difficultRecord || newRecord < localStorage.difficultRecord) {
                        localStorage.difficultRecord = newRecord;
                        this.showRecord();
                        // difficultDom.firstChild.nodeValue=localStorage.difficultRecord;
                    }
                    break;
                /**
                 * n=8执行这段代码
                 * 说明游戏技术记录为地狱模式
                 */
                case 8:
                    if (!localStorage.hardRecord || newRecord < localStorage.hardRecord) {
                        localStorage.hardRecord = newRecord;
                        this.showRecord();
                        // hardDom.firstChild.nodeValue=localStorage.hardRecord;
                    }
                    break;
            }
        }
    }
    return o;
}

function createTime(timeDom, totalTime) {
    /**
     * 生成一个默认的Object对象
     * @type {Object}
     */
    var o = new Object();

    /**
     * 初始化一个倒计时计时器，使他的初始值为空
     * @type {null}
     */
    o.timer = null;
    o.timeDom = timeDom;

    /**
     * 初始化计时器的初始时间为totalTime秒
     */
    o.initTime = totalTime;
    /**
     * 初始化计时器的总时间为totalTime秒
     */
    o.totalTime = totalTime;

    /**
     * 更新计时器显示的时间的方法
     */
    o.updateClock = function () {
        /*判断总时间是否大于0*/
        if (totalTime > 0) {
            /*TRUE      总时间大于0*/

            /**
             * 总时间-1秒
             * @type {number}
             */
            totalTime -= 1;

            /**
             * timeDom的第一个节点的值为减1之后的值
             * firstChild 这句代码等价于目标元素节点下的子元素节点数组[0];
             */
            timeDom.firstChild.nodeValue = totalTime;
        } else {
            /*FALSE   总时间小于0*/

            /**
             * 执行clearInterval()
             * 方法关闭定时器timer
             */
            clearInterval(timer);
        }
    }

    /**
     * 计时器开始计时
     * @param time
     */
    o.startTime = function (time) {
        /**
         * 计时开始时先将timer置为0
         */
        clearInterval(timer);
        /*设置倒计时计时器的总时间*/
        totalTime = time;

        /**
         * 设置计时器的初始时间
         * 由于是倒计时计时器，初始时间和总时间一致
         * 逐渐减小
         *
         */
        initTime = time;

        /**
         * 设置一个定时器,并且设定了等待的时间为1000毫秒即1秒,
         * 当到达时间后,执行updateClock()方法,当方法执行完成,
         * 定时器并没有停止,以后每隔1000毫秒这么长的时间都会重新的执行updateClock()方法,
         * 直到我们手动清除定时器为止;
         *
         * @type {number}
         */
        timer = setInterval(this.updateClock, 1000);
    }

    /**
     *
     * 获得总时间的方法，
     * 调用该方法会得到计时器的总时间
     * @returns {*}
     */
    o.getTotalTime = function () {
        return totalTime;
    }

    /**
     *
     * 获得初始化时间的方法，
     * 调用该方法会得到计时器的初始化时间
     * @returns {*}
     */
    o.getInitTime = function () {
        return this.initTime;
    }

    /*返回创建的这个Object对象*/
    return o;
}


function createGame(timeObject, recorder) {

    /*初始化Object对象*/
    var o = new Object();

    /**
     * 初始化对象的currentBox、
     * img、
     * wrapper、
     * boxes属性的值为空
     *
     * @type {null}
     */
    o.currentBox = null;
    o.img = null;
    o.wrapper = null;
    o.boxes = null;

    /*初始化计时器对象*/
    o.timeObject = timeObject;

    /*初始化游戏记录对象*/
    o.recorder = recorder;


    o.key = 4;

    /*改变拼图图片的方法*/
    o.changeImg = function () {

        /**
         * for循环，从图片库里随机挑选一张图片
         *
         */
        for (var i = 0; i < imgs.length; i++) {

            /**
             * Math.random()方法可返回介于 0 ~ 1 之间的一个随机数。
             * Math.floor(x)方法返回小于等于x的最大整数。
             * @type {number}
             */

            /**
             * 两句总体结果为从imgs集合中随机选取一张照片
             * @type {number}
             */
            var r = Math.floor(Math.random() * imgs.length);
            img.src = imgs[r];
        }
    }

    /**
     *
     *游戏开始计时方法
     * o.startTime调用计时器对象里的startTime方法
     * @param totalTime
     */
    o.startTime = function (totalTime) {
        timeObject.startTime(totalTime);
    }


    /**
     * 游戏初始化方法
     * 在这里设置游戏的初始值
     * @param n
     */
    o.init = function (n) {

        /**
         * n代表左侧拼图每行每列的块数
         * 若n=4则说明拼图为4行4列
         */
        key = n;

        /*获取html中id为img的对象*/
        var img = document.getElementById("img");

        /*获取html中id为main的对象*/
        var wrapDom = document.getElementById("main");

        /*wrapSide代表左侧拼图的总体长和宽为580*/
        var wrapSide = 580;

        /**
         * 调用createWrapper()方法，并返回wrapper对象
         * @type {Object}
         */
        wrapper = new createWrapper(wrapSide, 0, 0, wrapDom);

        /**
         * 调用wrapper的init()方法对wrapper进行初始化
         */
        wrapper.init();

        /*side为左侧拼图每个小块的长和宽*/
        var side = wrapSide / n;

        boxes = [];
        var k = 0;

        for (var i = 0; i < n; i++) {

            /*设置拼图块高的起始坐标*/
            var posY = side * i;
            for (var j = 0; j < n; j++) {

                /*设置拼图块宽的起始坐标*/
                var posX = side * j;

                /*通过指定名称创建一个html元素,这里创建了一个 <div> 标签元素*/
                var divDom = document.createElement('div');

                /*创建一个<canvas>标签元素，<canvas>标签用于绘制图像*/
                var canvasDom = document.createElement('canvas');

                /*调用createCanvas()并返回canvas对象*/
                var canvas = createCanvas(k, side, posX, posY, canvasDom, divDom);
                /*调用canvas的init()方法初始化绘制拼图的各种参数*/
                canvas.init();

                /*左侧拼图的包装器添加小格*/
                wrapper.addCanvas(canvas);

                /*div添加事件*/
                this.addDivAction(divDom);

                /*创建box*/
                var box = createBox(k, side, posX, posY);
                k++;

                /*将这个个添加到拼图的总格具体位置中*/
                boxes.push(box);
                /*绘制图片*/
                canvas.draw(box, img);

                /*将divDom和canvasDom添加到视图中*/
                wrapDom.appendChild(divDom);
                wrapDom.appendChild(canvasDom);
            }
        }
        wrapper.random(boxes, img);
    }

    /**
     * 为div添加事件
     * @param divDom
     */
    o.addDivAction = function (divDom) {

        /**
         * divDom哪个div添加事件
         * touchstart 事件名称
         * function具体事件的方法
         *
         */

        /*拼图开始时执行的事件*/
        EventUtil.addHandler(divDom, "touchstart", function (event) {
            if (sign == false) {
                /*获取当前box的id*/
                currentBox = event.target.id;
                sign = true;
            }
        });

        /*拼图过程中执行的方法*/
        EventUtil.addHandler(divDom, "touchend", function (event) {

            if (currentBox != event.target.id && sign == true) {
                /**
                 * 如果要交换的box不是当前的box并且sign标志为true
                 */

                wrapper.swapBox(boxes[currentBox], boxes[event.target.id], img);

                /*获取拼图所用时间*/
                var totalTime = timeObject.getTotalTime();

                /*获取计时器初始时间*/
                var initTime = timeObject.getInitTime();
                /*如果剩余时间大于0，且拼图成功，则弹出 挑战成功的弹窗 */
                if (totalTime > 0 && check(boxes)) {

                    /**
                     * 将拼图这种模式下的拼图的最好记录存储到浏览器
                     * initTime - totalTime为所用时间
                     * key为哪种模式
                     */
                    recorder.savaUserRecord(initTime - totalTime, key);
                    alert("挑战成功！");
                } else if (totalTime == 0) {
                    alert("超时,挑战失败！");
                }
                sign = false;
            }
        });

        /**
         * 添加dragstart事件
         *
         */
        EventUtil.addHandler(divDom, "dragstart", function (event) {
            currentBox = event.target.id;
        });

        /**
         * 添加dragover事件
         *
         */
        EventUtil.addHandler(divDom, "dragover", function (event) {
            EventUtil.preventDefault(event);
        });
        /**
         * 添加dragenter事件
         *
         */
        EventUtil.addHandler(divDom, "dragenter", function (event) {
            EventUtil.preventDefault(event);
        });
        /**
         * 添加drop事件
         *
         */
        EventUtil.addHandler(divDom, "drop", function (event) {
            EventUtil.preventDefault(event);
            wrapper.swapBox(boxes[currentBox], boxes[event.target.id], img);
            var totalTime = timeObject.getTotalTime();
            var initTime = timeObject.getInitTime();
            if (check(boxes) && totalTime > 0) {
                recorder.savaUserRecord(initTime - totalTime, key);
                alert("挑战成功！");
            } else if (totalTime == 0) {
                alert("超时,挑战失败！");
            }
        });
    }
    return o;
}

/**
 * 创建各种按钮
 * @param buttonDiv
 * @param game
 * @returns {Object}
 */
function createButtons(buttonDiv, game) {
    var o = new Object();

    /**
     * 初始化对象中的buttonDiv、game参数
     */

    o.buttonDiv = buttonDiv;
    o.game = game;

    o.clickHandler = function (event) {

        /**
         * 判断点击的是哪个button
         */
        switch (event.target.id) {

            /*简单模式按钮*/
            case "easy":
                /*刷新拼图的界面*/
                freshDom();
                /*初始化游戏的行和列为3x3*/
                game.init(3);
                break;

            /*一般模式按钮*/
            case "normal":
                freshDom();

                /*初始化游戏的行和列为4x4*/
                game.init(4);
                break;

            /*困难模式按钮*/
            case "difficult":
                freshDom();
                /*初始化游戏的行和列为5x5*/
                game.init(5);
                break;

            /*地狱模式按钮*/
            case "hard":
                freshDom();
                /*初始化游戏的行和列为8x8*/
                game.init(8);
                break;

            /*打乱按钮*/
            case "random":
                /*执行wrapper的random()函数，将拼图随机打乱*/
                wrapper.random(boxes, img);
                break;

            /*换图按钮*/
            case "change":
                /*执行game的changeImg()函数，从图库中随机选择一张图*/
                game.changeImg();
                break;

            /*开始按钮*/
            case "start":
                /*游戏开始，设置开始事件是60秒*/
                game.startTime(60);

                /*执行wrapper的random()函数，将拼图随机打乱*/
                wrapper.random(boxes, img);
                break;
        }
        ;
    }

    /**
     * 初始化
     * 为button添加click事件
     */
    o.init = function () {
        EventUtil.addHandler(buttonDiv, "click", this.clickHandler)
    }
    return o;
}

/*方法用于在网页加载完毕后立刻执行的操作，即当 HTML 文档加载完毕后，立刻执行这个方法*/
window.onload = function () {
    /*getElementById() 方法可返回对拥有指定 ID 的第一个对象的引用
    *
    * 通过id:timer 获取html中的剩余时间<span>对象
    *
    * */
    var timeDom = document.getElementById("timer");

    /**
     * 通过调用createTime方法设置计时器的总时间、开始时间、结束时间等,
     * 返回包含计时器、initTime、totalTime、updateClock()、startTime()
     * 的timeObject对象
     *
     */
    var timeObject = createTime(timeDom, 60);

    /**
     * 通过id:easyRecord
     *       normalRecord
     *       difficultRecord
     *       hardRecord
     *       获取html中的简单、一般、困难、地狱模式的对象
     */

    /*获取简单模式的对象*/
    var easyDom = document.getElementById("easyRecord");
    /*获取一般模式的对象*/
    var normalDom = document.getElementById("normalRecord");
    /*获取困难模式的对象*/
    var difficultDom = document.getElementById("difficultRecord");
    /*获取地狱模式的对象*/
    var hardDom = document.getElementById("hardRecord");


    /**
     * 调用createRecord()方法
     * 将不同模式的对象传递到createRecord方法中
     * 并返回record对象
     *
     */
    var recorder = createRecord(easyDom, normalDom, difficultDom, hardDom);
    /**
     *调用createGame()方法，返回game对象
     * @type {Object}
     */
    var game = createGame(timeObject, recorder);
    /*设置默认的拼图为4x4，即游戏模式为一般难度*/
    game.init(4);
    /**
     * 获取到html中id为choice的对象
     * @type {HTMLElement}
     */
    var buttonDiv = document.getElementById("choice");
    /**
     * 初始化各种按钮的方法
     * @type {Object}
     */
    var buttons = createButtons(buttonDiv, game);
    /**
     * 初始化button
     * 为button添加click事件
     */
    buttons.init();
    /**
     * 显示游戏的最高记录
     */
    recorder.showRecord();
}