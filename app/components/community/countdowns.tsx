import { Text, Tooltip, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import { useServerTime } from "~/hooks/loader";
import type { TFunctionArg } from "~/i18n/i18next";

const countDowns = [{ date: "2024-08-01", name: "publicPreview" }];

function Countdown({ date, name }: { date: string; name: string }) {
  const now = useServerTime().getTime();
  const { i18n, t } = useTranslation();

  const days = Math.ceil((new Date(date).getTime() - now) / 1000 / 86400);

  return i18n.language === "zh" ? (
    <Text>
      距离&nbsp;
      <Tooltip label={date} openDelay={500}>
        <strong>{t(("community." + name) as TFunctionArg)}</strong>
      </Tooltip>
      &nbsp;还有&nbsp;
      <strong>{days}</strong>
      &nbsp;天
    </Text>
  ) : (
    <Text>
      <strong>{days}</strong>
      &nbsp;day{t("utils.plurals", { count: days })}
      &nbsp;before&nbsp;
      <Tooltip label={date} openDelay={500}>
        <strong>{t(("community." + name) as TFunctionArg)}</strong>
      </Tooltip>
    </Text>
  );
}

export default function Countdowns() {
  return (
    <VStack textAlign="center">
      {countDowns.map(({ date, name }) => (
        <Countdown key={name} date={date} name={name} />
      ))}
    </VStack>
  );
}
