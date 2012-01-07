$(function(){
  
  /**
   * Models
   */
  window.Haiku = Backbone.Model.extend({
    defaults: function() {
      return {
      };
    },
    
    initialize: function() { },
    
  });
  
  window.HaikuList = Backbone.Collection.extend({
    model: Haiku,
    
    url: "/a/haikus"
  
  });
  window.Haikus = new HaikuList;
  
  
  /**
   * Views
   */
  var CreateView = Backbone.View.extend({
    el: $('#create-view').remove(),
    
    events: {
      "submit form" : "submit",
      "click .reset" : "reset"
    },
    
    initialize: function() {
    },
    
    render: function() {
      return this;
    },
    
    validate: function() {
      
      var syls = countSyllables(this.$('form .line1').val());
      this.$('form .line1').validateField(
        syls == 5,
        syls + " syllables. Should be 5.",
        "");
      
      syls = countSyllables(this.$('form .line2').val());
      this.$('form .line2').validateField(
        syls == 7,
        syls + " syllables. Should be 5.",
        "");
  
      syls = countSyllables(this.$('form .line3').val());
      this.$('form .line3').validateField(
        syls == 5,
        syls + " syllables. Should be 5.",
        "");
      
      return this.el.parent('form').data('valid');
    },
    
    submit: function() {
      
      this.validate()
      Haikus.create({
        lines: [
          this.$('form .line1').val(),
          this.$('form .line2').val(),
          this.$('form .line3').val()
        ]
      });
      
      this.$('form input').val('');
      
      App.notify('Your haiku has been added!');
      
      return false;
    },
    
    reset: function() {
      this.$('form input[type="text"]').val('');
    }
    
  });
  
  var HaikuView = Backbone.View.extend({
    tagName: "li",
    
    template: _.template($('#haiku-view').html()),
    
    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    }
  });
  
  var HaikusView = Backbone.View.extend({
    el: $('#haikus-view').remove(),
    
    initialize: function() {
      Haikus.bind('add', this.addOne, this);
      Haikus.bind('reset', this.addAll, this);
      Haikus.bind('all', this.render, this);
      Haikus.fetch();
    },
    
    addOne: function(haiku) {
      var view = new HaikuView({model: haiku});
      this.$("#haikulist").append(view.render().el);
    },
    
    addAll: function() {
      this.$("#haikulist").empty();
      Haikus.each(this.addOne);
    }
  });
  
  var AppView = Backbone.View.extend({
    el: $("body"),
    
    events: {
      "click .nav-back" : "goBack",
    },
    
    initialize: function() {
      this.currentView = new CreateView;
      this.render();
    },
    
    render: function() {
      this.$('.view').html(this.currentView.el);
      return this;
    },
    
    goBack: function() {
      this.currentView = new HaikusView;
      this.render();
    },
    
    notify: function(string) {
      var alert = $('<div class="alert-message success container"><a class="close" href="javascript:void(0)">×</a><p>' + string + '</p></div>');
      this.$('.view').prepend(alert);
    }
  });
  
  window.App = new AppView();
});


window.hypher = new Hypher(HypherLang, {minLength: 1} );
function countSyllables(str) {
    // split syllables
    var syllables = hypher.hyphenate(str.replace(/[ \t]+/gi, '-'));
    syllables = _.reduce(syllables, function(mem, syl) { return mem.concat(syl.split('-')); }, []);
    return syllables.length;
}

$.fn.validateField = function(condition, success, error) {
  var fieldset = this.parent('fieldset');
  if (condition) {
    fieldset.removeClass('error');
    fieldset.addClass('success');
  } else {
    fieldset.removeClass('success')
    fieldset.addClass('error');
  }
};
