import Ember from 'ember';
import Issue from 'app/models/issue';

var ColumnController = Ember.Controller.extend({
  needs: ["index", "application"],
  style: Ember.computed.alias("controllers.index.column_style"),
  isLastColumn: function(){
    return this.get("controllers.index.model.columns.lastObject.name") === this.get("model.name");
  }.property("controllers.index.model.columns.lastObject"),
  isFirstColumn: function(){
    return this.get("controllers.index.model.columns.firstObject.name") === this.get("model.name");
  }.property("controllers.index.model.columns.firstObject"),
  isCreateVisible: Ember.computed.alias("isFirstColumn"),
  isCollapsed: function(key, value) {
    if(arguments.length > 1) {
      this.set("settings.taskColumn" + this.get("model.index") + "Collapsed", value);
      return value;
    } else {
      return this.get("settings.taskColumn" + this.get("model.index") + "Collapsed");
    }
  }.property(),
  isHovering: false,
  getIssues: function(){
    var index = this.get("model.index");
    var column = this.get("model");
    var issues = this.get("controllers.index.model.combinedIssues").filter(function(i){
      return i.current_state.index === index;
    })
    .filter(function(i) {
      // FIXME: this flag is for archived issue left on the board.
      return !i.get("isArchived");
    })
    .map(function (i){
       i.set("current_state", column);
       return i;
    }).sort(function (a, b){
       return a._data.order - b._data.order;
    });
    return issues;
  },
  issues: function(){
    return this.getIssues();
  }.property("controllers.index.forceRedraw"),
  dragging: false,
  cardMoved : function (cardController, index){
    cardController.send("moved", index, this.get("model"));
  },
  topOrderNumber: function(){
    var issues = this.get("issues");
    if(issues.length){
      return { order: issues.get("firstObject._data.order") / 2 };
    } else {
      return {};
    }
  }.property("issues.@each", "controllers.index.forceRedraw"),
  newIssue: function(){
    return Issue.createNew();
  }.property()
});

export default ColumnController;
