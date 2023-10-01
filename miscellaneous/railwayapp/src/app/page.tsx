import Image from "next/image";
import { containerAction, getLatestDeployment } from "./actions";
import { DeploymentStatus } from "@/gql/graphql";
import { Button, StreamLogs } from "./components";

export default async function Home() {
  const latestDeployment = await getLatestDeployment();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-20">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by clicking one of the buttons below
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://diptesh.me"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/ignisda.svg"
              alt="IgnisDa Logo"
              height={60}
              width={50}
              priority
            />
          </a>
        </div>
      </div>

      <div className="flex place-items-center before:h-[150px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:h-[90px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[180px] flex-col space-y-3">
        <div>
          Last deployment at:{" "}
          <span className="underline">
            {new Date(latestDeployment.createdAt).toUTCString()}
          </span>
        </div>
        <div>
          Status: <span className="capitalize">{latestDeployment.status}</span>
        </div>
        <div className="flex space-x-5 items-center">
          <input
            hidden
            name="deploymentId"
            defaultValue={latestDeployment.id}
          />
          <form action={containerAction}>
            <Button
              intent="up"
              latestDeploymentId={latestDeployment.id}
              disabled={latestDeployment.status === DeploymentStatus.Success}
              className="bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            />
          </form>
          <form action={containerAction}>
            <Button
              intent="down"
              latestDeploymentId={latestDeployment.id}
              disabled={latestDeployment.status === DeploymentStatus.Removed}
              className="bg-red-700 hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            />
          </form>
        </div>
        {latestDeployment.status === DeploymentStatus.Success ? (
          <StreamLogs deploymentId={latestDeployment.id} />
        ) : undefined}
      </div>

      <div className="mb-32 text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left flex" />
    </main>
  );
}
