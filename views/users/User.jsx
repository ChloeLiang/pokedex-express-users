var React = require("react");

class User extends React.Component {
  render() {
    let deleteUser;
    let pokemonList;
    if (this.props.isAuth) {
      const deleteUserUrl = `/users/${this.props.userId}?_method=DELETE`;
      deleteUser = (
        <form action={deleteUserUrl} method="POST">
          <input type="submit" value="Delete User" />
        </form>
      );

      pokemonList = this.props.capturedPokemons.map(pokemon => {
        const releasePokemonUrl = `/users_pokemons/${pokemon.id}?_method=DELETE`;
        return (
          <li key={pokemon.id}>
            {pokemon.name}
            <form action={releasePokemonUrl} method="POST">
              <input type="submit" value="Release" />
            </form>
          </li>
        );
      });
    } else {
      pokemonList = this.props.capturedPokemons.map(pokemon => (
        <li key={pokemon.id}>
          {pokemon.name}
        </li>
      ));
    }

    return (
      <html>
        <head />
        <body>
          {deleteUser}
          <ul>
            {pokemonList}
          </ul>
        </body>
      </html>
    );
  }
}

module.exports = User;
