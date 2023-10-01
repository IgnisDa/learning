"use server";

import { graphql } from "@/gql";
import { DeploymentStatus } from "@/gql/graphql";
import { GraphQLClient } from "graphql-request";
import { revalidatePath } from "next/cache";
import { RAILWAY_API_URL, RAILWAY_PROJECT_ID, headers, sleep } from "./utils";

const gqlClient = new GraphQLClient(RAILWAY_API_URL, { ...headers });

const LATEST_DEPLOYMENT = graphql(`
  query LatestDeployment($input: DeploymentListInput!, $first: Int!) {
    deployments(input: $input, first: $first) {
      edges {
        node {
          id
          createdAt
          status
        }
      }
    }
  }
`);

const REMOVE_DEPLOYMENT = graphql(`
  mutation RemoveDeployment($id: String!) {
    deploymentRemove(id: $id)
  }
`);

const RESTART_DEPLOYMENT = graphql(`
  mutation RestartDeployment($id: String!) {
    deploymentRedeploy(id: $id) {
      id
    }
  }
`);

export const getLatestDeployment = async () => {
  const { deployments } = await gqlClient.request(LATEST_DEPLOYMENT, {
    input: { projectId: RAILWAY_PROJECT_ID },
    first: 1,
  });
  return deployments.edges[0].node;
};

export const containerAction = async (formData: FormData) => {
  const intent = formData.get("intent");
  const deploymentId = formData.get("deploymentId");
  if (typeof intent !== "string" || typeof deploymentId !== "string")
    throw new Error("Missing intent or deploymentId");
  if (intent === "up") {
    const { deploymentRedeploy } = await gqlClient.request(RESTART_DEPLOYMENT, {
      id: deploymentId,
    });
    while (true) {
      await sleep(2000);
      const latestDeployment = await getLatestDeployment();
      if (latestDeployment.status === DeploymentStatus.Success) break;
    }
  }
  if (intent === "down") {
    await gqlClient.request(REMOVE_DEPLOYMENT, { id: deploymentId });
  }
  revalidatePath("/");
  return { success: true };
};
