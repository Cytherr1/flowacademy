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
  ScrollArea,
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
  IconLetterD,
} from "@tabler/icons-react";
import { deleteRow, saveProjectRows } from "@/lib/actions/projectActions";
import { useDisclosure } from "@mantine/hooks";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable"
import { IconLetterDFilled } from "./iconLetterDFilled";

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
    { outlined: IconLetterD, filled: IconLetterDFilled},
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
      setDeleting(false);
    }
  };

  const generatePDF = () => {
    setGeneratingPdf(true);

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      doc.setFontSize(18);
      doc.text(workspaceName || "Process Flow Chart Analysis", 14, 20);

      const getSymbolText = (symbolIndex: number | null): string => {
        if (symbolIndex === null) return "";
        const symbols = [
          "Operation",
          "Inspection",
          "Transportation",
          "Delay",
          "Storage",
        ];
        return symbols[symbolIndex] || "";
      };

      doc.setFontSize(12);
      doc.text("1) Process Flow Chart", 14, 30);

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
          [
            "No.",
            "Activity",
            "Distance (m)",
            "Time (min)",
            "Symbol",
            "Remarks",
          ],
        ],
        body: tableData,
        startY: 35,
        theme: "grid",
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [66, 139, 202], textColor: [255, 255, 255] },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: "auto" },
          2: { cellWidth: 25, halign: "right" },
          3: { cellWidth: 25, halign: "right" },
          4: { cellWidth: 35 },
          5: { cellWidth: 40 },
        },
        didDrawPage: () => {
          doc.setFontSize(8);
          doc.text(
            `Page ${doc.getNumberOfPages()}`,
            doc.internal.pageSize.getWidth() - 20,
            doc.internal.pageSize.getHeight() - 10
          );
        },
      });

      const metrics = calculatePFCMetrics(activities);
      const finalY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY || 40;

      if (finalY > doc.internal.pageSize.getHeight() - 60) {
        doc.addPage();
        doc.setFontSize(12);
        doc.text("2) Output Analysis of PFC", 14, 20);
        drawMetricsTable(doc, metrics, 30);
      } else {
        doc.setFontSize(12);
        doc.text("2) Output Analysis of PFC", 14, finalY + 10);
        drawMetricsTable(doc, metrics, finalY + 15);
      }

      addFooter(doc);

      const pdfBlob = doc.output("blob");
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      open();

      doc.save(
        `${workspaceName || "process-flow-chart"}_${new Date()
          .toISOString()
          .slice(0, 10)}.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setGeneratingPdf(false);
    }
  };

  const calculatePFCMetrics = (activities: Rows[]): {
    valueAdded: number;
    nonValueAdded: number;
    totalActivities: number;
    valueAddedPercentage: string;
    nonValueAddedPercentage: string;
    totalDistance: string;
    totalTime: string;
    operationCount: number;
    inspectionCount: number;
    transportationCount: number;
    delayCount: number;
    storageCount: number;
  } => {
    const valueAdded = activities.filter((a) => a.symbolIndex === 0).length;

    const nonValueAdded = activities.filter(
      (a) => a.symbolIndex !== null && a.symbolIndex > 0 && a.symbolIndex <= 4
    ).length;

    const totalDistance = activities.reduce(
      (sum, act) => sum + (parseFloat(act.distance.toString()) || 0),
      0
    );
    const totalTime = activities.reduce(
      (sum, act) => sum + (parseFloat(act.time.toString()) || 0),
      0
    );

    const symbolCounts = [0, 0, 0, 0, 0];
    activities.forEach((act) => {
      if (
        act.symbolIndex !== null &&
        act.symbolIndex >= 0 &&
        act.symbolIndex < 5
      ) {
        symbolCounts[act.symbolIndex]++;
      }
    });

    return {
      valueAdded,
      nonValueAdded,
      totalActivities: activities.length,
      valueAddedPercentage: activities.length
        ? ((valueAdded / activities.length) * 100).toFixed(2)
        : "0",
      nonValueAddedPercentage: activities.length
        ? ((nonValueAdded / activities.length) * 100).toFixed(2)
        : "0",
      totalDistance: totalDistance.toFixed(2),
      totalTime: totalTime.toFixed(2),
      operationCount: symbolCounts[0],
      inspectionCount: symbolCounts[1],
      transportationCount: symbolCounts[2],
      delayCount: symbolCounts[3],
      storageCount: symbolCounts[4],
    };
  };

  const drawMetricsTable = (
    doc: jsPDF,
    metrics: {
      valueAdded: number;
      nonValueAdded: number;
      totalActivities: number;
      valueAddedPercentage: string;
      nonValueAddedPercentage: string;
      totalDistance: string;
      totalTime: string;
      operationCount: number;
      inspectionCount: number;
      transportationCount: number;
      delayCount: number;
      storageCount: number;
    },
    startY: number
  ) => {
    autoTable(doc, {
      startY,
      theme: "plain",
      styles: { fontSize: 10, cellPadding: 3 },
      body: [
        ["Number of values added:", metrics.valueAdded.toString()],
        ["Number of non-values added:", metrics.nonValueAdded.toString()],
        [
          "Proportion of % (value added / total):",
          `${metrics.valueAddedPercentage}%`,
        ],
        [
          "Proportion of % (non-value added / total):",
          `${metrics.nonValueAddedPercentage}%`,
        ],
        ["Total distance:", `${metrics.totalDistance} m`],
        ["Total time:", `${metrics.totalTime} min`],
        [
          "Total number of operation process:",
          metrics.operationCount.toString(),
        ],
        [
          "Total number of inspection process:",
          metrics.inspectionCount.toString(),
        ],
        [
          "Total number of transportation process:",
          metrics.transportationCount.toString(),
        ],
        ["Total number of delay process:", metrics.delayCount.toString()],
        ["Total number of storage process:", metrics.storageCount.toString()],
      ],
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 100 },
        1: { cellWidth: "auto" },
      },
    });
  };

  const addFooter = (doc: jsPDF) => {
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100);
      const dateString = new Date().toLocaleDateString();
      doc.text(
        `Generated on: ${dateString} | ${
          workspaceName || "Process Flow Chart"
        }`,
        14,
        doc.internal.pageSize.getHeight() - 10
      );
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
      <Stack style={{ width: "75%", height: "100%" }}>
        <Title mt="sm" ta="center" order={1}>
          {workspaceName?.toString()}
        </Title>
        {video && is_outsource === false && (
          <AspectRatio
            ratio={16 / 9}
            style={{ minWidth:"1000px", margin: "0 auto" }}
          >
            <iframe
              src={video}
              style={{ border: 0, width: "100%", height: "100%" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </AspectRatio>
        )}

        {video && is_outsource === true && (
          <AspectRatio
            ratio={16 / 9}
            style={{ minWidth:"1000px", margin: "0 auto" }}
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
            <AspectRatio
              ratio={1 / 1.4}
              style={{ width: "100%", height: "100%" }}
            >
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

        <ScrollArea style={{ width: "100%" }}>
          <Table highlightOnHover withColumnBorders style={{ width: "100%" }}>
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
        </ScrollArea>
        <Button onClick={addNewRow} mt="xs" mb="xl" variant="light">
          <IconPlus size={24} />
          Add Row
        </Button>
      </Stack>
    </Center>
  );
}
