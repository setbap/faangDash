import {
  MenuOptionGroup,
  MenuItemOption,
  useColorModeValue,
} from "@chakra-ui/react";

export default function ChartSpanMenu({
  baseSpan,
  onChange,
}: {
  baseSpan: number;
  onChange: (span: string | string[]) => void;
}) {
  return (
    <MenuOptionGroup
      onChange={onChange}
      defaultValue={baseSpan + ""}
      title="Chart Width"
      type="radio"
    >
      <MenuItemOption
        _hover={{
          bg: useColorModeValue("#eee", "#191919"),
        }}
        bg={useColorModeValue("white", "#232323")}
        value={"1"}
      >
        1 {baseSpan === 1 && "(default)"}
      </MenuItemOption>
      <MenuItemOption
        _hover={{
          bg: useColorModeValue("#eee", "#191919"),
        }}
        bg={useColorModeValue("white", "#232323")}
        value={"2"}
      >
        2 {baseSpan === 2 && "(default)"}
      </MenuItemOption>
      <MenuItemOption
        _hover={{
          bg: useColorModeValue("#eee", "#191919"),
        }}
        bg={useColorModeValue("white", "#232323")}
        value={"3"}
      >
        3 {baseSpan === 3 && "(default)"}
      </MenuItemOption>
    </MenuOptionGroup>
  );
}
