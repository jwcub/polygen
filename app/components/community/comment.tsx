import { DeleteIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  IconButton,
  Tooltip,
  useDisclosure
} from "@chakra-ui/react";
import { useFetcher } from "@remix-run/react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

import Access, { access } from "~/access";
import { formatDate, useRelativeDateFormatter } from "~/hooks/datetime";
import { useOptionalUser } from "~/hooks/loader";
import type { Comment as CommentType } from "~/models/comment.server";

import UserAvatar from "../user/userAvatar";
import UserLink from "../user/userLink";

import PrivateIndicator from "./privateIndicator";
import TextRenderer from "./textRenderer";

export type CommentProps = Omit<CommentType, "parentCuid">;

export default function Comment({
  id,
  username,
  createdAt,
  content,
  isPrivate
}: CommentProps) {
  const relativeDate = useRelativeDateFormatter();

  const user = useOptionalUser();
  const editable =
    user?.username === username || access(user, Access.ManageCommunity);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const cancelRef = useRef<HTMLButtonElement>(null);

  const { Form } = useFetcher();

  const { t } = useTranslation();

  return (
    <Flex direction="column" w="100%" role="group">
      <Flex mb={2}>
        <Flex align="center" wrap="wrap" flex={1} gap={3}>
          <UserAvatar username={username} />

          <Box>
            <UserLink username={username} />

            <Box color="gray.400" fontSize="xs">
              <PrivateIndicator isPrivate={isPrivate} />

              <Tooltip label={formatDate(createdAt)} openDelay={500}>
                {relativeDate(createdAt)}
              </Tooltip>
            </Box>
          </Box>
        </Flex>

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
                  action="/api/comment/delete"
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
                  <input type="hidden" value={id} name="id" />
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        ) : null}

        {editable ? (
          <IconButton
            opacity={0}
            _groupHover={{ opacity: "100%" }}
            transition="opacity .2s ease"
            aria-label="delete"
            icon={<DeleteIcon />}
            onClick={onOpen}
            size="sm"
            variant="ghost"
          />
        ) : null}
      </Flex>

      <Box overflowY="auto" maxH="200px">
        <TextRenderer>{content}</TextRenderer>
      </Box>
    </Flex>
  );
}
