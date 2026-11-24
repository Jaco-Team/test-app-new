declare module '*.scss';

declare module '*.html?raw' {
  const html: string;
  export default html;
}
