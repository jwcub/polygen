import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import Access from "~/access";
import { getComments } from "~/models/comment.server";
import { badRequest } from "~/reponses.server";
import { requireOptionalUser } from "~/session.server";
import { validateGetCommentPageFormData } from "~/validators/community.server";

export function loader() {
  return redirect("/");
}

export async function action({ request }: ActionFunctionArgs) {
  await requireOptionalUser(request, Access.Basic);

  const data = await request.formData();
  const res = validateGetCommentPageFormData(data);

  if (res.success) {
    const { parentId, page } = res.data;

    const comments = await getComments(page, parentId);

    return json(comments);
  }

  return badRequest;
}
