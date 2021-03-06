const express = require('express');
const methodOverride = require('method-override');
const pg = require('pg');
const sha256 = require('js-sha256');
const cookieParser = require('cookie-parser');
const reactEngine = require('express-react-views').createEngine();

// Initialise postgres client
const config = {
  user: 'liangxin',
  host: '127.0.0.1',
  database: 'pokemons',
  port: 5432,
};

const pool = new pg.Pool(config);

pool.on('error', function (err) {
  console.log('Idle client error', err.message, err.stack);
});

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());

app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactEngine);

/**
 * ===================================
 * Route Handler Functions
 * ===================================
 */

const getRoot = (request, response) => {
  const queryString = 'SELECT * from pokemon;';
  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      response.render('pokemon/home', { pokemon: result.rows });
    }
  });
}

const getNew = (request, response) => {
  response.render('pokemon/new');
}

const getPokemon = (request, response) => {
  let id = request.params['id'];
  let queryString = 'SELECT * FROM pokemon WHERE id = ' + id + ';';
  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      queryString = `SELECT users.id, users.name FROM users INNER JOIN users_pokemons ON users_pokemons.user_id = users.id WHERE users_pokemons.pokemon_id = ${id}`;
      pool.query(queryString, (usersErr, usersResult) => {
        if (usersErr) {
          console.error('Query error:', usersErr.stack);
          response.send('Query Error');
        } else {
          queryString = 'SELECT * FROM users';
          pool.query(queryString, (allUsersErr, allUsersResult) => {
            if (allUsersErr) {
              console.error('Query error:', allUsersErr.stack);
              response.send('Query Error');
            } else {
              const pokemon = result.rows[0];
              const users = usersResult.rows;
              const user = request.cookies.userId;
              response.render('pokemon/pokemon', { pokemon, users, user });
            }
          });
        }
      });
    }
  });
}

const postPokemon = (request, response) => {
  let params = request.body;

  const queryString = 'INSERT INTO pokemon(name, height) VALUES($1, $2);';
  const values = [params.name, params.height];

  pool.query(queryString, values, (err, result) => {
    if (err) {
      console.log('query error:', err.stack);
    } else {
      response.redirect('/');
    }
  });
};

const editPokemonForm = (request, response) => {
  let id = request.params['id'];
  const queryString = 'SELECT * FROM pokemon WHERE id = ' + id + ';';
  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      response.render('pokemon/edit', { pokemon: result.rows[0] });
    }
  });
}

const updatePokemon = (request, response) => {
  let id = request.params['id'];
  let pokemon = request.body;
  const queryString = 'UPDATE "pokemon" SET "num"=($1), "name"=($2), "img"=($3), "height"=($4), "weight"=($5) WHERE "id"=($6)';
  const values = [pokemon.num, pokemon.name, pokemon.img, pokemon.height, pokemon.weight, id];
  pool.query(queryString, values, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      response.redirect('/');
    }
  });
}

const deletePokemon = (request, response) => {
  // Delete from pokemon and join table
  const id = request.params.id;
  let queryString = `DELETE from pokemon WHERE id = ${id}`;
  pool.query(queryString, (pokemonErr, pokemonResult) => {
    if (pokemonErr) {
      console.error('Query error:', pokemonErr.stack);
      response.send('Query Error');
    } else {
      queryString = `DELETE from users_pokemons WHERE pokemon_id = ${id}`;
      pool.query(queryString, (joinErr, joinResult) => {
        if (joinErr) {
          console.error('Query error:', joinErr.stack);
          response.send('Query Error');
        } else {
          response.redirect('/');
        }
      });
    }
  });
};

/**
 * ===================================
 * Users Pokemons
 * ===================================
 */

const usersPokemonsNew = (request, response) => {
  response.render('usersPokemons/new');
};

const usersPokemonsCreate = (request, response) => {
  let queryString = `SELECT * FROM users_pokemons WHERE user_id = ${request.body.user_id}`;
  pool.query(queryString, (userErr, userResult) => {
    if (userErr) {
      console.error('Query error:', userErr.stack);
      response.send('Query Error');
    } else {
      const pokemonId = parseInt(request.body.pokemon_id);
      const foundPokemon = userResult.rows.find(obj => {
        return obj.pokemon_id === pokemonId;
      });

      if (foundPokemon) {
        response.send('ERROR: Pokemon has already been captured.');
      } else {
        queryString = 'INSERT INTO users_pokemons (user_id, pokemon_id) VALUES ($1, $2)';
        const values = Object.values(request.body);
        pool.query(queryString, values, (err, result) => {
          if (err) {
            console.error('Query error:', err.stack);
            response.send('Error');
          } else {
            response.redirect('back');
          }
        });
      }
    }
  });
};

const usersPokemonsDelete = (request, response) => {
  const pokemonId = request.params.pokemonId;
  const userId = request.cookies.userId;
  const queryString = `DELETE from users_pokemons WHERE user_id = ${userId} AND pokemon_id = ${pokemonId}`;
  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
      response.send('Query Error');
    } else {
      response.redirect('back');
    }
  });
};

/**
 * ===================================
 * User
 * ===================================
 */

const usersIndex = (request, response) => {
  const queryString = 'SELECT * FROM users ORDER BY id';
  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
      response.send('Query Error');
    } else {
      response.render('users/index', { users: result.rows });
    }
  });
};

const usersEdit = (request, response) => {
  const queryString = `SELECT * FROM users WHERE id = ${request.params.id}`;
  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
      response.send('Query Error');
    } else {
      response.render('users/Edit', { user: result.rows[0] });
    }
  });
};

const usersNew = (request, response) => {
  response.render('users/new');
};

const usersShow = (request, response) => {
  let queryString = `SELECT pokemon.id, pokemon.name FROM pokemon INNER JOIN users_pokemons ON users_pokemons.pokemon_id = pokemon.id WHERE users_pokemons.user_id = ${request.params.id}`;
  pool.query(queryString, (capturedErr, capturedResult) => {
    if (capturedErr) {
      console.error('Query error:', capturedErr.stack);
      response.send('Query Error');
    } else {
      queryString = 'SELECT * FROM pokemon';
      pool.query(queryString, (allErr, allResult) => {
        if (allErr) {
          console.error('Query error:', allErr.stack);
          response.send('Query Error');
        } else {
          const userId = request.params.id;
          const capturedPokemons = capturedResult.rows;
          const userLoggedIn = request.cookies.userId;
          let isAuth = userId === userLoggedIn;
          response.render('users/user', { userId, capturedPokemons, isAuth });
        }
      });
    }
  });
};

const usersCreate = (request, response) => {
  const queryString = 'INSERT INTO users (name, password) VALUES ($1, $2) RETURNING id';
  const values = [request.body.name, sha256(request.body.password)];

  pool.query(queryString, values, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
      response.send('dang it.');
    } else {
      const userId = result.rows[0].id;
      response.cookie('userId', userId);
      response.redirect(`/users/${userId}`);
    }
  });
};

const usersUpdate = (request, response) => {
  const id = request.params.id;
  const queryString = `UPDATE users SET name = ($1) WHERE id = ${id}`;
  const values = [request.body.name.trim()];
  pool.query(queryString, values, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
      response.send('Query Error');
    } else {
      response.redirect(`/users/${id}`);
    }
  });
};

const usersDelete = (request, response) => {
  const id = request.params.id;
  let queryString = `DELETE from users WHERE id = ${id}`;
  pool.query(queryString, (userErr, userResult) => {
    if (userErr) {
      console.error('Query error:', userErr.stack);
      response.send('Query Error');
    } else {
      queryString = `DELETE from users_pokemons WHERE user_id = ${id}`;
      pool.query(queryString, (joinErr, joinResult) => {
        if (joinErr) {
          console.error('Query error:', joinErr.stack);
          response.send('Query Error');
        } else {
          response.redirect('/users');
        }
      });
    }
  });
};

/**
 * ===================================
 * Cookie
 * ===================================
 */

const getCookies = (request, response) => {
  response.send(request.cookies);
};

const logout = (request, response) => {
  response.clearCookie('userId');
  response.redirect('/');
};

const getLoginForm = (request, response) => {
  response.render('auth/login');
};

const login = (request, response) => {
  const queryString = `SELECT * from users WHERE name = '${request.body.name}'`;
  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
      response.send('Query Error');
    } else {
      const password = sha256(request.body.password);
      const userId = result.rows[0].id;
      if (password === result.rows[0].password) {
        response.cookie('userId', userId);
      }

      response.redirect(`/users/${userId}`);
    }
  });
};

/**
 * ===================================
 * Routes
 * ===================================
 */

app.get('/', getRoot);

app.get('/pokemon/:id/edit', editPokemonForm);
app.get('/pokemon/new', getNew);
app.get('/pokemon/:id', getPokemon);
app.post('/pokemon', postPokemon);
app.put('/pokemon/:id', updatePokemon);
app.delete('/pokemon/:id', deletePokemon);

app.get('/users_pokemons/new', usersPokemonsNew);
app.post('/users_pokemons', usersPokemonsCreate);
app.delete('/users_pokemons/:pokemonId', usersPokemonsDelete);

app.get('/users/:id/edit', usersEdit);
app.get('/users/new', usersNew);
app.get('/users/:id', usersShow);
app.get('/users', usersIndex);
app.post('/users', usersCreate);
app.put('/users/:id', usersUpdate);
app.delete('/users/:id', usersDelete);

app.get('/cookies', getCookies);
app.get('/login', getLoginForm);
app.get('/logout', logout);
app.post('/login', login);

/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
const server = app.listen(3000, () => console.log('~~~ Ahoy we go from the port of 3000!!!'));

// Handles CTRL-C shutdown
function shutDown() {
  console.log('Recalling all ships to harbour...');
  server.close(() => {
    console.log('... all ships returned...');
    pool.end(() => {
      console.log('... all loot turned in!');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);
