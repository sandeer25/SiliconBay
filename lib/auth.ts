export const AUTH_EVENT = "siliconbay-auth-updated";

export const notifyAuthChange = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(AUTH_EVENT));
};