import React, { Component } from 'react';
import axios from 'axios';
import { BrowserRouter, Link } from 'react-router-dom';
import Timer from './Timer';

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
          <div className="subtitle has-text-grey-light has-text-centered is-6">
            A simple rate-limiter middleware built with React, Node.js & MongoDB
          </div>
          <aside className="menu">
            <p className="menu-label">Methods</p>
            <ul className="menu-list">
              <li>
                <ul>
                  <li>
                    <BrowserRouter>
                      <Link
                        to="/"
                        className="has-text-link"
                        onClick={this.onButtonClick}
                      >
                        GET /api/rateLimiter
                      </Link>
                    </BrowserRouter>
                  </li>
                  <li>
                    <a href="/api/rateLimiter" className="has-text-link">
                      View /api/rateLimiter
                    </a>
                  </li>
                  <li>
                    <a href="/api/visitors" className="has-text-link">
                      View /api/visitors
                    </a>
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
                <li className="has-text-grey">
                  Your IP is{' '}
                  <span className="has-text-black">{this.state.ip}</span> which
                  remains{' '}
                  <strong>
                    <em className="has-text-primary">{this.state.remaining}</em>
                  </strong>{' '}
                  connections in{' '}
                  <Timer seconds={Math.round(this.state.reset / 1000)} />.
                </li>
              ) : null}
            </ul>
          </aside>
          <a
            style={{
              display: 'flex',
              justifyContent: 'center',
              fontSize: 12,
              marginTop: '2rem'
            }}
            href="https://github.com/walkccc/rate-limiter"
          >
            <strong className="has-text-info">
              View source on GitHub &copy; Jay Chen
            </strong>
          </a>
        </div>
      </div>
    );
  }
}

export default App;
