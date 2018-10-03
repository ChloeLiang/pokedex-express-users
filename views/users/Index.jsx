var React = require('react');

class Index extends React.Component {
  render() {
    const users = this.props.users.map(user => {
      const userUrl = `/users/${user.id}`;
      return (
        <li key={user.id}>
          <a href={userUrl}>{user.name}</a>
        </li>
      );
    });

    return (
      <html>
        <head />
        <body>
          <h1>Users</h1>
          <ul>
            {users}
          </ul>
        </body>
      </html>
    );
  }
}

module.exports = Index;
