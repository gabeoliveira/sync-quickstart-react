import './SyncCobrowsing.css';

import React from 'react';
import SyncClient from 'twilio-sync';
import axios from 'axios';

import ParticipantsList from './ParticipantsList.js'

class SyncCobrowsing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'Connecting...',
      errorMessage: '',
      participants: [],
      formData: {
        players: [],
        firstName: '',
        lastName: '',
        phoneNumber: '',
        subscribeToMailingList: false
      }

    };

    this.setFormValue = this.setFormValue.bind(this);
  }

  componentDidMount() {
    // fetch an access token from the localhost server
    console.log(this.props);

    this.retrieveToken(this.props.identity);
  }



  async retrieveToken(identity) {
    let result = await axios.get('/token/' + identity);
    let accessToken = result.data.token;
    if (accessToken != null) {
      if (this.client) {
        // update the sync client with a new access token
        this.refreshSyncClient(accessToken);
      } else {
        // create a new sync client
        this.createSyncClient(accessToken);
      }
    } else {
      this.setState({'errorMessage':'No access token found in result'});
    }
  }

  updateSyncDocument(formData) {
    if (!this.client) {
      return;
    }
    this.client.document(this.props.sessionId).then(function(doc) {
      doc.set(formData);
    });
  }

  getParticipantsKey() {
    return 'participants-' + this.props.sessionId;
  }


  refreshParticipants(map) {
    this.getAllItems(map).then(items => {
      var participants = [];
      items.forEach(item => {
        participants.push(item.data);
      });
      console.log('participants', participants);
      this.setState({participants: participants});
    });
  }

  // Since Sync Map has pagination we need to navigate through all the pages
  async getAllItems(map) {
      const result = [];
      let page = await map.getItems();
      result.push(...page.items);

      while (page.hasNextPage) {
          page = await page.nextPage();
          result.push(...page.items);
      }
      return result;
  };

  refreshSyncClient(token) {
    this.client.updateToken(token);
  }

  createSyncClient(token) {
    const client = new SyncClient(token, { logLevel: 'info' });
    var component = this;
    let identity = this.props.identity;
    client.on('connectionStateChanged', function(state) {
        if (state === 'connected') {
            component.client  = client;
            component.setState({status:'connected'});
            component.loadFormData();
        } else {
          component.setState({
            status:'error', 
            errorMessage:`Error: expected connected status but got ${state}`
          });
        }
    });
    client.on('tokenAboutToExpire', function() {
      component.retrieveToken(identity);
    });
    client.on('tokenExpired', function() {
      component.retrieveToken(identity);
    });
  }

  async loadFormData() {
    let component = this;

    this.client.document(this.props.sessionId).then(function(doc) {
      component.setState({formData: doc.data});

      doc.on("updated",function(data) {
        console.log('Sync Updated Data', data);
        if (!data.isLocal) {
          console.log('Setting state with', data.data);
          component.setState({formData: data.data});
        }
      });
    
    });
  }

  setFormValue(fieldName,value) {
    var formData = this.state.formData;
    formData[fieldName] = value;
    this.setState({formData: formData}, () => this.updateSyncDocument(formData));
  }

  render() {
    console.log(this.state.formData.players);
    return (
      <React.Fragment>
        <div className="container">
          <ParticipantsList
            gameId={this.props.sessionId}
            participants={this.state.formData.players} />
        </div>
        <span id="floating-badges"></span>
        <span id="signals"></span>
      </React.Fragment>
    );
  }

}

export default SyncCobrowsing;
