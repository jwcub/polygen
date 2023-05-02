import type { LoaderArgs, ActionArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData, useSubmit, useNavigation } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Feed,
  Grid,
  Header,
  Icon,
  Segment,
  Comment as SemanticComment,
  List,
  Pagination
} from "semantic-ui-react";
import Vditor from "vditor";

import Comment from "~/components/comment";
import { Avatar, formatDate, UserLink } from "~/components/community";
import Layout from "~/components/layout";
import Post from "~/components/post";
import { VditorSkeleton } from "~/components/vditorSkeleton";
import { createComment, getComments } from "~/models/comment.server";
import { getPost } from "~/models/post.server";
import { requireAuthenticatedOptionalUser, requireAuthenticatedUser } from "~/session.server";
import { Access, ajax, vditorConfig } from "~/utils";
import { renderText } from "~/utils.server";

export async function loader({ request, params }: LoaderArgs) {
  const user = await requireAuthenticatedOptionalUser(request, Access.Basic);

  const id = Number(params.postId);
  if (!id) {
    throw new Response("请求无效", { status: 400, statusText: "Bad Request" });
  }

  const post = await getPost({ id });
  if (!post) {
    throw new Response("说说不存在", { status: 404, statusText: "Not Found" });
  }

  post.content = renderText(post.content);

  const comments = await getComments({ parentId: id, page: 1 });

  for (let comment of comments) {
    comment.content = renderText(comment.content);
  }

  return json({ post, user, originalComments: comments });
}

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => [{ title: data ? `${data.post.username}的说说 - polygen` : "错误 - polygen" }];

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  const { username } = await requireAuthenticatedUser(request, Access.Community);
  const content = formData.get("content");
  const parentId = Number(formData.get("parentId"));

  if (!parentId || parentId <= 0)
    return json(false, { status: 400 });

  if (typeof content !== "string" || content.length <= 0 || content.length >= 10000)
    return json(false, { status: 400 });

  await createComment({ username, content, parentId });

  return json(true);
}

export default function PostId() {
  const { user, post, originalComments } = useLoaderData<typeof loader>();
  const [comments, setComments] = useState(originalComments);
  const [page, setPage] = useState(1);
  const [canScroll, setCanScroll] = useState(false);

  const [vd, setVd] = useState<Vditor>();

  const anchor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      const vditor = new Vditor("vditor", {
        ...vditorConfig, after: () => {
          setVd(vditor);
        }
      });
    }
  }, [user]);

  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();

  const sendRequest = () => {
    const content = vd?.getValue()?.trim();

    if (content && content.length > 0 && content.length <= 10000) {
      submit({ content, parentId: String(post.id) }, { method: "post" });
    }
  };

  useEffect(() => {
    if (actionData && navigation.state === "loading") {
      vd?.setValue("");
      ajax("post", "/post/comment", {
        page: 1,
        parentId: post.id
      }).then(data => {
        setComments(data);
        setPage(1);
      });
    }
  }, [actionData, vd, navigation.state, post.id]);

  const handleReplyClick = () => {
    anchor.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  useEffect(() => {
    canScroll && handleReplyClick();
  }, [comments, canScroll]);

  function Navigation() {
    return (
      <>
        {post._count.comments > 10 && (
          <Pagination
            secondary
            ellipsisItem={null}
            activePage={page}
            firstItem={{ content: <Icon name="angle double left" />, icon: true, disabled: page === 1 }}
            lastItem={{
              content: <Icon name="angle double right" />, icon: true,
              disabled: page === Math.ceil(post._count.comments / 10)
            }}
            prevItem={{ content: <Icon name="angle left" />, icon: true, disabled: page === 1 }}
            nextItem={{
              content: <Icon name="angle right" />, icon: true,
              disabled: page === Math.ceil(post._count.comments / 10)
            }}
            boundaryRange={0}
            siblingRange={2}
            totalPages={Math.ceil(post._count.comments / 10)}
            onPageChange={(_, { activePage }) => {
              ajax("post", "/post/comment", {
                page: activePage,
                parentId: post.id
              }).then(data => {
                setCanScroll(true);
                setComments(data);
                setPage(activePage as number);
              });
            }}
          />)}
      </>
    );
  }

  return (
    <Layout columns={2}>
      <Grid.Column width={12}>
        <Feed size="large">
          <Post id={post.id} createdAt={post.createdAt} commentAmount={post._count.comments} content={post.content}
                viewCount={post.viewCount} username={post.username} favouredBy={post.favouredBy} />
        </Feed>

        <SemanticComment.Group size="large" minimal className="!max-w-none">
          {user &&
            (
              <SemanticComment>
                <Avatar username={user.username} />
                <SemanticComment.Content>
                  <UserLink username={user.username} />
                  <SemanticComment.Text>
                    <VditorSkeleton />
                    <Button icon primary labelPosition="left" onClick={sendRequest}
                            loading={navigation.state === "submitting"}
                            disabled={navigation.state === "submitting"} className="!mt-4">
                      <Icon name="send" />
                      评论
                    </Button>
                  </SemanticComment.Text>
                </SemanticComment.Content>
              </SemanticComment>)}


          <Navigation />
          <div ref={anchor} />
          {comments.map(({ id, content, username, createdAt }) => (
            <Comment key={id} content={content} username={username} createdAt={createdAt} />
          ))}
        </SemanticComment.Group>
        <Navigation />
      </Grid.Column>

      <Grid.Column width={4}>
        <Header as="h4" attached="top" block>
          说说信息
        </Header>
        <Segment attached="bottom">
          <List relaxed>
            <List.Item>
              <strong>楼主</strong>
              <div className="float-right"><UserLink username={post.username} /></div>
            </List.Item>
            <List.Item>
              <strong>访问量</strong>
              <div className="float-right">{post.viewCount}</div>
            </List.Item>
            <List.Item>
              <strong>发布时间</strong>
              <div className="float-right">{formatDate(post.createdAt)}</div>
            </List.Item>
          </List>

          {user && (
            <Button primary size="small" onClick={handleReplyClick}>回复</Button>
          )}
        </Segment>
      </Grid.Column>
    </Layout>
  );
}