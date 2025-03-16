"use client";
import Page from "@/components/page";
import { useState } from 'react';
import { Stepper, StepperStep } from '@mantine/core';

export default function CreateProject() {

  const [active, setActive] = useState(1);

  return (
	<Page>
	  <Stepper active={active} onStepClick={setActive} iconPosition="right">
		<StepperStep label="Step 1" description="Create an account" />
		<StepperStep label="Step 2" description="Verify email" />
		<StepperStep label="Step 3" description="Get full access" />
	  </Stepper>
	</Page>
  )
}