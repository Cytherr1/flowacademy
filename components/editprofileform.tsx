"use client";
import { zodResolver } from "mantine-form-zod-resolver";
import { useForm } from "@mantine/form";
import {
  Button,
  Group,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { editProfile } from "@/lib/schema";
import { editUser } from "@/lib/actions/user";
import { Session } from "next-auth";
import { executeAction } from "@/lib/executeAction";
import { useState } from "react";
import AlertBox from "./alertbox";

interface EditProfileProps {
  name: string | null | undefined;
  username: string | null | undefined;
  image: string | null | undefined;
  session: Session;
}

export default function EditProfileForm({name, username, image, session} : EditProfileProps) {

  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | null }>({
      text: '',
      type: null,
    });

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: name ?? "",
      username: username ?? "",
      image: image ?? "",
      password: "",
      confirmPassword: "",
    },
    validate: zodResolver(editProfile),
    onSubmitPreventDefault: "validation-failed",
  });

  return (
    <form
      onSubmit={() => form.setSubmitting(true)}
      action={async (formData: FormData) => {
        form.validate();
        if (form.isValid()) {
          const res = await executeAction({
            actionFn: async () => await editUser(formData, session),
            successMessage: "Changes saved."
          })
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
      }}
    >
      <Paper withBorder component={Stack} p="md" w={350}>
        <AlertBox type={message.type} text={message.text} />
        <TextInput
          label="Name"
          name="name"
          key={form.key("name")}
          {...form.getInputProps("name")}
        />
        <TextInput
          label="Username"
          name="username"
          key={form.key("username")}
          {...form.getInputProps("username")}
        />
        <PasswordInput
          label="Password"
          name="password"
          key={form.key("password")}
          {...form.getInputProps("password")}
        />
        <PasswordInput
          label="Confirm password"
          name="confirmPassword"
          key={form.key("confirmPassword")}
          {...form.getInputProps("confirmPassword")}
        />
        <Group justify="flex-end" mt="md">
          <Button variant="default" type="submit" disabled={!form.isDirty()} loading={form.submitting}>
            Confirm changes
          </Button>
        </Group>
      </Paper>
    </form>
  );
}
