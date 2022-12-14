import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireAuthenticatedOptionalUser } from "~/session.server";
import { Access } from "~/utils";
import { getPosts } from "~/models/post.server";

export async function loader({ request }: ActionArgs) {
  return await requireAuthenticatedOptionalUser(request, Access.VisitWebsite);
}

export async function action({ request }: ActionArgs) {
  await requireAuthenticatedOptionalUser(request, Access.VisitWebsite);

  const data = await request.json();
  const page = data.page;

  if (typeof page !== "number" || page <= 0)
    return json("页数不合法", { status: 400 });

  const posts = await getPosts(page);

  return json(posts);
}