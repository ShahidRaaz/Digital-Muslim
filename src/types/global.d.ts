export {};

declare global {
  interface Window {
    desktopWidget?: {
      notify: (options: { title:string; body: string }) => void;
    };
  }
}