import { Button } from "@mantine/core";
import {
  IconBrandGithubFilled,
  IconBrandInstagramFilled,
  IconBrandLinkedinFilled,
  IconWorld,
} from "@tabler/icons-react";

interface DataItem {
  id: string;
  image: string;
  label: string;
  description: string;
  content: string;
  social1?: string;
  social2?: string;
  social3?: string;
  social4?: string;
}

export const getSocialButtons = (item: DataItem) => {
  const socialLinks = [
    { url: item.social1, icon: <IconWorld size={18} />, label: "Website" },
    {
      url: item.social2,
      icon: <IconBrandGithubFilled size={18} />,
      label: "GitHub",
    },
    {
      url: item.social3,
      icon: <IconBrandLinkedinFilled size={18} />,
      label: "LinkedIn",
    },
    {
      url: item.social4,
      icon: <IconBrandInstagramFilled size={18} />,
      label: "Instagram",
    },
  ];

  return socialLinks
    .filter((social) => social.url)
    .map((social, index) => (
      <Button
        key={index}
        component="a"
        href={social.url}
        target="_blank"
        rel="noopener noreferrer"
        variant="light"
      >
        {social.icon}
        <span style={{ marginLeft: "8px" }}>{social.label}</span>
      </Button>
    ));
};
