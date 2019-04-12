import React, { Component } from 'react';
import axios from 'axios';
import { BrowserRouter, Link } from 'react-router-dom';
import './App.css';

class App extends Component {
  state = { ip: null, remaining: null, reset: null, err: null, success: false };

  fetchRateLimiter = async () => {
    try {
      const res = await axios.get('/api/rateLimiter');
      const ip = res.headers['ip'];
      const remaining = Number(res.headers['x-ratelimit-remaining']);
      const reset = Number(res.headers['x-ratelimit-reset']);

      this.setState({ ip, remaining, reset, err: false, success: true });
    } catch (err) {
      this.setState({ err: err.message, success: false });
    }
  };

  componentDidMount = async () => this.fetchRateLimiter();
  onButtonClick = async () => this.fetchRateLimiter();

  render() {
    return (
      <div className="section" style={{ paddingTop: '3rem' }}>
        <div className="container">
          <div className="title has-text-centered">Rate Limiter</div>

          <aside className="menu">
            <p className="menu-label">Methods</p>
            <ul className="menu-list">
              <li>
                <ul>
                  <li>
                    <BrowserRouter>
                      <Link to="/" onClick={this.onButtonClick}>
                        GET /api/rateLimiter
                      </Link>
                    </BrowserRouter>
                  </li>
                  <li>
                    <a href="/api/rateLimiter">View /api/rateLimiter</a>
                  </li>
                  <li>
                    <a href="/api/visitors">View /api/visitors</a>
                  </li>
                </ul>
              </li>
            </ul>

            <p className="menu-label">Response</p>
            <ul className="menu-list">
              {this.state.err ? (
                <li className="has-text-danger">{this.state.err}</li>
              ) : null}

              {this.state.success ? (
                <li>
                  Your IP address is <strong>{this.state.ip}</strong>
                  <br />
                  <br />
                  Remains{' '}
                  <span className="has-text-link">
                    <em>{this.state.remaining}</em>
                  </span>{' '}
                  connections in{' '}
                  <span className="has-text-danger">
                    {this.state.reset / 1000}
                  </span>{' '}
                  seconds.
                </li>
              ) : null}
            </ul>

            <p className="menu-label">Source</p>
            <ul className="menu-list">
              <li>
                <ul>
                  <li>
                    <a href="https://github.com/walkccc/rate-limiter">
                      <strong className="has-text-info">
                        View source on GitHub &copy; Jay Chen
                      </strong>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    );
  }
}

export default App;
