var React = require("react");

class User extends React.Component {
  render() {
    const pokemonOptions = this.props.allPokemons.map(pokemon => {
      return (
        <option key={pokemon.id} value={pokemon.id}>{pokemon.name}</option>
      );
    });

    return (
      <html>
        <head />
        <body>
          <h2>Captured Pokemons</h2>
          <form action="/users_pokemons" method="POST">
            <input type="hidden" name="user_id" defaultValue={this.props.userId} />
            <select name="pokemon_id" id="pokemon_id">
              {pokemonOptions}
            </select>
            <input type="submit" value="Add" />
          </form>
          <ul>
            {this.props.capturedPokemons.map(pokemon => (
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
