import { useEffect, useState } from "react";
import throttle from "lodash/fp/throttle";
import { useRouter } from "next/router";
const offsetInPX = () => {
  return -150;
};
const WaitInMs = 100;
function useHeaderLink() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<Element | null>(null);
  const [sectionText, setSectionText] = useState("");

  const handle = throttle(WaitInMs, () => {
    let currentSectionId = activeSection;
    const elements = document.querySelectorAll("[data-section]");
    for (let i = 0; i < elements.length; i += 1) {
      const section = elements[i];
      if (!section || !(section instanceof Element)) continue;
      if (section.getBoundingClientRect().top + offsetInPX() < 0) {
        currentSectionId = section;
        continue;
      }
      break;
    }
    if (currentSectionId != activeSection) {
      setActiveSection(currentSectionId);
      setSectionText(currentSectionId?.id ?? "");
    }
  });

  useEffect(() => {
    if (!isClientSide()) {
      return;
    }
    handle();

    return () => {};
  }, [router.route]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const delayHandleChange = () => {
      setTimeout(() => {
        handle();
      }, 1300);
    };
    const scrollable = window;
    scrollable.addEventListener("scroll", handle);
    router.events.on("routeChangeComplete", delayHandleChange);

    return () => {
      scrollable.removeEventListener("scroll", handle);
      router.events.off("routeChangeComplete", delayHandleChange);
    };
  }, [handle]);

  if (isClientSide() && sectionText == "") {
    const elements = document.querySelectorAll("[data-type]");
    const data: string[] = [];
    elements.forEach((element: any) => data.push(element.dataset.id));
    return { sectionText: data[0], allSections: data, handler: handle };
  }

  return { sectionText, handler: handle };
}

export default useHeaderLink;
function isClientSide() {
  return typeof window !== "undefined";
}
