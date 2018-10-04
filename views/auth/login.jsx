var React = require('react');

class Login extends React.Component {
  render() {
    return (
      <html>
        <head />
        <body>
          <h2>Login</h2>
          <form action="/login" method="POST">
            <div>
              Name: <input type="text" name="name" required />
            </div>
            <div>
              Password: <input type="password" name="password" required />
            </div>
            <input type="submit" value="Login" />
          </form>
        </body>
      </html>
    );
  }
}

module.exports = Login;
