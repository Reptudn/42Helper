import PocketBase from "pocketbase";
import { config } from "./config";

export const pb = new PocketBase(
  config.pocketbase.url || "http://91.98.148.201:8090"
);
