"use client";
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Group, Stack, Text } from '@mantine/core';
import { Session } from 'next-auth';
import { deleteUser } from '@/lib/actions/user';
import { useState } from 'react';

export default function DeleteProfileButton({ session } : {
  session : Session
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);

  return (
	<>
	  <Modal opened={opened} onClose={close} centered size="lg" withCloseButton={false} p="xs">
      <Stack p="xs">
        <Text size='lg' >Are you sure? This action is irreversable.</Text>
        <Group p="xs" justify='flex-end'>
          <Button variant="default" onClick={close}>Cancel</Button>
          <Button variant="outline" loading={loading} onClick={async () => { setLoading(true); await deleteUser(session.user.id as string); setLoading(false); }} color='red'>
            Delete
          </Button>
        </Group>
      </Stack>
	  </Modal>
	  <Button variant="outline" onClick={open} color='red'>
		  Delete my account
	  </Button>
	</>
  );
}