import Ember from 'ember';

var MilestonesEditController = Ember.ObjectController.extend({
  needs: ["application"],
  dueDate: function(){
    return this.get("model.due_on");
  }.property("model.due_on"),
  actions: {
    submit: function() {
      var controller = this;
      this.set("processing",true);

      this.get("model").saveEdit().then(function(milestone){
         controller.send("milestoneUpdated", milestone);
         controller.set("processing",false);
      });
    },
    clearDueDate: function(){
      this.set("model.due_on", null);
    }
  },
  isCollaboratorBinding: "App.repo.is_collaborator",
  disabled: function () {
      return this.get("processing") || !this.get("isValid");
  }.property("processing","isValid"),
  isValid: function () {
    return this.get("model.title");
  }.property("model.title")

});

export default MilestonesEditController;
