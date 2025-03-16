"use client";
import { ActionIcon, Card, Image, Text } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import React from 'react'

export default function CreateProjectButton() {
  return (
	  <ActionIcon
		  w={225}
      h={350}
      p="md"
      variant='default'
      component={Link}
      href="/createproject"
		>
			<IconPlus/>
		</ActionIcon>
  )
}
