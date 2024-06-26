import { CheckIcon, CloseIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  ButtonGroup,
  chakra,
  Flex,
  IconButton,
  Tooltip,
  useDisclosure
} from "@chakra-ui/react";
import { Form, Link, useFetcher } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import Access, { access } from "~/access";
import { formatDate, useRelativeDateFormatter } from "~/hooks/datetime";
import { useOptionalUser } from "~/hooks/loader";
import type { Post as PostType } from "~/models/post.server";

import UserAvatar from "../user/userAvatar";
import UserLink from "../user/userLink";

import CopyLink from "./copyLink";
import Editor from "./editor";
import PrivateIndicator from "./privateIndicator";
import TextRenderer from "./textRenderer";

function MotionWrapper({
  children,
  _key
}: {
  children: ReactNode;
  _key: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      key={_key}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

export type PostProps = PostType & {
  _count: {
    comments: number;
  };
};

export default function Post({
  cuid,
  username,
  createdAt,
  content,
  _count: { comments },
  linked,
  isPrivate
}: PostProps & {
  linked: boolean;
}) {
  const postUrl = `/post/${cuid}`;

  const relativeDate = useRelativeDateFormatter();

  const user = useOptionalUser();
  const editable =
    user?.username === username || access(user, Access.ManageCommunity);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(content);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const editFetcher = useFetcher();

  const { t } = useTranslation();

  const onEditClick = () => {
    setEditing(true);
  };

  const onCancelClick = () => {
    setEditing(false);
    setValue(content);
  };

  const submitting = editFetcher.state !== "idle";
  const disabled = value.trim().length === 0;

  useEffect(() => {
    if (!submitting) {
      setEditing(false);
    }
  }, [submitting]);

  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <Flex direction="column" w="100%" role="group">
      <Flex mb="10px">
        <Flex align="center" wrap="wrap" flex={1} gap={3}>
          <UserAvatar username={username} />

          <Box>
            <UserLink username={username} />
            <Box color="gray.400" fontSize="xs">
              <PrivateIndicator isPrivate={isPrivate} />

              <Tooltip label={formatDate(createdAt)} openDelay={500}>
                {relativeDate(createdAt)}
              </Tooltip>

              {comments ? (
                <span>
                  {" · "}
                  {comments} {t("community.comment", { count: comments })}
                </span>
              ) : null}
            </Box>
          </Box>
        </Flex>

        <AnimatePresence mode="wait" initial={false}>
          {editing ? (
            <MotionWrapper _key="edit">
              <ButtonGroup
                as={editFetcher.Form}
                gap={3}
                m={0}
                action="/api/post/edit"
                method="post"
                size="sm"
                variant="ghost"
              >
                <IconButton
                  aria-label="save"
                  colorScheme="green"
                  icon={<CheckIcon />}
                  isDisabled={disabled}
                  isLoading={submitting}
                  type="submit"
                />
                <IconButton
                  aria-label="cancel"
                  colorScheme="red"
                  icon={<CloseIcon />}
                  onClick={onCancelClick}
                />

                <input type="hidden" name="content" value={value} />
                <input type="hidden" name="cuid" value={cuid} />
              </ButtonGroup>
            </MotionWrapper>
          ) : (
            <MotionWrapper _key="normal">
              <ButtonGroup
                gap={3}
                opacity={0}
                _groupHover={{ opacity: "100%" }}
                transition="opacity .2s ease"
                size="sm"
                variant="ghost"
              >
                {editable ? (
                  <>
                    <IconButton
                      aria-label="edit"
                      icon={<EditIcon />}
                      onClick={onEditClick}
                    />
                    <IconButton
                      aria-label="delete"
                      icon={<DeleteIcon />}
                      onClick={onOpen}
                    />
                  </>
                ) : null}

                <CopyLink link={postUrl} />
              </ButtonGroup>
            </MotionWrapper>
          )}
        </AnimatePresence>

        {editable ? (
          <AlertDialog
            isCentered
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader>
                  {t("community.confirmTitle")}
                </AlertDialogHeader>
                <AlertDialogBody>{t("community.confirmBody")}</AlertDialogBody>
                <AlertDialogFooter
                  as={Form}
                  m={0}
                  action="/api/post/delete"
                  method="post"
                >
                  <Button ref={cancelRef} onClick={onClose}>
                    {t("community.cancel")}
                  </Button>
                  <Button
                    ml={3}
                    colorScheme="red"
                    onClick={onClose}
                    type="submit"
                  >
                    {t("community.delete")}
                  </Button>
                  <input type="hidden" name="cuid" value={cuid} />
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        ) : null}
      </Flex>

      {editable && editing ? (
        <Editor value={value} setValue={setValue} />
      ) : linked ? (
        <chakra.a as={Link} to={postUrl} maxH="200px" overflowY="auto">
          <object>
            <TextRenderer>{content}</TextRenderer>
          </object>
        </chakra.a>
      ) : (
        <div>
          <TextRenderer>{content}</TextRenderer>
        </div>
      )}
    </Flex>
  );
}
