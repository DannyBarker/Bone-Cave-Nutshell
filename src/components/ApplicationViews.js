import { Route, withRouter, Redirect } from "react-router-dom";
import React, { Component } from "react";
import Login from "./login/Login"
import Register from './register/register'
import UserHandler from "./apiManager/UserHandler"
import ArticleHandler from "./apiManager/ArticleHandler"
import EventHandler from "./apiManager/EventHandler"
import TaskHandler from "./apiManager/TaskHandler"
import MessageHandler from "./apiManager/MessageHandler"
import Events from './events/Events'
import EventForm from './events/EventForm'
import EditEventForm from './events/EditEventForm'
import ArticleList from './articles/Articles'
import ArticleForm from './articles/ArticleForm'
import ArticleEditForm from './articles/ArticleEditForm'
import MessageList from "./messages/Messages"

class ApplicationViews extends Component {
  state = {
    users: [],
    articles: [],
    events: [],
    tasks: [],
    messages: []
  };

  componentDidMount() {
    UserHandler
      .getAll()
      .then(users => this.setState({ users: users }))
      .then(() => ArticleHandler.getAll())
      .then(articles => {
        let sortArticles = this.sortResource(articles)
        this.setState({ articles: sortArticles })})
      .then(() => EventHandler.getAll())
      .then(events => {
        let sortEvents = this.sortResource(events)
        this.setState({ events: sortEvents })
      })
      .then(() => TaskHandler.getAll())
      .then(tasks => this.setState({ tasks: tasks }))
      .then(() => MessageHandler.getAll())
      .then(messages => this.setState({ messages: messages }));
  }

sortResource = arr => {
return  arr.sort((a,b) => Date.parse(b.date) - Date.parse(a.date))
}

  addArticle = article =>
  ArticleHandler.post(article)
      .then(() => ArticleHandler.getAll())
      .then(articles =>
      this.setState({
          articles: articles
          })
      );

  addEvent = event =>{
    EventHandler.post(event)
      .then(() => EventHandler.getAll())
      .then( events => {
        this.setState({events: events})
        this.props.history.push('/events')
      })
  }

  deleteEvent = id => {
    EventHandler.delete(id)
    .then(() => EventHandler.getAll())
    .then( events => this.setState({events: events}))
  }

  updateEvent = editEvent => {
    EventHandler.put(editEvent)
    .then(() => EventHandler.getAll())
    .then( events => {
      this.setState({events: events})
      this.props.history.push('/events')
  })
  }

  updateArticle = article => {
    return ArticleHandler.put(article)
      .then(() => ArticleHandler.getAll())
      .then(articles => {
          this.setState({
          articles: articles
          })
        });
        };

  deleteArticle = id => ArticleHandler.delete(id)
  .then(() => ArticleHandler.getAll())
  .then(articles => {
      this.setState({
        articles: articles
      })
      this.props.history.push("/articles")
  })

  render() {
    return (
      <React.Fragment>

        <Route
          exact path="/login" render={props => {
            return <Login />
            // Remove null and return the component which will show news articles
          }}
        />

        <Route path="/register" render={props => {
            return <Register />
          }}
        />

        <Route exact path="/articles" render={props => {
            return <ArticleList {...props}
            articles={this.state.articles}
            deleteArticle={this.deleteArticle}
            />
          }}
        />

        <Route path="/articles/new" render={(props) => {
            return <ArticleForm {...props}
            addArticle={this.addArticle}
            />
          }}
        />

        <Route path="/articles/:articlesId(\d+)/edit" render={props => {
            return <ArticleEditForm {...props}
            articles={this.state.articles}
            updateArticle={this.updateArticle}
            />
          }}
        />

        <Route
          path="/friends" render={props => {
            // Remove null and return the component which will show list of friends
            return null
          }}
        />

        <Route
          path="/messages" render={props => {
            return <MessageList messages={this.state.messages} {...props}/>
            // Remove null and return the component which will show the messages
          }}
        />

        <Route
          exact path="/events" render={props => {
            return <Events events={this.state.events} sortEvents={this.sortEvents} {...props} deleteEvent={this.deleteEvent} updateEvennt={this.updateEvent} />
            // Remove null and return the component which will show the user's tasks
          }}
        />

        <Route
          exact path="/events/new" render={props => {
            return <EventForm addEvent={this.addEvent} {...props} />
          }} />

        <Route path="/events/:eventsId(\d+)/edit" render={props => {
            return <EditEventForm {...props} events={this.state.events} updateEvent={this.updateEvent} />
          }}
        />

        <Route
          path="/tasks" render={props => {
            return null
            // Remove null and return the component which will show the user's tasks
          }}
        />


      </React.Fragment>
    );
  }
}

export default withRouter(ApplicationViews)
