import type { LoaderArgs } from "@remix-run/node";
import { Link, useCatch, useLoaderData } from "@remix-run/react";
import { Breadcrumb, BreadcrumbItem } from "~/components/breadcrumb";
import { Container } from "~/components/container";
import { prisma } from "~/db.server";


export async function loader({ params }: LoaderArgs) {

  const collections = await prisma.collection.findUnique({
    where: {
      id: params.id,
    },
    select: {
      id: true,
      name: true,
      description: true,
      articles: {
        select: {
          id: true,
          title: true,
          description: true
        }
      }
    }
  })
  return { collections }
}

export default function Index() {

  const { collections } = useLoaderData<typeof loader>()


  return (
    <div>
      <Container className="py-10 space-y-8">
        <Breadcrumb>
          <BreadcrumbItem to="/">Home Page</BreadcrumbItem>
          <BreadcrumbItem to={`/collections/${collections?.id}`}> {collections?.name} </BreadcrumbItem>
          {/* <BreadcrumbItem to="/articles/1">Article</BreadcrumbItem> */}
        </Breadcrumb>

        {collections?.articles.map((article, index) => (
          <Link
            to={`/articles/${article.id}`}
            className="w-full bg-slate-50 shadow rounded-sm p-6 block"
            key={article.id}
          >
            <h2 className="text-xl text-slate-900">{article.title}</h2>
            <p className="text-slate-400 mt-1">
              {article.description}
            </p>
          </Link>
        ))}
      </Container>
    </div>
  );
}


export function CatchBoundary() {
  const caught = useCatch()

  if (caught.status === 404) {
    return (
      <Container>
        <h1> This collection does not exists! </h1>
      </Container>
    )
  }

  throw new Error("Ooopps")

}


export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Container>
      <h1> Something went wrong with this collection! </h1>
      <pre> {error.message} </pre>
    </Container>
  )
}