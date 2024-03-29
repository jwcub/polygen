import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import Access from "~/access";
import { getPost, updatePost } from "~/models/post.server";
import { requireUser } from "~/session.server";
import { validateEditPostFormData } from "~/validators/community.server";

export function loader() {
  return redirect("/");
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request, Access.Community);

  const data = await request.formData();
  const res = validateEditPostFormData(data);

  if (res.success) {
    const { cuid, content } = res.data;

    const post = await getPost(cuid);
    if (!post) {
      return null;
    }

    if (user.username !== post.username) {
      await requireUser(request, Access.ManageCommunity);
    }

    await updatePost(content, cuid);
  }

  return null;
}
