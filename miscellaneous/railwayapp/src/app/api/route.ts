import { graphql } from "@/gql";
import { GraphQLWebSocketClient } from "graphql-request";
import { GRAPHQL_TRANSPORT_WS_PROTOCOL } from "graphql-ws";
import WebSocketImpl from "ws";
import { RAILWAY_API_URL, headers } from "../utils";

export const dynamic = "force-dynamic";

const STREAM_DEPLOYMENT_LOGS = graphql(`
  subscription StreamDeploymentLogs($deploymentId: String!) {
    deploymentLogs(deploymentId: $deploymentId) {
      message
      timestamp
    }
  }
`);

async function createSubscriptionClient(url: string) {
  return new Promise<GraphQLWebSocketClient>((resolve) => {
    const socket = new WebSocketImpl(url, GRAPHQL_TRANSPORT_WS_PROTOCOL, {
      ...headers,
    });
    const client: GraphQLWebSocketClient = new GraphQLWebSocketClient(
      socket as unknown as WebSocket,
      { onAcknowledged: async (_p) => resolve(client) }
    );
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const deploymentId = searchParams.get("deploymentId");
  if (!deploymentId)
    return new Response("Missing deploymentId", { status: 400 });
  let responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();
  const client = await createSubscriptionClient(RAILWAY_API_URL);
  client.subscribe(
    STREAM_DEPLOYMENT_LOGS,
    {
      next: (data) => {
        writer.write(
          encoder.encode(
            `event: message\ndata: ${JSON.stringify(data.deploymentLogs)}\n\n`
          )
        );
      },
      complete: () => {
        writer.close();
      },
      error: (_err) => {
        writer.close();
      },
    },
    { deploymentId }
  );
  return new Response(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
