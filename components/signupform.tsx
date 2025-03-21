"use client";
import { zodResolver } from 'mantine-form-zod-resolver';
import { useForm } from '@mantine/form';
import { Button, Group, Paper, PasswordInput, Stack, TextInput } from '@mantine/core';
import { register } from '@/lib/actions/auth';
import { signUpSchema } from '@/lib/schema';

export default function SignUpForm() {
  
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    validate: zodResolver(signUpSchema),
    onSubmitPreventDefault: 'validation-failed',
  });

  return (
    <form 
      action={ async (formData: FormData) => {
        form.validate()
        if(form.isValid()) {
          await register(formData);
        }
    }}>
      <Paper
        withBorder
        component={Stack}
        p="md"
        w={350}
      >
        <TextInput
          label="Username"
          name='username'
          key={form.key("username")}
          {...form.getInputProps('username')}
        />
        <TextInput
          label="Email"
          name='email'
          key={form.key("email")}
          {...form.getInputProps('email')}
        />
        <PasswordInput
          label="Password"
          name='password'
          key={form.key("password")}
          {...form.getInputProps('password')}
        />
        <PasswordInput
          label="Confirm password"
          name='confirmPassword'
          key={form.key("confirmPassword")}
          {...form.getInputProps('confirmPassword')}
        />
        <Group justify="flex-end" mt="md">
          <Button variant="default" type="submit">Sign up</Button>
        </Group>
      </Paper>
    </form>
  )
}