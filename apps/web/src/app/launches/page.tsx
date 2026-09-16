import { getLaunchFeed } from "../../lib/launches";
import { LaunchesView } from "./launches-view";

export const metadata = {
  title: "Space Coast Launches | Space Coast Explorer",
  description: "Track upcoming Florida Space Coast launches with normalized provider data."
};

export default async function LaunchesPage() {
  const feed = await getLaunchFeed();
  return <LaunchesView feed={feed} />;
}
