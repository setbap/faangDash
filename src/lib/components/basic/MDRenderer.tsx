import { Box, Link, chakra, Image, Heading } from "@chakra-ui/react";
import React from "react";
import { FiExternalLink } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import Renderer from "chakra-ui-markdown-renderer";

export default function MDRenderer({ children }: any) {
  return (
    <ReactMarkdown
      components={Renderer({
        a: CustomMarkDownLink,
        p: (props) => (
          <chakra.p fontWeight={"normal"} lineHeight={"8"}>
            {props.children}
          </chakra.p>
        ),
        li: (props) => (
          <chakra.li fontWeight={"normal"} lineHeight={"5"}>
            {props.children}
          </chakra.li>
        ),
        img: (props) => (
          <Image
            objectFit="cover"
            mx={"auto"}
            cursor="pointer"
            shadow={"dark-lg"}
            style={{ borderRadius: "16px" }}
            borderRadius="2xl"
            my={"4"}
            src={props.src}
            alt={props.alt}
          />
        ),
        h2: (props) => (
          <Heading as="h2" size="2xl" py={"1.5"}>
            {props.children}
          </Heading>
        ),

        h3: (props) => (
          <Heading as="h3" size="xl" pt={"0.5"} pb={"1"}>
            {props.children}
          </Heading>
        ),

        h4: (props) => (
          <Heading py={"0.5"} as="h4" size="lg">
            {props.children}
          </Heading>
        ),

        h5: (props) => (
          <Heading
            py={"1"}
            as="h5"
            size="md"
            fontWeight={"normal"}
            letterSpacing="wider"
          >
            {props.children}
          </Heading>
        ),
      })}
    >
      {children}
    </ReactMarkdown>
  );
}

const CustomMarkDownLink = (props: any) => {
  return (
    <Link
      href={props.href}
      isExternal
      target="_blank"
      rel="noopener noreferrer"
      display={"inline-flex"}
    >
      {props.children}{" "}
      <FiExternalLink style={{ paddingInline: "1px", marginLeft: "2px" }} />
    </Link>
  );
};
