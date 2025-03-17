import CreateNewButton from '@/components/createnewbutton';
import Page from '@/components/page';
import { auth } from '@/lib/auth';
import { ActionIcon, Button, Flex, Stack, Table, TableTbody, TableTd, TableTh, TableThead, TableTr } from '@mantine/core'
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const elements = [
  { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
  { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
  { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
  { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium' },
  { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
];

export default async function page() {
  const session = await auth();
  if(!session) redirect("/signin");

  const rows = elements.map((element) => (
    <TableTr
      key={element.name}
    >
      <TableTd>{element.name}</TableTd>
      <TableTd>
        <ActionIcon variant="default" size="input-sm">
          <IconEdit/>
        </ActionIcon>
      </TableTd>
      <TableTd>
        <ActionIcon variant="light" size="input-sm" color='red'>
          <IconTrash/>
        </ActionIcon>
      </TableTd>
    </TableTr>
  ));

  return (
    <Page>
      <Flex justify='center' w="100%" p="md">
        <Stack align='flex-start' w="90%">
          <CreateNewButton></CreateNewButton>
          <Table horizontalSpacing="xl">
            <TableThead>
              <TableTr>
                <TableTh>Element name</TableTh>
                <TableTh>Edit</TableTh>
                <TableTh>Delete</TableTh>
              </TableTr>
            </TableThead>
            <TableTbody>{rows}</TableTbody>
          </Table>
        </Stack>
      </Flex>
    </Page>
  )
}
