type ApiMode = "mock" | "api";

function getApiMode(): ApiMode {
  return process.env.EXPO_PUBLIC_API_MODE === "api" ? "api" : "mock";
}

export const env = {
  apiMode: getApiMode(),
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "",
};
