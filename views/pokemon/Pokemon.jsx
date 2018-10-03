var React = require("react");

class Pokemon extends React.Component {
  render() {
    const users = this.props.users.map(user => {
      return (
        <li key={user.id}>{user.name}</li>
      );
    });

    return (
      <html>
        <head />
        <body>
          <div>
            <ul className="pokemon-list">
              <li className="pokemon-attribute">
                id: {this.props.pokemon.id}
              </li>
              <li className="pokemon-attribute">
                name: {this.props.pokemon.name}
              </li>
              <li className="pokemon-attribute">
                img: {this.props.pokemon.img}
              </li>
              <li className="pokemon-attribute">
                height: {this.props.pokemon.height}
              </li>
              <li className="pokemon-attribute">
                weight: {this.props.pokemon.weight}
              </li>
            </ul>
            <p>Captured by:</p>
            <ul>
              {users}
            </ul>
          </div>
        </body>
      </html>
    );
  }
}

module.exports = Pokemon;
