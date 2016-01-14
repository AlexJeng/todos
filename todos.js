Todos = DRINK THIS WEEKEND

if (Meteor.isClient) {
  todosSub = Meteor.subscribe('todos');

  Template.TodosPanel.helpers({
    items: function(){
      return Todos.find({}, {
        sort: {
          created_at: -1
        }
      });
    },
    isDoneClass: function(){
      return this.is_done ? 'done' : '';
    }
  });

  Template.TodoItem.helpers({
    isDoneChecked: function(){
      // this is the todo item, itself
      return this.is_done ? 'checked' : '';[]
    }
  });

  Template.TodoItem.events({
    'click [name=is_done]': function(e, tmpl){
      var id = this._id;
      // like jquery find method to grab input checkbox element
      var isDone = tmpl.find('input').checked;
      Todos.update({_id: id}, {
        $set: {
          is_done: isDone
        }
      });
    }
  });

  Template.CreateTodoItem.events({
    'submit form': function(e, tmpl){
      // prevent default so don't post back to server
      e.preventDefault();
      // grab inputted value
      var subject = tmpl.find('input').value
      Todos.insert({
        subject: subject, 
        created_at: new Date,
        is_done: false,
        user_id: Meteor.userId()
      });
      var form = tmpl.find('form');
      form.reset();
    }
  });

  Template.TodosCount.helpers({
    completedCount: function(){
      return Todos.find({is_done: true}).count();
    },
    totalCount: function(){
      return Todos.find().count();
    }
  });

}

if (Meteor.isServer) {
  Meteor.publish('todos', function(){
    // returns a cursor (the result of a find method call on a collection) -> auto sends out all the records of todo collection to subscribing clients
    return Todos.find({user_id: this.userId});
  });
}
