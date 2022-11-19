import gql from 'graphql-tag';

const typeDef = gql`
  extend type Mutation {
    sendBugReport(
      feedback: String!
      type: BugReportType!
      deviceInfo: DeviceInfo!
      email: String
      image: Upload
    ): BugReportResponse!
  }

  type BugReportResponse {
    success: Boolean!
    message: String!
  }

  input DeviceInfo {
    version: String!
    brand: String!
    manufacturer: String!
    model: String!
    sdkVersion: String!
  }

  # The implementation for this scalar is provided by the
  # 'GraphQLUpload' export from the 'graphql-upload' package
  # in the resolver map
  scalar Upload

  enum BugReportType {
    BUG
    NEW_FEATURE
    OTHER
  }
`;

export default typeDef;
