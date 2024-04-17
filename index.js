import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import db from './_db.js';

import { typeDefs } from './schema.js';

const resolvers = {
  Query: {
    reviews: () => db.reviews,
    review: (parent, args, context) =>
      db.reviews.find((review) => review.id === args.id),
    games: () => db.games,
    game: (parent, args, context) =>
      db.games.find((game) => game.id === args.id),
    authors: () => db.authors,
    author: (parent, args, context) =>
      db.authors.find((author) => author.id === args.id),
  },
  Game: {
    reviews: (parent, args, context) =>
      db.reviews.filter((review) => review.game_id === parent.id),
  },
  Author: {
    reviews: (parent, args, context) =>
      db.reviews.filter((review) => review.author_id === parent.id),
  },
  Review: {
    game: (parent, args, context) =>
      db.games.find((game) => game.id === parent.game_id),
    author: (parent, args, context) =>
      db.authors.find((author) => author.id === parent.author_id),
  },
  Mutation: {
    deleteGame: (parent, args, context) => {
      db.games = db.games.filter((game) => game.id !== args.id);

      return db.games;
    },
    addGame: (parent, args, context) => {
      const game = {
        id: Date.now().toString(),
        ...args.game,
      };

      db.games.push(game);

      return game;
    },
    updateGame: (parent, args, context) => {
      db.games = db.games.map((game) =>
        game.id === args.id ? { ...game, ...args.edits } : game
      );

      return db.games.find((game) => game.id === args.id);
    },
  },
};

// server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log('Server ready at port', 4000);
