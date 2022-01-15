import { Analytics } from "./analytics.model";
import { Preferences } from "./preferences.model";
import { Test } from "./test.model";

export class Data {
  preferences: Preferences = {};
  analytics: Analytics = {};
  tests: Test[] = [];
}