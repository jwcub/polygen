import { VStack } from "@chakra-ui/react";
import { useState } from "react";

import { load } from "~/hooks/loader";
import type { action } from "~/routes/api.post.comment";

import type { CommentProps } from "./comment";
import Comment from "./comment";
import LoadMore from "./loadMore";

export default function Comments({
  comments,
  parentId
}: {
  comments: CommentProps[];
  parentId: number;
}) {
  const [extraComments, setExtraComments] = useState<CommentProps[]>([]);

  const loader = async (page: number) => {
    const data = await load<typeof action>("/api/post/comment", {
      page,
      parentId
    });
    setExtraComments(extraComments => extraComments.concat(data));
    return data.length === 10;
  };

  return (
    <VStack w="100%" spacing={3}>
      {comments.concat(extraComments).map(data => (
        <Comment key={data.id} {...data} />
      ))}
      {comments.length === 10 ? <LoadMore loader={loader} /> : null}
    </VStack>
  );
}