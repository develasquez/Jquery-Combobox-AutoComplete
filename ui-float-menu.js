    $.fn.floatMenu = function(options){
        var cantIconos = options.length;
        if(options == undefined){
            options ={
                    
                opDefault:{
                    icon:"img/opDefault.png",
                    title:"Opción",
                    id:"opDefault"
                }
            }
        }
        var element = this
        var idElement = $(this).attr("id")
        var hover = false;
        $('#menu'+idElement).remove();
        $('<div />', {
            id:'menu'+idElement
        })
        .addClass('ui-accordion-header ui-state-default ui-state-hover ui-corner-all floatMenu')
        .html('<u>Menu</u>')
        .css("z-index","2000")
        .appendTo('body');

        $.each(options, function(position,option,b,c) { 
                
            $('<img />',{
                src:option.icon,
                title:option.title,
                id:option.id
            }).addClass('icono32').appendTo('#menu'+idElement)
        });

        $('#menu'+idElement).mouseover(function (e) {
            $('#menu'+idElement).show();
            $('#menu'+idElement).height(cantIconos + 48)
            $('#menu'+idElement).width("48px")
            hover = true;
        });
        $('#menu'+idElement).mouseout(function (e) {
            
            $('#menu'+idElement).hide();
            hover = false;

        });
        $('#'+idElement).mouseover(function (e) {
               
            $('#menu'+idElement).show();
            $('#menu'+idElement).height(cantIconos + 48)
            $('#menu'+idElement).width("48px")
            if (hover == false) {
                
                mX = e.pageX - 30 //(!(typeof(parseInt($("#"+idElement).parent().css("left")) =="number"))?0:parseInt($("#"+idElement).parent().css("left"))) - 30;
                mY = e.pageY - 10
                $('#menu'+idElement).css("top", mY)
                $('#menu'+idElement).css("left", mX)
            }
        });
        $('#'+idElement).mouseout(function (e) {
            if (hover == false) {
                $('#menu'+idElement).hide();
            }

        });

        $(".icono32").mousedown(function () {

            $(this).addClass("transparent")
        });
        $(".icono32").mouseup(function () {

            $(this).removeClass("transparent")
        });

        
    
    };