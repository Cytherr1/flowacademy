"use client";
import { zodResolver } from 'mantine-form-zod-resolver';
import { useForm } from '@mantine/form';
import { Button, Group, Paper, PasswordInput, Stack, TextInput } from '@mantine/core';
import { editProfile } from '@/lib/schema';
import { editUser } from '@/lib/actions/user';

export default function EditProfileForm(props : any) {
  
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: props.session.user?.name ?? "",
      username: props.session.user?.username ?? "",
      image: props.session.user?.image ?? "",
      password: "",
      confirmPassword: ""
    },
    validate: zodResolver(editProfile),
    onSubmitPreventDefault: 'validation-failed',
  });

  return (
    <form 
      action={ async (formData: FormData) => {
        form.validate()
        if(form.isValid()) {
          await editUser(formData, props.session);
        }
    }}>
      <Paper
        withBorder
        component={Stack}
        p="md"
        w={350}
      >
        <TextInput
          label="Name"
          name='name'
          key={form.key("name")}
          {...form.getInputProps('name')}
        />
        <TextInput
          label="Username"
          name='username'
          key={form.key("username")}
          {...form.getInputProps('username')}
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
          <Button variant="default" type="submit">Confirm changes</Button>
        </Group>
      </Paper>
    </form>
  )
}