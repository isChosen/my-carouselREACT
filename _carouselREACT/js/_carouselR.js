
//轮播图
var CarouselBanner = React.createClass({
    getInitialState: function() {
        return {
            data: []
        }
    },
    componentDidMount: function() {
        $.ajax({
            url: this.props.url,
            type: 'GET',
            async: true,
            dataType: 'json',
            success: function(result) {
                if (this.isMounted()) {
                    this.setState({data:result});
                    //轮播效果
                    $('#slideWrapper > li:first').clone().appendTo('#slideWrapper');
                    var singleLiWidth = $('#slideWrapper > li:first').width();
                    var lisLength = $('#slideWrapper > li').length;
                    var currentIndex = 0;
                    var timer;

                    setTimeout(nextClickHandler, 500);  //加载页面时执行一次轮播切换
                    //切换下一张、上一张
                    $('#slide').on('click', function(e) {
                        if (e.target.id == 'next') {
                            nextClickHandler();
                        }
                        if (e.target.id == 'prev') {
                            prevClickHandler();
                        }
                    });
                    //点击图片导航切换图片
                    $('#slideBox span').each(function() {
                        $(this).click(function() {
                            var $flag = $('#slideWrapper').is(':animated');
                            if (!$flag) {
                                var myIndex = $(this).index();
                                currentIndex = myIndex;
                                $('#slideWrapper').animate({left: -currentIndex*singleLiWidth}, 800);
                                listActive();
                            }
                        })
                    });
                    //定时器自动轮播
                    timer = setTimeout(autoCarousel, 2500);
                    //鼠标移进移出slide容器，暂停/继续轮播
                    $('#slide').on({
                        "mouseenter": function() {
                            clearTimeout(timer);
                        },
                        "mouseleave": function() {
                            timer = setTimeout(autoCarousel, 2500);
                        }
                    });
                }
                //图片导航激活时，改变其样式
                function listActive() {
                    $('#slideBox span').eq(currentIndex).addClass("on").siblings().removeClass("on");
                }
                //下一张方法
                function nextClickHandler() {
                    var flag = $('#slideWrapper').is(':animated'); //判断该容器是否处于动画状态，返回布尔值
                    if (!flag) {
                        currentIndex++;
                        $('#slideWrapper').animate({left: -currentIndex*singleLiWidth}, 800, function() {
                            if (currentIndex == lisLength-1) {
                                $(this).css("left",0);
                                currentIndex = 0;
                            }
                            listActive();
                        });
                    }
                }
                //上一张方法
                function prevClickHandler() {
                    var _flag = $('#slideWrapper').is(':animated');
                    if (!_flag) {
                        currentIndex--;
                        if (currentIndex == -1) {
                            $('#slideWrapper').css("left", (lisLength-1)*singleLiWidth * -1);
                            currentIndex = lisLength-2;
                        }
                        $('#slideWrapper').animate({left: -currentIndex*singleLiWidth}, 800);
                        listActive();
                    }
                }
                //自动轮播方法
                function autoCarousel() {
                    var flag = $('#slideWrapper').is(':animated'); //判断该容器是否处于动画状态，返回布尔值
                    if (!flag) {
                        currentIndex++;
                        $('#slideWrapper').animate({left: -currentIndex*singleLiWidth}, 800, function() {
                            if (currentIndex == lisLength - 1) {
                                $(this).css("left",0);
                                currentIndex = 0;
                            }
                            listActive();
                        });
                        timer = setTimeout(autoCarousel, 2500);
                    }
                }
            }.bind(this),
            error: function(xhr, status, err) {
                console.log(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function() {
        return (
            <div id="slide">
                <a id="prev" href="javascript:void(0);">&lt;</a>
                <a id="next" href="javascript:void(0);">&gt;</a>
                <ul id="slideWrapper" className="clearfix">
                    {
                        this.state.data.map(function(item, index) {
                            return (<li key={index}><a href={item.linkTo}><img src={item.imgSrc} alt={item.imgTitle} title={item.imgTitle} /></a></li>)
                        })
                    }
                </ul>
                <div id="slideBox">
                    <span className="on"></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        )
    }
});

ReactDOM.render(
    <CarouselBanner url='http://localhost:63342/_carouselREACT/mocks/tsconfig.json'/>,
    document.getElementById('container')
)