"use client";
import { Group, Text, Image } from "@mantine/core";
import NextImage from "next/image";

interface AccordionLabelProps {
  label: string;
  image: string;
  description: string;
}

export default function AccordionLabel({
  label,
  image,
  description,
}: AccordionLabelProps) {
  // Handle image path - convert relative paths to absolute
  const imageSrc = image.startsWith("../") 
    ? image.replace("../", "/") 
    : image.startsWith("./") 
      ? image.replace("./", "/") 
      : image;

  return (
    <Group wrap="nowrap">
      <Image
        h={75}
        w={75}
        fit="contain"
        component={NextImage}
        src={imageSrc}
        alt={`${label} logo`}
        width={75}
        height={75}
      />
      <div>
        <Text size="xl">{label}</Text>
        <Text size="lg" c="dimmed">
          {description}
        </Text>
      </div>
    </Group>
  );
}