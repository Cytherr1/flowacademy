"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Center,
  Stack,
  Title,
  Group,
  ActionIcon,
  TextInput,
  Button,
  AspectRatio,
  Notification,
  Flex,
  Modal,
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
  IconDeviceFloppy,
  IconCheck,
  IconX,
  IconTrash,
  IconClipboardTextFilled,
} from "@tabler/icons-react";
import { deleteRow, saveProjectRows } from "@/lib/actions/projectActions";
import { useDisclosure } from "@mantine/hooks";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";

interface ProjectComponentProps {
  id: number;
  video: string | null | undefined;
  workspaceName: string | undefined;
  rows: Rows[];
  is_outsource: boolean | undefined;
}

type Rows = {
  distance: number;
  time: number;
  remarks: string | null;
  activityNo: number;
  activityName: string;
  symbolIndex: number | null;
};

export default function ProjectComponent({
  id,
  video,
  workspaceName,
  rows: initialRows,
  is_outsource,
}: ProjectComponentProps) {
  const iconMapping = [
    { outlined: IconCircle, filled: IconCircleFilled },
    { outlined: IconSquare, filled: IconSquareFilled },
    { outlined: IconArrowBigRightLines, filled: IconArrowBigRightLinesFilled },
    { outlined: IconCircle, filled: IconCircleFilled },
    { outlined: IconTriangleInverted, filled: IconTriangleInvertedFilled },
  ];

  const [activities, setActivities] = useState<Rows[]>(initialRows || []);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  useEffect(() => {
    if (initialRows && initialRows.length > 0) {
      setActivities(initialRows);
    }
  }, [initialRows]);

  const handleSymbolClick = (activityIndex: number, iconIndex: number) => {
    setActivities((prevActivities) =>
      prevActivities.map((activity, index) =>
        index === activityIndex
          ? { ...activity, symbolIndex: iconIndex }
          : activity
      )
    );
  };

  const handleChange = (
    activityIndex: number,
    field: keyof Rows,
    value: string | number
  ) => {
    setActivities((prevActivities) =>
      prevActivities.map((activity, index) =>
        index === activityIndex ? { ...activity, [field]: value } : activity
      )
    );
  };

  const addNewRow = () => {
    const newActivity: Rows = {
      activityNo: activities.length + 1,
      activityName: "",
      distance: 0,
      time: 0,
      symbolIndex: null,
      remarks: null,
    };
    setActivities([...activities, newActivity]);
  };

  const saveRows = async () => {
    setSaving(true);
    setSaveStatus(null);
    const workspaceID = await id;

    try {
      await saveProjectRows({
        workspaceID,
        activities,
      });

      setSaveStatus({
        success: true,
        message: "Activities saved successfully",
      });
    } catch (error) {
      console.error("Error saving activities:", error);
      setSaveStatus({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to save activities",
      });
    } finally {
      setSaving(false);

      if (saveStatus) {
        setTimeout(() => {
          setSaveStatus(null);
        }, 3000);
      }
    }
  };

  const handleDelete = async (activityNo: number) => {
    setDeleting(true);
    setDeleteStatus(null);

    const workspaceID = await id;

    try {
      await deleteRow({
        workspaceID,
        activityNo,
      });

      setActivities((prevActivities) =>
        prevActivities.filter((activity) => activity.activityNo !== activityNo)
      );

      setActivities((prevActivities) =>
        prevActivities.map((activity, index) => ({
          ...activity,
          activityNo: index + 1,
        }))
      );

      setDeleteStatus({
        success: true,
        message: "Row deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting row:", error);
      setDeleteStatus({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to delete row",
      });
    } finally {
      if (deleteStatus) {
        setTimeout(() => {
          setSaveStatus(null);
        }, 3000);
      }
    }
  };

  const generatePDF = () => {
    setGeneratingPdf(true);
    try {
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text(workspaceName || "Project Activities", 14, 20);
      doc.setFontSize(12);

      const getSymbolText = (symbolIndex: number | null) => {
        if (symbolIndex === null) return "";
        const symbols = ["Circle", "Square", "Arrow", "D Shape", "Triangle"];
        return symbols[symbolIndex] || "";
      };

      const tableData = activities.map((act) => [
        act.activityNo.toString(),
        act.activityName,
        act.distance.toString(),
        act.time.toString(),
        getSymbolText(act.symbolIndex),
        act.remarks || "",
      ]);

      autoTable(doc, {
        head: [
          ["No.", "Activity", "Distance (m)", "Time (m)", "Symbol", "Remarks"],
        ],
        body: tableData,
        startY: 30,
        theme: "grid",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 139, 202] },
      });

      const pdfBlob = doc.output("blob");
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      open();
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setGeneratingPdf(false);
    }
  };

  const tableRows = activities.map((act, actIndex) => (
    <Table.Tr key={act.activityNo}>
      <Table.Td>{act.activityNo}</Table.Td>
      <Table.Td>
        <TextInput
          value={act.activityName}
          onChange={(e) =>
            handleChange(actIndex, "activityName", e.target.value)
          }
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
              act.symbolIndex === iconIndex ? icon.filled : icon.outlined;
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
          value={act.remarks || ""}
          onChange={(e) => handleChange(actIndex, "remarks", e.target.value)}
          placeholder="Enter remark"
          size="xs"
        />
      </Table.Td>
      <Table.Td>
        <Button
          loading={deleting}
          variant="light"
          size="input-sm"
          color="red"
          onClick={() => handleDelete(act.activityNo)}
        >
          <IconTrash />
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Center miw="100%" mah="100%">
      <Stack>
        <Title mt="sm" ta="center" order={1}>
          {workspaceName?.toString()}
        </Title>
        {video && (
          <AspectRatio>
            <iframe
              src={video}
              style={{ border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </AspectRatio>
        )}

        {video && is_outsource === true && (
          <AspectRatio
            style={{
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <iframe
              title="Embedded video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              src={video}
              style={{ border: 0, width: "100%", height: "100%" }}
            />
          </AspectRatio>
        )}

        {saveStatus && (
          <Notification
            title={saveStatus.success ? "Success" : "Error"}
            color={saveStatus.success ? "green" : "red"}
            icon={
              saveStatus.success ? <IconCheck size={18} /> : <IconX size={18} />
            }
            withCloseButton
            onClose={() => setSaveStatus(null)}
          >
            {saveStatus.message}
          </Notification>
        )}

        <Modal
          centered
          opened={opened}
          onClose={close}
          withCloseButton={false}
          size="xl"
          title="Project Activities PDF"
        >
          {pdfUrl && (
            <AspectRatio ratio={1 / 1.4} h={600}>
              <iframe
                src={pdfUrl}
                style={{ width: "100%", height: "100%", border: "none" }}
                title="Activities PDF"
              />
            </AspectRatio>
          )}
        </Modal>

        <Flex justify="space-between">
          <Button
            onClick={saveRows}
            loading={saving}
            leftSection={<IconDeviceFloppy size={24} />}
            variant="filled"
            color="blue"
          >
            Save Activities
          </Button>
          <Button
            leftSection={<IconClipboardTextFilled size={24} />}
            variant="filled"
            color="blue"
            onClick={generatePDF}
            loading={generatingPdf}
          >
            Generate PDF
          </Button>
        </Flex>

        <Table highlightOnHover withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Activity No.</Table.Th>
              <Table.Th>Activity</Table.Th>
              <Table.Th>Distance (m)</Table.Th>
              <Table.Th>Time (m)</Table.Th>
              <Table.Th>Symbols</Table.Th>
              <Table.Th>Remarks</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{tableRows}</Table.Tbody>
        </Table>
        <Button onClick={addNewRow} mt="xs" mb="xl" variant="light">
          <IconPlus size={24} />
          Add Row
        </Button>
      </Stack>
    </Center>
  );
}
