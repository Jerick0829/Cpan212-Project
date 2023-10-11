import React, { Component } from 'react';

class ConditionalComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
    };
  }

  render() {
    return (
      <div>
        <h1>Conditional Rendering</h1>
        {this.state.isLoggedIn ? (
          <p>Welcome, User!</p>
        ) : (
          <p>Please log in to continue.</p>
        )}
      </div>
    );
  }
}

export default ConditionalComponent;
