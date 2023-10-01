/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query LatestDeployment($input: DeploymentListInput!, $first: Int!) {\n    deployments(input: $input, first: $first) {\n      edges {\n        node {\n          id\n          createdAt\n          status\n        }\n      }\n    }\n  }\n": types.LatestDeploymentDocument,
    "\n  mutation RemoveDeployment($id: String!) {\n    deploymentRemove(id: $id)\n  }\n": types.RemoveDeploymentDocument,
    "\n  mutation RestartDeployment($id: String!) {\n    deploymentRedeploy(id: $id) {\n      id\n    }\n  }\n": types.RestartDeploymentDocument,
    "\n  subscription StreamDeploymentLogs($deploymentId: String!) {\n    deploymentLogs(deploymentId: $deploymentId) {\n      message\n      timestamp\n    }\n  }\n": types.StreamDeploymentLogsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query LatestDeployment($input: DeploymentListInput!, $first: Int!) {\n    deployments(input: $input, first: $first) {\n      edges {\n        node {\n          id\n          createdAt\n          status\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query LatestDeployment($input: DeploymentListInput!, $first: Int!) {\n    deployments(input: $input, first: $first) {\n      edges {\n        node {\n          id\n          createdAt\n          status\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveDeployment($id: String!) {\n    deploymentRemove(id: $id)\n  }\n"): (typeof documents)["\n  mutation RemoveDeployment($id: String!) {\n    deploymentRemove(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RestartDeployment($id: String!) {\n    deploymentRedeploy(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation RestartDeployment($id: String!) {\n    deploymentRedeploy(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription StreamDeploymentLogs($deploymentId: String!) {\n    deploymentLogs(deploymentId: $deploymentId) {\n      message\n      timestamp\n    }\n  }\n"): (typeof documents)["\n  subscription StreamDeploymentLogs($deploymentId: String!) {\n    deploymentLogs(deploymentId: $deploymentId) {\n      message\n      timestamp\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;