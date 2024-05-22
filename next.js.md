## Installation

```
npx create-next-app@latest
npm install next@latest react@latest react-dom@latest
```

package.json

```
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

## The app directory

```
app/
  layout.tsx
  page.tsx
```

layout

```
export default function RootLayout({children}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

page

```
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
```

## The pages directory (optional)

```
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
```

```
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
```

```
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```

## The public folder (optional)

```
/public
```

## Run the Development Server

1.

```
npm run dev
```

2. Visit http://localhost:3000
3. Edit app/page.tsx or pages/index.tsx

## Top-level folders

```
app	    App Router
pages	  Pages Router
public	Static assets to be served
src	    Optional application source folder
```

## Top-level files

```
next.config.js	  Configuration file for Next.js
package.json	    Project dependencies and scripts
instrumentation.ts	OpenTelemetry and Instrumentation file middleware.ts	Next.js request middleware
.env	            Environment variables
.env.local	      Local environment variables
.env.production	  Production environment variables
.env.development	Development environment variables
.eslintrc.json	  Configuration file for ESLint
.gitignore	      Git files and folders to ignore
next-env.d.ts	    TypeScript declaration file for Next.js
tsconfig.json	    Configuration file for TypeScript
jsconfig.json	    Configuration file for JavaScript
```

## app Routing Conventions

Routing Files

```
layout	        .js .jsx .tsx	Layout
page	          .js .jsx .tsx	Page
loading	        .js .jsx .tsx	Loading UI
not-found	      .js .jsx .tsx	Not found UI
error	.js       .jsx .tsx	Error UI
global-error	  .js .jsx .tsx	Global error UI
route	          .js .ts	API endpoint
template	      .js .jsx .tsx	Re-rendered layout
default	        .js .jsx .tsx	Parallel route fallback page
```

Nested Routes

```
folder	        Route segment
folder/folder	  Nested route segment
```

Dynamic Routes

```
[folder]	      Dynamic route segment
[...folder]	    Catch-all route segment
[[...folder]]	  Optional catch-all route segment
```

Route Groups and Private Folders

```
(folder)	  Group routes without affecting routing
_folder	    Opt folder and all child segments out of routing
```

Parallel and Intercepted Routes

```
@folder	          Named slot
(.)folder	        Intercept same level
(..)folder	      Intercept one level above
(..)(..)folder	  Intercept two levels above
(...)folder	      Intercept from root
```

## Metadata File Conventions
```
favicon	      .ico	Favicon file
icon	        .ico .jpg .jpeg .png .svg	App Icon file
icon	        .js .ts .tsx	Generated App Icon
apple-icon	  .jpg .jpeg, .png	Apple App Icon file
apple-icon	  .js .ts .tsx	Generated Apple App Icon
```




