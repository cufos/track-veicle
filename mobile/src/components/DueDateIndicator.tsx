import React from "react";
import { View, Text } from "react-native";
import { getDueDateStatus } from "../utils/dueDateUtils";
import i18n from "../i18n";

type Props = {
  dueDate: string;
  textColor?: string;
  fontSize?: number;
};

export default function DueDateIndicator({
  dueDate,
  textColor = "#000",
  fontSize = 12,
}: Props) {
  const dueInfo = getDueDateStatus(dueDate);

  if (dueInfo.type === "expired") {
    return (
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <View
          style={{
            backgroundColor: "#FF3B30",
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: "white", fontSize, fontWeight: "700" }}>
            {dueInfo.days}
          </Text>
        </View>
        <Text style={{ color: "#FF3B30", fontSize, fontWeight: "600" }}>
          {i18n.t("maintenance.expiredAgo")} {dueInfo.days}{" "}
          {dueInfo.days === 1
            ? i18n.t("maintenance.day")
            : i18n.t("maintenance.days")}
        </Text>
      </View>
    );
  }

  if (dueInfo.type === "urgent") {
    return (
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <View
          style={{
            backgroundColor: "#FF9500",
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: "white", fontSize, fontWeight: "700" }}>
            {dueInfo.days}
          </Text>
        </View>
        <Text style={{ color: "#FF9500", fontSize, fontWeight: "600" }}>
          ⏳ {i18n.t("maintenance.dueIn")} {dueInfo.days}{" "}
          {dueInfo.days === 1
            ? i18n.t("maintenance.day")
            : i18n.t("maintenance.days")}
        </Text>
      </View>
    );
  }

  if (dueInfo.type === "upcoming") {
    return (
      <Text style={{ color: "#FF9500", fontSize, fontWeight: "600" }}>
        {i18n.t("maintenance.dueIn")}: {dueInfo.days}{" "}
        {dueInfo.days === 1
          ? i18n.t("maintenance.day")
          : i18n.t("maintenance.days")}
      </Text>
    );
  }

  return (
    <Text style={{ color: textColor, fontSize }}>
      {i18n.t("maintenance.due")}: {dueInfo.friendlyDate}
    </Text>
  );
}
