"use client";
import { zodResolver } from 'mantine-form-zod-resolver';
import { useForm } from '@mantine/form';
import { Button, Group, Paper, PasswordInput, Stack, TextInput } from '@mantine/core';
import { register } from '@/lib/actions/auth';
import { signUpSchema } from '@/lib/schema';
import { useState } from 'react';
import AlertBox from './alertbox';

export default function SignUpForm() {
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | null }>({
    text: '',
    type: null,
  });
  
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
      onSubmit={() => form.setSubmitting(true)}
      action={ async (formData: FormData) => {
        form.validate()
        if(form.isValid()) {
          const res = await register(formData);
          if (!res.success) {
            setMessage({text: res.message, type: "error"})
            setTimeout(() => setMessage({text: "", type: null}), 2500)
          } else {
            setMessage({text: res.message, type: "success"})
            setTimeout(() => setMessage({text: "", type: null}), 2500)
          }
        }
        form.setSubmitting(false);
        form.resetDirty();
    }}>
      <Paper
        withBorder
        component={Stack}
        p="md"
        w={350}
      >
        <AlertBox type={message.type} text={message.text} />
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
          <Button variant="default" type="submit" disabled={!form.isDirty()} loading={form.submitting}>Sign up</Button>
        </Group>
      </Paper>
    </form>
  )
}