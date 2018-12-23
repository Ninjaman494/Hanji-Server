module.exports = {
    Query: {
        entries: async (_, { term }, { dataSources }) =>
            dataSources.databaseAPI.fetchEntries(term),
        entry: (_, { id }, { dataSources }) =>
            dataSources.databaseAPI.fetchEntry(id),
    },
};