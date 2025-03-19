"use client";

import { useState } from "react";
import {
  Table,
  Center,
  Stack,
  Title,
  Image,
  Group,
  ActionIcon,
  TextInput,
  Button,
  AspectRatio,
} from "@mantine/core";
import {
  IconArrowBigRightLines,
  IconArrowBigRightLinesFilled,
  IconCircle,
  IconCircleFilled,
  IconTriangleInverted,
  IconTriangleInvertedFilled,
  IconSquare,
  IconSquareFilled,
  IconPlus,
} from "@tabler/icons-react";
import NextImage from "next/image";
import placeholder from "../static_content/placholder.png";

interface ProjectComponentProps {
  video: string | undefined;
  workspaceName: string | undefined;
}

type Activity = {
  no: number;
  activity: string;
  distance: number;
  time: number;
  selectedSymbol: number | null;
  remarks: string;
};

export default function ProjectComponent({
  video,
  workspaceName,
}: ProjectComponentProps) {
  const initialActivities: Activity[] = [
    {
      no: 1,
      activity: "Collect small pieces of fabric.",
      distance: 0,
      time: 3,
      selectedSymbol: null,
      remarks: "",
    },
    {
      no: 2,
      activity: "Transport fabric pieces to sewing machine",
      distance: 15,
      time: 2,
      selectedSymbol: null,
      remarks: "",
    },
    {
      no: 3,
      activity: "Wait for machine availability",
      distance: 0,
      time: 5,
      selectedSymbol: null,
      remarks: "",
    },
    {
      no: 4,
      activity: "Inspect machine setup",
      distance: 0,
      time: 3,
      selectedSymbol: null,
      remarks: "By a human",
    },
    {
      no: 5,
      activity: "Attach fabric pieces to the machine",
      distance: 0,
      time: 3,
      selectedSymbol: null,
      remarks: "",
    },
    {
      no: 6,
      activity: "Sew fabric pieces together",
      distance: 0,
      time: 10,
      selectedSymbol: null,
      remarks: "",
    },
    {
      no: 7,
      activity: "Remove sewn fabric pieces",
      distance: 0,
      time: 2,
      selectedSymbol: null,
      remarks: "",
    },
    {
      no: 8,
      activity: "Transport sewn pieces to storage area",
      distance: 25,
      time: 3,
      selectedSymbol: null,
      remarks: "By a machine",
    },
    {
      no: 9,
      activity: "Store fabric pieces in the warehouse",
      distance: 0,
      time: 2,
      selectedSymbol: null,
      remarks: "",
    },
  ];

  const iconMapping = [
    { outlined: IconCircle, filled: IconCircleFilled },
    { outlined: IconSquare, filled: IconSquareFilled },
    { outlined: IconArrowBigRightLines, filled: IconArrowBigRightLinesFilled },
    { outlined: IconCircle, filled: IconCircleFilled },
    { outlined: IconTriangleInverted, filled: IconTriangleInvertedFilled },
  ];

  const [activities, setActivities] = useState<Activity[]>(initialActivities);

  const handleSymbolClick = (activityIndex: number, iconIndex: number) => {
    setActivities((prevActivities) =>
      prevActivities.map((activity, index) =>
        index === activityIndex
          ? { ...activity, selectedSymbol: iconIndex }
          : activity
      )
    );
  };

  const handleChange = (
    activityIndex: number,
    field: keyof Activity,
    value: string | number
  ) => {
    setActivities((prevActivities) =>
      prevActivities.map((activity, index) =>
        index === activityIndex ? { ...activity, [field]: value } : activity
      )
    );
  };

  const addNewRow = () => {
    const newActivity: Activity = {
      no: activities.length + 1,
      activity: "",
      distance: 0,
      time: 0,
      selectedSymbol: null,
      remarks: "",
    };
    setActivities([...activities, newActivity]);
  };

  const rows = activities.map((act, actIndex) => (
    <Table.Tr key={act.no}>
      <Table.Td>{act.no}</Table.Td>
      <Table.Td>
        <TextInput
          value={act.activity}
          onChange={(e) => handleChange(actIndex, "activity", e.target.value)}
          placeholder="Enter activity"
          size="xs"
        />
      </Table.Td>
      <Table.Td>
        <TextInput
          type="number"
          value={act.distance}
          onChange={(e) =>
            handleChange(actIndex, "distance", Number(e.target.value))
          }
          placeholder="Enter distance"
          size="xs"
        />
      </Table.Td>
      <Table.Td>
        <TextInput
          type="number"
          value={act.time}
          onChange={(e) =>
            handleChange(actIndex, "time", Number(e.target.value))
          }
          placeholder="Enter time"
          size="xs"
        />
      </Table.Td>
      <Table.Td>
        <Group>
          {iconMapping.map((icon, iconIndex) => {
            const IconComponent =
              act.selectedSymbol === iconIndex ? icon.filled : icon.outlined;
            return (
              <ActionIcon
                key={iconIndex}
                size="sm"
                onClick={() => handleSymbolClick(actIndex, iconIndex)}
              >
                <IconComponent size={18} />
              </ActionIcon>
            );
          })}
        </Group>
      </Table.Td>
      <Table.Td>
        <TextInput
          value={act.remarks}
          onChange={(e) => handleChange(actIndex, "remarks", e.target.value)}
          placeholder="Enter remark"
          size="xs"
        />
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Center miw="100%" mah="100%">
      <Stack>
        <Title mt="sm" ta="center" order={1}>{workspaceName?.toString()}</Title>
        <AspectRatio ratio={1920 / 1080}>
          <iframe
            src={video}
            style={{ border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </AspectRatio>
        <Table highlightOnHover withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Activity No.</Table.Th>
              <Table.Th>Activity</Table.Th>
              <Table.Th>Distance (m)</Table.Th>
              <Table.Th>Time (m)</Table.Th>
              <Table.Th>Symbols</Table.Th>
              <Table.Th>Remarks</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
        <Button onClick={addNewRow} mt="xs" mb="xl" variant="light">
          <IconPlus size={24} />
          Add Row
        </Button>
      </Stack>
    </Center>
  );
}
