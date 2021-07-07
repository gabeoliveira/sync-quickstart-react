import React from 'react';

import './App.css';
import TopBar from './app/TopBar';
import SyncCobrowsing from './app/SyncCobrowsing.js';




class App extends React.Component {
  constructor(props) {
    super(props);

    const search = props.location.search;
    const sessionId = new URLSearchParams(search).get('gameId') || localStorage.getItem('gameId');

    localStorage.setItem('gameId',sessionId);

    this.state = {
      sessionId: sessionId,
      identity: '',
      isLoggedIn: false
    };

    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);

  }

  componentDidMount(){
    fetch('/user', {
      credentials: 'include' // fetch won't send cookies unless you set credentials
        })
        .then(response => response.json())
        .then(response => response.username ? this.setState({isLoggedIn: true, identity: response.username}) : window.location.href = '/api/discord/login');
  }

  setSessionId(event) {
    console.log(event);

    this.setState({sessionId: event.target.value});
    localStorage.setItem('gameId',event.target.value);
  }

  setIdentity(event) {
    this.setState({identity: event.target.value});
  }

  login(user) {
    console.log(user);

    this.setState({
      isLoggedIn: true,
      identity: user
    });

    console.log(this.state);
  }

  logout() {
    fetch('/logout', {
      credentials: 'include' // fetch won't send cookies unless you set credentials
        })
        .then(response => response.json())
        .then(response => this.setState({isLoggedIn: false, identity: ''}));
  }

  render() {

    return (
      <div className="App">
        <TopBar isLoggedIn={this.state.isLoggedIn} logout={this.logout}/>
        { this.state.isLoggedIn && 
          <SyncCobrowsing sessionId={this.state.sessionId} identity={this.state.identity}/> }
          {!this.state.sessionId ?
          <div className="container">
            <div className="card border-primary">
              <div className="card-body text-info">
                <h5 className="card-title">Session Id</h5>
                <h6 className="card-subtitle mb-2 text-muted">Provide a cobrowsing session id - should be unique</h6>
                <div className="input-group mb-3">
                  <input type="text" placeholder="Session Id" 
                    defaultValue={this.state.sessionId}
                    onChange={e => this.setSessionId(e)}></input>
                </div>
              </div>
            </div>
          </div>
       : undefined
        }
      </div>
    );
  }
}

export default App;
