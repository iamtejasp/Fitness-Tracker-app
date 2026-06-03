import { ScrollViewStyleReset } from 'expo-router/html';

// This file is web-only and used to configure the root HTML for every
// web page during static rendering.
// The contents of this function only run in Node.js environments and
// do not have access to the DOM or browser APIs.
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* 
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native. 
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
        <ScrollViewStyleReset />

        {/* Using raw CSS styles as an escape-hatch to ensure the background color never flickers. */}
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
        {/* Add any additional <head> elements that you want globally available on web... */}
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
html {
  --fit-background: #080B10;
  --fit-backgroundSoft: #10151D;
  --fit-card: #151B24;
  --fit-cardElevated: #1B2430;
  --fit-border: #2A3340;
  --fit-text: #F7FAFC;
  --fit-muted: #9BA7B6;
  --fit-subtle: #657386;
  --fit-primary: #7CFF6B;
  --fit-primaryDark: #43C95D;
  --fit-coral: #FF775C;
  --fit-amber: #FFB84D;
  --fit-cyan: #5AD7FF;
  --fit-danger: #FF5C7A;
  --fit-white: #FFFFFF;
  color-scheme: dark;
}
body {
  background-color: var(--fit-background);
  color: var(--fit-text);
}`;
