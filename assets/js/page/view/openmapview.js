/**
 * Created by rkh on 2013-12-16.
 */

define(['backbone', 'handlebars', 'text!../templates/openMapTemplate.html'],
    function(Backbone, Handlebars, openMapTemplate) {

        var OpenMapView = Backbone.View.extend({

            className: "overlay-wrapper",
            template: Handlebars.compile( openMapTemplate ),

            events: {
                "click #openmap-open" : "open",
                "click #openmap-cancel" : "cancel"
            },

            open: function(e) {
                e.preventDefault();
                var file = this.$("#fileinput")[0].files[0];
                var reader = new FileReader();
                var that = this;

                if (file) {
                    $(reader).load(function(e) {
                        try {
                            var data = $.parseJSON(e.target.result);

                            Backbone.trigger("openMapEvent", {
                                url: data.url,
                                tilesize: data.tilesize,
                                mapwidth: data.mapwidth,
                                mapheight: data.mapheight,
                                tiles: data.tiles
                            });
                        } catch (e) {
                            that.outputError("File can't be read as a correct Map-json object");
                        }
                    });

                    reader.readAsText(file);
                } else {
                    this.outputError("no file chosen");
                }
            },

            //Outputs error to the form
            outputError: function(error) {
                this.$('#form-validator ul').html("");
                this.$('#form-validator ul').append($('<li>'+error+'</li>'));
                this.$('#form-validator').removeClass("hidden");
            },

            //removes overlay
            cancel: function(e) {
                e.preventDefault();
                this.$el.remove();
            },

            render: function() {
                this.$el.html(this.template(this));
                return this;
            }

        });

        return OpenMapView;
});