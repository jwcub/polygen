import { useFetchers, useNavigation } from "@remix-run/react";
import nprogress from "nprogress";
import { useEffect } from "react";

nprogress.configure({ showSpinner: false, trickleSpeed: 161 });

function useGlobalLoadingState() {
  const navigation = useNavigation();
  const fetchers = useFetchers();

  const states = [navigation.state, ...fetchers.map(fetcher => fetcher.state)];

  if (states.includes("submitting")) {
    return "submitting";
  } else if (states.includes("loading")) {
    return "loading";
  } else {
    return "idle";
  }
}

export function useNProgress() {
  const state = useGlobalLoadingState();

  useEffect(() => {
    if (state === "idle") {
      nprogress.done();
    } else {
      nprogress.start();
    }
  }, [state]);
}
