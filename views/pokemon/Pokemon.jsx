var React = require("react");

class Pokemon extends React.Component {
  render() {
    const users = this.props.users.map(user => {
      return (
        <li key={user.id}>{user.name}</li>
      );
    });

    const allUsers = this.props.allUsers.map(user => {
      return (
        <option key={user.id} value={user.id}>{user.name}</option>
      );
    });

    const deleteUrl = `/pokemon/${this.props.pokemon.id}?_method=DELETE`;

    return (
      <html>
        <head />
        <body>
          <div>
            <form action={deleteUrl} method="POST">
              <input type="submit" value="Delete" />
            </form>
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
            <form action="/users_pokemons" method="POST">
              <select name="user_id" id="user_id">
                {allUsers}
              </select>
              <input
                type="hidden"
                name="pokemon_id"
                value={this.props.pokemon.id}
              />
              <input type="submit" value="Add user" />
            </form>
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
