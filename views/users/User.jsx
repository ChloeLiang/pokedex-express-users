var React = require("react");

class User extends React.Component {
  render() {
    console.log(this);
    return (
      <html>
        <head />
        <body>
          <h2>Captured Pokemons</h2>
          <ul>
            {this.props.pokemons.map(pokemon => (
              <li key={pokemon.id}>
                {pokemon.name}
              </li>
            ))}
          </ul>
        </body>
      </html>
    );
  }
}

module.exports = User;
