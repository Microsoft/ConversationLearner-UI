import * as React from 'react'
import {
    NavLink,
    Route,
    Switch
} from 'react-router-dom'
import Index from './App/Index'
import Settings from './App/Settings'
import Actions from './App/Actions'
import Entities from './App/Entities'
import TrainDialogs from './App/TrainDialogs'
import LogDialogs from './App/LogDialogs'
import './App.css'

const component = ({ match, location }: any) => {
    const { app } = location.state
    return (
        <div className="blis-app-page">
            <ul>
                <li>
                    <NavLink exact={true} to="/home">&lt;- App List</NavLink>
                </li>
                <li>
                    <NavLink to={{ pathname: `${match.url}/settings`, state: { app } }}>Settings</NavLink>
                </li>
                <li>
                    <NavLink to={{ pathname: `${match.url}/entities`, state: { app } }}>Entities</NavLink>
                </li>
                <li>
                    <NavLink to={{ pathname: `${match.url}/actions`, state: { app } }}>Actions</NavLink>
                </li>
                <li>
                    <NavLink to={{ pathname: `${match.url}/train`, state: { app } }}>Train Dialogs</NavLink>
                </li>
                <li>
                    <NavLink to={{ pathname: `${match.url}/logs`, state: { app } }}>Log Dialogs</NavLink>
                </li>
            </ul>
            <Switch>
                <Route path={`${match.url}/settings`} render={props => <Settings {...props} app={app} />} />
                <Route path={`${match.url}/entities`} render={props => <Entities {...props} app={app} />} />
                <Route path={`${match.url}/actions`} render={props => <Actions {...props} app={app} />} />
                <Route path={`${match.url}/train`} render={props => <TrainDialogs {...props} app={app} />} />
                <Route path={`${match.url}/logs`} render={props => <LogDialogs {...props} app={app} />} />
                <Route
                    exact={true}
                    path={match.url}
                    render={props => <Index {...props} app={app} />}
                />
            </Switch>
        </div>
    )
}

export default component