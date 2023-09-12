import { Container } from "~/components/container";
import { Breadcrumb, BreadcrumbItem } from "~/components/breadcrumb";
import { prisma } from "~/db.server";
import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { type LoaderArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useTransition } from "@remix-run/react";


export async function action({ request }: ActionArgs) {

  const payload = Object.fromEntries(await request.formData())

  const { title, content, description, collectionId } = payload;

  if (!title || !content || !description || !collectionId) {
    return json({
      error: {
        message: "missing fields"
      }
    }, {
      status: 400
    })
  }

  const { id } = await prisma.article.create({
    data: {
      title: String(title),
      content: String(content),
      description: String(description),
      collectionId: String(collectionId),
    }
  })

  console.log("Formulário: ", payload);
  return redirect(`/articles/${id}`)
}

export async function loader(args: LoaderArgs) {

  const collections = await prisma.collection.findMany({
    select: {
      id: true,
      name: true,
    }
  })
  return { collections }
}

export default function Index() {

  const { collections } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const { state } = useTransition()
  const isLoading = state === 'submitting'


  return (
    <div>
      <Container className="py-10">
        <Breadcrumb>
          <BreadcrumbItem to="/">Home Page</BreadcrumbItem>
          <BreadcrumbItem to="/articles">New Article</BreadcrumbItem>
        </Breadcrumb>
      </Container>

      <Container className="prose">
        <h1>New Article</h1>

        <Form method="post" className="flex flex-col bg-slate-50 p-6 rounded-md">
          <fieldset disabled={isLoading} className="space-y-6">
            <input
              type="text"
              name="title"
              placeholder="Título"
              className="block w-full px-4 rounded-md py-3 text-slate-900 bg-white ring-1 ring-slate-200 transition-colors text-lg focus:text-slate-900 focus:outline-none"
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              className="block w-full px-4 rounded-md py-3 text-slate-900 bg-white ring-1 ring-slate-200 transition-colors text-lg focus:text-slate-900 focus:outline-none"
            />
            <textarea
              name="content"
              placeholder="Content"
              className="block w-full px-4 rounded-md py-3 text-slate-900 bg-white ring-1 ring-slate-200 transition-colors text-lg focus:text-slate-900 focus:outline-none"
            />
            <select
              name="collectionId"
              className="block w-full px-4 rounded-md py-3 text-slate-900 bg-white ring-1 ring-slate-200 transition-colors text-lg focus:text-slate-900 focus:outline-none"
            >
              <option value={''}>Select a collection ...</option>
              {collections.map(item => (
                <option key={item.id} value={item.id} > {item.name} </option>
              ))}
            </select>

            {actionData?.error.message && (
              <div className="text-red-500" >
                {actionData?.error.message}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Save'}
              </button>
            </div>
          </fieldset>
        </Form>
      </Container>
    </div>
  );
}
