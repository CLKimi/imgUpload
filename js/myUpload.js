/**
 * Created by chenlijin on 2017/4/25.
 */
var wholeCity = [];
var chooseData = [];


$('.j-openArea').click(function () {
    $.ajax({
        type: "post",
        url: "json/city.json",
        dataType: "json",
        success: function (json) {
            wholeCity = json.data;
            layer.open({
                type: 1,
                title: '选择可配送区域',
                closeBtn: 0,
                shadeClose: false,
                area: ['1020px', 'auto'],
                content: '<div class="m-chooseContent"><div class="m-selectCity j-wholeCity j-selecting" id="allCity"><p>可选省市区</p><div class="u-cityContent"><ul class="m-treeNode"> <li class="up1 j-father" v-for="item in data" v-bind:areaId="item.areaId"><i></i><a node="1">{{item.areaName}}</a> <ul class="toUp1"> <li class="up2 j-children" v-for="node in item.cities" v-bind:areaId="node.areaId"><i></i><a node="2">{{node.areaName}}</a> <ul class="toUp2"> <li v-for="tip in node.counties" v-bind:areaId="tip.areaId"><a node="3">{{tip.areaName}}</a> </li> </ul> </li> </ul> </li> </ul> </div> </div> <div class="m-chooseBtn"> <button class="u-selectChoose j-add">添加</button> </div> <div class="m-selectCity j-wholeCity j-delete" id="selectCity"> <p>已选省市区</p> <div class="u-cityContent"> <ul class="m-treeNode"> <li class="up1 j-father" v-for="item in data" v-bind:areaId="item.areaId"><i></i><a>{{item.areaName}}</a><img step="1" src="images/i-delete.png"> <ul class="toUp1"> <li class="up2 j-children" v-for="node in item.cities" v-bind:areaId="node.areaId"> <i></i><a>{{node.areaName}}</a><img step="2" src="images/i-delete.png"> <ul class="toUp2"> <li v-for="tip in node.counties" v-bind:areaId="tip.areaId"><a>{{tip.areaName}}</a><img step="3" src="images/i-delete.png"> </li> </ul> </li> </ul> </li> </ul> </div> </div> </div> <p class="m-bottomOption"> <button class="u-blue-btn j-sure">确认</button> <button class="j-cancel">取消</button></p>',
                success: function () {
                    $('.j-cancel').click(function () {
                        layer.closeAll();
                    });
                    $('.j-sure').click(function () {
                        layer.closeAll();
                        $('.selectData').val(JSON.stringify(chooseData));
                    });
                    var whole = new Vue({
                        el: '#allCity',
                        data: {
                            data: wholeCity
                        }
                    });
                    var choose = new Vue({
                        el: '#selectCity',
                        data: {
                            data: chooseData
                        }
                    });


                    $('.j-add').click(function () {
                        $('.j-selecting a').each(function () {
                            if ($(this).hasClass('active')) {
                                var addData = {};
                                var node = $(this).attr('node');
                                var s_areaName = $(this).text();
                                var s_areaId = $(this).parent().attr('areaId');
                                if (node == 1) {
                                    for (var i = 0; i < wholeCity.length; i++) {
                                        if (wholeCity[i].areaId == s_areaId) {
                                            addData = JSON.parse(JSON.stringify(wholeCity[i]));//对象克隆,暂时没找到好办法
                                            for (var i1 = 0; i1 < chooseData.length; i1++) {
                                                if (chooseData[i1].areaId == s_areaId) {
                                                    chooseData.splice(i1, 1);
                                                }
                                            }
                                            chooseData.push(addData);
                                            choose.data = chooseData;
                                        }
                                    }
                                }
                                if (node == 2) {
                                    var c_areaName = $(this).parent().parent().parent().find('>a').text();
                                    var c_areaId = $(this).parent().parent().parent().attr('areaId');
                                    for (var j = 0; j < wholeCity.length; j++) {
                                        if (wholeCity[j].areaId == c_areaId) {
                                            addData = JSON.parse(JSON.stringify(wholeCity[j].cities));
                                            for (var i1 = 0; i1 < chooseData.length; i1++) {
                                                if (chooseData[i1].areaId == c_areaId) {
                                                    for (var k = 0; k < addData.length; k++) {
                                                        if (addData[k].areaId == s_areaId) {
                                                            var addData2 = addData[k];
                                                            for (var k1 = 0; k1 < chooseData[i1].cities.length; k1++) {
                                                                if (chooseData[i1].cities[k1].areaId == s_areaId) {
                                                                    chooseData[i1].cities.splice(k1, 1);
                                                                }
                                                            }
                                                            chooseData[i1].cities.push(addData2);
                                                            choose.data = chooseData;
                                                        }
                                                    }
                                                    return;
                                                }
                                            }
                                            for (var k = 0; k < addData.length; k++) {
                                                if (addData[k].areaId == s_areaId) {
                                                    var addData2 = addData[k];
                                                    var nowData = {
                                                        areaId: c_areaId,
                                                        areaName: c_areaName,
                                                        cities: [addData2]
                                                    };
                                                    chooseData.push(nowData);
                                                    choose.data = chooseData;
                                                }
                                            }
                                        }
                                    }
                                }
                                if (node == 3) {
                                    var c_areaName = $(this).parent().parent().parent().find('>a').text();
                                    var c_areaId = $(this).parent().parent().parent().attr('areaId');
                                    var p_areaName = $(this).parent().parent().parent().parent().parent().find('>a').text();
                                    var p_areaId = $(this).parent().parent().parent().parent().parent().attr('areaId');
                                    if (chooseData.length == 'undefined'|| chooseData.length ==0) {
                                        var checkData={
                                            areaId: p_areaId,
                                            areaName: p_areaName,
                                            cities: [{
                                                areaId: c_areaId,
                                                areaName: c_areaName,
                                                counties:[{
                                                    areaId: s_areaId,
                                                    areaName: s_areaName
                                                } ]
                                            }]
                                        };
                                        chooseData.push(checkData);
                                        choose.data = chooseData;
                                    }
                                    else{
                                        for (var i = 0; i < chooseData.length; i++) {
                                            if (chooseData[i].areaId==p_areaId) {
                                                for(var j = 0; j< chooseData[i].cities.length; j++){
                                                    if (chooseData[i].cities[j].areaId == c_areaId) {
                                                        for(var k = 0; k< chooseData[i].cities[j].counties.length; k++){
                                                            if (chooseData[i].cities[j].counties[k].areaId == s_areaId) {
                                                                chooseData[i].cities[j].counties.splice(k, 1);
                                                            }
                                                        }
                                                        var checkData={
                                                            areaId: s_areaId,
                                                            areaName: s_areaName
                                                        };
                                                        chooseData[i].cities[j].counties.push(checkData);
                                                        choose.data = chooseData;
                                                        return;
                                                    }
                                                }
                                                var checkData={
                                                    areaId: c_areaId,
                                                    areaName: c_areaName,
                                                    counties:[{
                                                        areaId: s_areaId,
                                                        areaName: s_areaName
                                                    } ]
                                                };
                                                chooseData[i].cities.push(checkData);
                                                choose.data = chooseData;
                                                return;
                                            }
                                        }
                                        var checkData={
                                            areaId: p_areaId,
                                            areaName: p_areaName,
                                            cities: [{
                                                areaId: c_areaId,
                                                areaName: c_areaName,
                                                counties:[{
                                                    areaId: s_areaId,
                                                    areaName: s_areaName
                                                } ]
                                            }]
                                        };
                                        chooseData.push(checkData);
                                        choose.data = chooseData;
                                    }
                                }
                            }
                        });
                    });
                }
            });
        },
        error: function () {
        }
    });
});


//第一层菜单
$(document).on('click', '.j-father>i', function () {
    $(this).parent().toggleClass('up1');
    $(this).parent().toggleClass('down1');
});
//第二层菜单
$(document).on('click', '.j-children>i', function () {
    $(this).parent().toggleClass('up2');
    $(this).parent().toggleClass('down2');
});

//菜单选中状态
$(document).on('click', '.j-selecting a', function () {
    $('.j-selecting a').removeClass('active');
    $(this).addClass('active');
});


//显示删除按钮
$(document).on('mouseover', '.j-delete a', function () {
    $(this).parent().find('>img').show();
});
$(document).on('mouseover', '.j-delete img', function () {
    $(this).show();
});
//隐藏删除按钮
$(document).on('mouseout', '.j-delete a', function () {
    $(this).parent().find('>img').hide();
});
//删除城市节点
$(document).on('click', '.j-delete img', function () {
    var stepNode=$(this).attr('step');
    var s_areaName = $(this).parent().find('>a').text();
    var s_areaId = $(this).parent().attr('areaId');
    if(stepNode==1){
        for (var i = 0; i < chooseData.length; i++) {
            if(chooseData[i].areaId == s_areaId){
                chooseData.splice(i, 1);
                return;
            }
        }
    }
    if(stepNode==2){
        var c_areaName = $(this).parent().parent().parent().find('>a').text();
        var c_areaId = $(this).parent().parent().parent().attr('areaId');
        for (var i = 0; i < chooseData.length; i++) {
            if(chooseData[i].areaId == c_areaId){
                if(chooseData[i].cities.length==1){
                    chooseData.splice(i, 1);
                }else{
                    for (var j = 0; j < chooseData[i].cities.length; j++) {
                        if(chooseData[i].cities[j].areaId == s_areaId){
                            chooseData[i].cities.splice(j, 1);
                            return;
                        }
                    }
                }
            }
        }
    }
    if(stepNode==3){
        var c_areaName = $(this).parent().parent().parent().find('>a').text();
        var c_areaId = $(this).parent().parent().parent().attr('areaId');
        var p_areaName = $(this).parent().parent().parent().parent().parent().find('>a').text();
        var p_areaId = $(this).parent().parent().parent().parent().parent().attr('areaId');
        for (var i = 0; i < chooseData.length; i++) {
            if(chooseData[i].areaId == p_areaId){
                if(chooseData[i].cities.length==1){
                    if(chooseData[i].cities[0].counties.length==1){
                        chooseData.splice(i, 1);
                    }else{
                        for (var k = 0; k < chooseData[i].cities[0].counties.length; k++) {
                            if(chooseData[i].cities[0].counties[k].areaId == s_areaId){
                                chooseData[i].cities[0].counties.splice(k, 1);
                                return;
                            }
                        }
                    }
                }else{
                    for (var j = 0; j < chooseData[i].cities.length; j++) {
                        if(chooseData[i].cities[j].areaId == c_areaId){
                            if(chooseData[i].cities[j].counties.length==1){
                                chooseData[i].cities.splice(j, 1);
                            }else{
                                for (var k = 0; k < chooseData[i].cities[j].counties.length; k++) {
                                    if(chooseData[i].cities[j].counties[k].areaId == s_areaId){
                                        chooseData[i].cities[j].counties.splice(k, 1);
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
});