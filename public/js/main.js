$(function(){

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
      var h = new Hypher(HypherLang);
      var syllables = h.hyphenate(this.$('form .line1').val());
      console.log(syllables);
    },
    
    submit: function() {
      this.validate();
      return false;
    },
    
    reset: function() {
      this.$('form input[type="text"]').val('');
    }
    
  });
  
  var AppView = Backbone.View.extend({
    el: $("body"),
    
    events: {
      "click .nav-back-btn" : "goBack"
    },
    
    initialize: function() {
      this.currentView = new CreateView;
      this.render();
    },
    
    render: function() {
      this.$('.view').html(this.currentView.el);
      return this;
    },
    
    goBack: function() {}
  });
  
  window.App = new AppView();
});