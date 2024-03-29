import { Center, Spinner } from "@chakra-ui/react";
import nprogress from "nprogress";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

export default function LoadMore({
  loader
}: {
  loader: (page: number) => Promise<boolean>;
}) {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(2);

  const { t } = useTranslation();

  const loadMore = useCallback(() => {
    nprogress.start();
    setLoading(true);

    loader(page).then(visible => {
      setLoading(false);
      setPage(page => (visible ? page + 1 : -1));
      nprogress.done();
    });
  }, [loader, page]);

  return (
    page !== -1 && (
      <Center
        w="100%"
        color="gray.400"
        fontSize="sm"
        _hover={
          loading
            ? undefined
            : { color: "gray.700", _dark: { color: "gray.100" } }
        }
        cursor={loading ? undefined : "pointer"}
        transition="color .1s ease"
        onClick={loadMore}
      >
        {loading ? <Spinner /> : t("community.showMore")}
      </Center>
    )
  );
}
