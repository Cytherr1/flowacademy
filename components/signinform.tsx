"use client";
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import { useForm } from '@mantine/form';
import { Button, Group, Paper, PasswordInput, Stack, TextInput } from '@mantine/core';

export default function SignInForm() {

  const schema = z.object({
    email: z.string().email({ message: 'Invalid email' }),
    password: z.string().min(8, { message: 'Invalid password' })
  });
  
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: "",
    password: ""
    },
    validate: zodResolver(schema),
  });

  return (
    <form onSubmit={(e) => { 
      e.preventDefault()
      form.validate();
      form.errors;
    }}>
      <Paper
        withBorder
        component={Stack}
        p="md"
        w={350}
      >
        <TextInput
          label="Email"
          placeholder="flowacademy@email.com"
          key={form.key("email")}
          {...form.getInputProps('email')}
        />
        <PasswordInput
          label="Password"
          key={form.key("password")}
          {...form.getInputProps('password')}
        />
        <Group justify="flex-end" mt="md">
          <Button variant="default" type="submit">Sign in</Button>
        </Group>
      </Paper>
    </form>
  )
}