import { Button } from "@chakra-ui/react";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsFillSendFill } from "react-icons/bs";

import Editor from "./editor";

export default function AddComment({ parentCuid }: { parentCuid: string }) {
  const { state, Form } = useFetcher();
  const [value, setValue] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    if (state === "idle") {
      setValue("");
    }
  }, [state]);

  return (
    <Form method="post" style={{ width: "100%" }}>
      <Editor value={value} setValue={setValue} mb={4} />
      <input type="hidden" name="parentCuid" value={parentCuid} />
      <Button
        float="right"
        colorScheme="blue"
        isDisabled={value.trim().length === 0}
        isLoading={state !== "idle"}
        leftIcon={<BsFillSendFill />}
        type="submit"
      >
        {t("community.addComment")}
      </Button>
    </Form>
  );
}
