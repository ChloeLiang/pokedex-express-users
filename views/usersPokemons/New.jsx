var React = require("react");

class New extends React.Component {
  render() {
    return (
      <html>
        <head />
        <body>
          <form method="POST" action="/users_pokemons">
            <div>
              User ID:<input name="user_id" type="number" required />
            </div>
            <div>
              Pokemon ID:<input name="pokemon_id" type="number" required />
            </div>
            <input type="submit" value="Submit" />
          </form>
        </body>
      </html>
    );
  }
}

module.exports = New;
