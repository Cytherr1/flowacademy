"use client";
import { Alert } from "@mantine/core";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";

export default function AlertBox({ type, text } : {
  type: string | null, 
  text: string
}) {

  return (
    <>
      {text && (
          <Alert
            icon={type === 'success' ? <IconCheck /> : <IconAlertCircle />}
            title={type === 'success' ? 'Success' : 'Error'}
            color={type === 'success' ? 'green' : 'red'}
          >
            {text}
          </Alert>
        )}
    </>
  )
}