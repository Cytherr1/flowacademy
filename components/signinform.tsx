"use client";
import { zodResolver } from 'mantine-form-zod-resolver';
import { useForm } from '@mantine/form';
import { Button, Group, Paper, PasswordInput, Stack, TextInput } from '@mantine/core';
import { userLogin } from '@/lib/actions/auth';
import { loginSchema } from '@/lib/schema';

export default function SignInForm() {
  
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: "",
      password: ""
    },
    validate: zodResolver(loginSchema),
    onSubmitPreventDefault: 'validation-failed',
  });

  return (
    <form 
      action={ async (formData: FormData) => {
        form.validate()
        if(form.isValid()) {
          await userLogin(formData);
        }
    }}>
      <Paper
        withBorder
        component={Stack}
        p="md"
        w={350}
      >
        <TextInput
          label="Email"
          name='email'
          placeholder="flowacademy@email.com"
          key={form.key("email")}
          {...form.getInputProps('email')}
        />
        <PasswordInput
          label="Password"
          name='password'
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