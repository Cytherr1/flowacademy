import Page from '@/components/page'
import { Anchor, Stack, Text, Title } from '@mantine/core'
import Link from 'next/link'
 
export default function NotFound() {
  return (
    <Page>
      <Stack miw="100%" mah="100%" justify='center' align='center'>
        <Title order={2}>404 Not Found</Title>
        <Text>Could not find requested resource</Text>
        <Anchor component={Link} href="/" underline="never">
          Return Home
        </Anchor>
      </Stack>
    </Page>
  )
}