// @flow

import { GraphQLString, GraphQLNonNull, GraphQLList, GraphQLObjectType } from 'graphql';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';

import { Todo } from '../model';
import { TodoLoader } from '../loader';
import TodoType from '../type/TodoType';

export default mutationWithClientMutationId({
  name: 'TodoAdd',
  inputFields: {
    title: {
      type: GraphQLString,
      description: 'title of the TODO',
    },
    description: {
      type: GraphQLString,
      description: 'description of the TODO',
    },
    userId: {
      type: GraphQLString,
      description: 'user owner of the mutation',
    },
    boardId: {
      type: GraphQLString,
      description: 'the board of this TODO',
    },
  },
  mutateAndGetPayload: async ({ title, description, userId, boardId }, { user }) => {
    // Verify if user is authorized
    if (!user) {
      throw new Error('Unauthorized user');
    }

    const todo = new Todo({
      title,
      description,
      userId,
      boardId,
    });

    await todo.save();

    const { id } = todo;

    console.log(id);

    return {
      id,
      error: null,
    };
  },
  outputFields: {
    todo: {
      type: TodoType,
      resolve: async ({ id }, args, context) => {
        // Load new edge from loader
        const todo = await TodoLoader.load(context, id);

        // Returns null if no node was loaded
        if (!todo) {
          return null;
        }

        return {
          todo,
        };
      },
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
