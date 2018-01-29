// @flow

import { GraphQLString, GraphQLNonNull, GraphQLList, GraphQLObjectType } from 'graphql';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';

import { Board } from '../model';

import BoardConnection from '../connection/BoardConnection';
import { BoardLoader } from '../loader';

export default mutationWithClientMutationId({
  name: 'BoardAdd',
  inputFields: {
    title: {
      type: GraphQLString,
      description: 'title of the board',
    },
    userId: {
      type: GraphQLString,
      description: 'user owner of the board',
    },
  },
  mutateAndGetPayload: async ({ title, userId }, { user }) => {
    // Verify if user is authorized
    if (!user) {
      throw new Error('Unauthorized user');
    }

    const board = new Board({
      title,
      userId,
    });

    await board.save();

    const { id } = board;

    console.log(id);

    return {
      id,
      error: null,
    };
  },
  outputFields: {
    boardEdge: {
      type: BoardConnection.edgeType,
      resolve: async ({ id }, args, context) => {
        // Load new edge from loader
        const tweet = await BoardLoader.load(context, id);

        // Returns null if no node was loaded
        if (!tweet) {
          return null;
        }

        return {
          cursor: toGlobalId('Tweet', tweet),
          node: tweet,
        };
      },
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
