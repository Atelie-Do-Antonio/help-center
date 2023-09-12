import type { MetaFunction, LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLocation,
} from "@remix-run/react";

import styles from "./styles/app.css";
import { Hero } from "./components/hero";
import { Container } from "./components/container";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Help Center",
  viewport: "width=device-width,initial-scale=1",
});

function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {

  const location = useLocation()

  return (
    <Document>
      <Hero showTitle={location.pathname === '/'} />
      <Outlet />
    </Document>
  )
}

export function CatchBoundary() {
  const caught = useCatch()

  if (caught.status === 404) {
    return (
      <Container>
        <h1> This page does not exists! </h1>
      </Container>
    )
  }

  throw new Error("Ooopps")

}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Container>
      <h1> Something went wrong! </h1>
      <pre> {error.message} </pre>
    </Container>
  )
}