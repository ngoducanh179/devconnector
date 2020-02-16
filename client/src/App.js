import React, { Fragment, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import './App.css';
import Alert from './components/layout/Alert';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components//profile-form/CreateProfile';
import EditsProfile from './components//profile-form/EditsProfile';
import AddExperience from './components//profile-form/AddExperience';
import AddEducation from './components//profile-form/AddEducation';
import PrivateRoute from './routing/PrivateRoute';
import Profiles from './components/profile/Profiles';
import Profile from './components/profileid/Profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}
const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <div className='App'>
        <Router>
          <Fragment>
            <Navbar />
            <Route exact path='/' component={Landing} />
            <section className='container'>
              <Alert />
              <Switch>
                <Route exact path='/login' component={Login} />
                <Route exact path='/Register' component={Register} />
                <Route exact path='/profiles' component={Profiles} />
                <Route exact path='/profile/:id' component={Profile} />
                <PrivateRoute exact path='/dashboard' component={Dashboard} />
                <PrivateRoute
                  exact
                  path='/create-profile'
                  component={CreateProfile}
                />
                <PrivateRoute
                  exact
                  path='/edit-profile'
                  component={EditsProfile}
                />
                <PrivateRoute
                  exact
                  path='/add-experience'
                  component={AddExperience}
                />
                <PrivateRoute
                  exact
                  path='/add-education'
                  component={AddEducation}
                />
                <PrivateRoute exact path='/posts' component={Posts} />
                <PrivateRoute exact path='/post/:id' component={Post} />
              </Switch>
            </section>
          </Fragment>
        </Router>
      </div>
    </Provider>
  );
};

export default App;
