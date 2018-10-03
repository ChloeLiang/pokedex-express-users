var React = require("react");

class Edit extends React.Component {
  render() {
    const url = `/users/${this.props.user.id}?_method=PUT`;

    return (
      <html>
        <head />
        <body>
          <form action={url} method="POST">
            <p>User name:</p>
            <input type="text" name="name" defaultValue={this.props.user.name} required />
            <input type="submit" value="Update" />
          </form>
        </body>
      </html>
    );
  }
}

module.exports = Edit;
