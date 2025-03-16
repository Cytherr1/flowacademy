"use client";
import { Card, Image, Text } from "@mantine/core";
import NextImage from "next/image";
import placeholder from "../static_content/placholder.png";

export default function ProjectCard(props: any) {
  return (
	  <Card
      w={225}
      h={350}
      p="md"
      shadow="sm"
      component="a"
      href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      target="_blank"
    >
      <Card.Section>
        <Image
          component={NextImage}
          src={placeholder}
          h={250}
          alt="No way!"
        />
      </Card.Section>

      <Text p="lg" ta="center" size="lg" fw={500} lineClamp={2}>
        Project document SEN2202 aaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaa
      </Text>
    </Card>
  )
}
