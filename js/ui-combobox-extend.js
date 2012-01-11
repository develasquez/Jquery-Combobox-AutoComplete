    $.widget("ui.combobox", {
        source: null,
        params: {},
        label: null,
        value: null,
        required: true,
        onSelect:null,
        store:{},
        template: null,
        
        _carga: function (self, query) {
           
            var params = self.options.params()
            params.query = query;
            $.ajax({
                url: self.options.source,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                type: "POST",
                data: JSON.stringify(params),
                success: function (data) {

                    data = JSON.parse(data.d).data;
                    $("#" +self.options.id).data("store",data)
                    $("#" + self.options.id).html('');
                    $("#" + self.options.id).append('<option selected></option>')
                    $.each(data, function (index, data) {
                
                        $("<option/>",{
                            value:data[self.options.value]
                        })
                        .html(data[self.options.label])
                        .data("store",data)
                        .appendTo("#" + self.options.id)
                    });
                }
            })
        },
        _create: function () {
            var clases = this.element.attr("class")
           
            var self = this
            self.options.id = $(this.element).attr("id")

            this._carga(self, "");
            var select = this.element.hide();
            var selected = select.children(":selected");
            var value = selected.val() ? selected.text() : "";
            var input = this.input = $("<input>")
            .insertAfter(select)
            .val(value)
            .autocomplete({
                delay: 0,
                minLength: 0,
                source: function (request, response) {
                    var params = self.options.params()
                    params.query = "";
                    $.ajax({
                        url: self.options.source,
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        type: "POST",
                        data: JSON.stringify(params),
                        success: function (data) {
                            data = JSON.parse(data.d).data;
                            $("#" +self.options.id).data("store",data)
                            $("#" + self.options.id).html('');
                            $.each(data, function (index, data) {
                                $("<option/>",{
                                    value:data[self.options.value]
                                })
                                .html(data[self.options.label])
                                .data("store",data)
                                .appendTo("#" + self.options.id)
                            });
                            var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
                            response($("#" + self.options.id).children("option").map(function () {
                                var text = $(this).text();
                                if (this.value && (!request.term || matcher.test(text)))
                                    return {
                                        label: text.replace(
                                            new RegExp(
                                                "(?![^&;]+;)(?!<[^<>]*)(" +
                                                $.ui.autocomplete.escapeRegex(request.term) +
                                                ")(?![^<>]*>)(?![^&;]+;)", "gi"
                                                ), "<strong>$1</strong>"),
                                        value: text,
                                        option: this
                                    };
                            }));
                        }
                    });
                },
                select: function (event, ui) {
                    
                    ui.item.option.selected = true;
                    self._trigger("selected", event, {
                        item: ui.item.option
                    });
                    self.selectedItem = ui.item.option
                    try{
                        self.options.onSelect(self.selectedItem);
                    }catch(e){
                    }
                },
                change: function (event, ui) {
                    if (!ui.item) {
					//para limpiar el valor del combo
					select.children("option").each(function () {
                                this.selected = valid = false;
                          });
                        
                        var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex($(this).val()) + "$", "i");
                        valid = false;
                        select.children("option").each(function () {
                            if ($(this).text().match(matcher)) {
                                this.selected = valid = true;
                                return false;
                            }
                        });

                    }
                }
            })
            .addClass("ui-widget ui-widget-content ui-corner-left inputCombo " + clases)
            .attr("placeholder", "Seleccione...")
            if (self.options.required != null) {
                input.attr("required", "required");
            }


            input.data("autocomplete")._renderItem = function (ul, item) {
                var list = $("<li></li>")
                .data("item.autocomplete", item)
                var _template = ""
                if (!self.options.template){
                    _template = ("<a>" + item.label + "</a>");
                }else
                {
                    var template = self.options.template;
                    var lastPos = 0;
                    var otherString = "";
                    var posStart =0;
                    var posEnd = 0;
                    for (i=0;i<template.length; i++){
                        posStart = template.indexOf("{",0);
                        posEnd = template.indexOf("}",0);
                        if (posStart == -1){
                            otherString += template;
                            template = "";
                        }else{
                            otherString += template.substring(0,posStart);
                            otherString += $(item.option).data().store[template.substring(posStart+1,posEnd)];
                            template = template.substring(posEnd +1 , template.length);
                        }
                    }
                    _template = "<a>" + otherString + "</a>";
		}
                list.append(_template)
                return list.appendTo(ul);
            };
           this.button = $("<button type='button'>&nbsp;</button>")
            .attr("tabIndex", -1)
            .attr("title", "Show All Items")
            .insertAfter(input)
            .button({
                icons: {
                    primary: "ui-icon-triangle-1-s"
                },
                text: false
            })
            .removeClass("ui-corner-all")
            .addClass("ui-corner-right ui-button-icon btnCombo")
            .click(function () {
                 debugger;
                if (input.autocomplete("widget").is(":visible")) {
                    input.autocomplete("close");
                    return;
                }

                // work around a bug (likely same cause as #5265)
                $(this).blur();

                // pass empty string as value to search for, displaying all results
                $(this).prev().autocomplete("search", "");
                input.focus();
            });
        },

        destroy: function () {

            this.input.remove();
            this.button.remove();
            this.element.show();
            $.Widget.prototype.destroy.call(this);
        },
        val:function(value){
            debugger;
            if (value != undefined){

                var text = null;
                var opcion = null;
                this.element.children("option").each(function (index,option) {
                    if ($(option).val() == value) {
                        option.selected = true;
                        text = option.text; 
                        opcion = option;
                    }
                });
                this.input.val(text);
                this.options.onSelect(opcion);
            }

            return ((value != undefined )?(((this.element.val()!="") &&
                (this.element.val()!=null) &&
                (this.element.val()!=undefined) &&
                (this.input.val()!=""))? //Verifico que el imput que sigue este vacio
            this.element.val():0):this.element.val())
        },
        getJson : function(option){
            // evaluo si enviaron el parametro option si es asi lo busco dentro del combobox
            // si no viene el parametro obtengo el store del combo 

            var json = null;
            try{
                json = (option?this.element.find(option):this.element).data().store
                }
            catch(e){}
            return json
        },
        isValid : function(){
          
            if (!this.element.val() && (this.element.hasClass('ui-obligatorio') || this.element.attr("required"))  ) {
                this.input.addClass('ui-state-error');
            
                return false;
            }else{
                this.input.removeClass('ui-state-error');
                return true;
            }
        },
        getSelected: function(){
            var opcion = null;
            this.element.children("option").each(function (index,option) {
                if (option.selected) {
                    opcion = option;
                }
            });
            return(opcion);
               
        }
    });

})(jQuery);

