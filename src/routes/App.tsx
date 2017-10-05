import * as React from 'react'
import {
  BrowserRouter as Router, Redirect, Route, NavLink, Switch
} from 'react-router-dom'
import { returntypeof } from 'react-redux-typescript'
import { setLoginDisplay } from '../actions/displayActions'
import { connect } from 'react-redux'
import { State } from '../types'
import { bindActionCreators } from 'redux'
import Index from './Apps/AppsIndex'
import About from './About'
import Docs from './Docs'
import Support from './Support'
import NoMatch from './NoMatch'
import UserLogin from '../components/UserLogin'
import SpinnerWindow from '../components/SpinnerWindow'
import UIError from '../components/Error'
import './App.css'

class App extends React.Component<Props, {}> {
  render() {
    return (
      <Router>
        <div className="blis-app">
          <div className="blis-app_header-placeholder"></div>
          <header className="blis-app_header blis-header ms-font-m-plus">
            <nav className="blis-header_links ">
              <NavLink to="/home">Home</NavLink>
              <NavLink to="/about">About</NavLink>
              <NavLink to="/docs">Docs</NavLink>
              <NavLink to="/support">Support</NavLink>
            </nav>
            <NavLink className="blis-header_user" to="/home" onClick={() => this.props.setLoginDisplay(true)}>{this.props.userName || "BLIS"}</NavLink>
          </header>
          <div className="blis-app_header-placeholder"></div>
          <div className="blis-app_content">
            <Switch>
              <Route exact path="/" render={() => <Redirect to="/home" />} />
              <Route path="/home" component={Index} />
              <Route path="/about" component={About} />
              <Route path="/docs" component={Docs} />
              <Route path="/support" component={Support} />
              <Route component={NoMatch} />
            </Switch>
          </div>
          <div className="blis-app_modals">
            <UIError />
            <UserLogin />
            <SpinnerWindow />
          </div>
        </div>
      </Router>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    setLoginDisplay
  }, dispatch);
}

const mapStateToProps = (state: State) => {
  return {
    userName: state.user.name,
    displayMode: state.display.displayMode
  }
}

// Props types inferred from mapStateToProps & dispatchToProps
const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;

export default connect<typeof stateProps, typeof dispatchProps, {}>(mapStateToProps, mapDispatchToProps)(App);