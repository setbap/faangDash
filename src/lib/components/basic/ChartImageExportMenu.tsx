import {
  MenuItem,
  useColorModeValue,
  Link,
  useToast,
  MenuOptionGroup,
} from "@chakra-ui/react";
import { FiCopy, FiDownload, FiExternalLink } from "react-icons/fi";
import html2canvas from "html2canvas";
import { forwardRef } from "react";
const exportImageHandler = ({
  element,
  action,
  title,
  toastFn,
}: {
  title: string;
  element: HTMLElement;
  toastFn: any;
  action: "new-tab" | "download" | "copy";
}) => {
  toastFn({
    title: "please wait",
    description: "Preparing image...",
    status: "loading",
    duration: 1300,
    isClosable: true,
  });
  setTimeout(() => {
    html2canvas(element, { backgroundColor: "transparent" })
      .then((dataUrl) => {
        if (action === "download") {
          const image = dataUrl.toDataURL("image/png");
          const link = document.createElement("a");
          link.download = `${title.replaceAll(" ", "_")}.png`;
          link.href = image;
          link.click();
        } else if (action === "new-tab") {
          var win = window.open();
          win!.document.write(
            '<iframe src="' +
              dataUrl.toDataURL("png") +
              '" frameborder="0" style="border:0;margin:0 auth;  top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen> </iframe>'
          );
        } else {
          dataUrl.toBlob((blob) =>
            navigator.clipboard
              .write([new ClipboardItem({ "image/png": blob! })])
              .then(() => {
                toastFn({
                  title: "Image copied successfully",
                  status: "success",
                  duration: 1300,
                  isClosable: true,
                });
              })
          );
        }
      })
      .catch((err) => {});
  }, 200);
};

const ChartImageExportMenu = forwardRef(({ title }: any, ref: any) => {
  const toast = useToast();

  return (
    <MenuOptionGroup title="Image Export" type="radio">
      <MenuItem
        closeOnSelect
        onClick={() => {
          return exportImageHandler({
            title,
            toastFn: toast,
            element: ref.current,
            action: "download",
          });
        }}
        _hover={{
          bg: useColorModeValue("#eee", "#191919"),
        }}
        bg={useColorModeValue("white", "#232323")}
        icon={<FiDownload />}
      >
        Download
      </MenuItem>
      <MenuItem
        closeOnSelect
        onClick={() =>
          exportImageHandler({
            title,
            element: ref.current,
            action: "copy",
            toastFn: toast,
          })
        }
        _hover={{
          bg: useColorModeValue("#eee", "#191919"),
        }}
        bg={useColorModeValue("white", "#232323")}
        icon={<FiCopy />}
      >
        Copy to Clipboard
      </MenuItem>
      <MenuItem
        closeOnSelect
        onClick={() =>
          exportImageHandler({
            title,
            toastFn: toast,
            element: ref.current,
            action: "new-tab",
          })
        }
        _hover={{
          bg: useColorModeValue("#eee", "#191919"),
        }}
        bg={useColorModeValue("white", "#232323")}
        icon={<FiExternalLink />}
        as={Link}
        isExternal
      >
        Open in new Tab
      </MenuItem>
    </MenuOptionGroup>
  );
});

export default ChartImageExportMenu;
