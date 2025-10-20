export const STATUS_INFO = {
  PENDING: { description: "Donation registered, awaiting matching", icon: "clock" },
  AVAILABLE: { description: "Ready for matching", icon: "check-circle" },
  ACTIVE: { description: "Ready for matching", icon: "check-circle" },
  MATCHED: { description: "Has active matches", icon: "users" },
  IN_PROGRESS: { description: "Confirmed match, process started", icon: "trending-up" },
  COMPLETED: { description: "Successfully completed", icon: "check-circle" },
  FULFILLED: { description: "Request successfully fulfilled", icon: "check-circle" },
  CANCELLED_BY_DONOR: { description: "Cancelled by donor", icon: "x-circle" },
  CANCELLED_BY_RECIPIENT: { description: "Cancelled by recipient", icon: "x-circle" },
  CANCELLED_DUE_TO_MATCH_FAILURE: { description: "Cancelled due to match failure", icon: "alert-triangle" },
  EXPIRED: { description: "Request expired", icon: "alert-octagon" },
  WITHDRAWN: { description: "Withdrawn after confirmation", icon: "corner-up-left" },
  DONOR_CONFIRMED: { description: "Donor confirmed, waiting for recipient", icon: "user-check" },
  RECIPIENT_CONFIRMED: { description: "Recipient confirmed, waiting for donor", icon: "user-check" },
  CONFIRMED: { description: "Both parties confirmed", icon: "check-circle" },
  REJECTED: { description: "Match rejected by user", icon: "x-circle" },
  FAILED: { description: "Match failed technical validation", icon: "alert-circle" },
};

export const formatStatusDisplay = (status: string) => {
  switch (status) {
    case "CANCELLED_BY_DONOR":
      return { text: "Cancelled", subtext: "by donor" };
    case "CANCELLED_BY_RECIPIENT":
      return { text: "Cancelled", subtext: "by recipient" };
    case "CANCELLED_DUE_TO_MATCH_FAILURE":
      return { text: "Cancelled", subtext: "match failure" };
    case "IN_PROGRESS":
      return { text: "In Progress", subtext: null };
    case "PENDING":
      return { text: "Pending", subtext: null };
    case "AVAILABLE":
      return { text: "Available", subtext: null };
    case "ACTIVE":
      return { text: "Active", subtext: null };
    case "MATCHED":
      return { text: "Matched", subtext: null };
    case "COMPLETED":
      return { text: "Completed", subtext: null };
    case "FULFILLED":
      return { text: "Fulfilled", subtext: null };
    case "EXPIRED":
      return { text: "Expired", subtext: null };
    case "WITHDRAWN":
      return { text: "Withdrawn", subtext: null };
    case "DONOR_CONFIRMED":
      return { text: "Donor Confirmed", subtext: null };
    case "RECIPIENT_CONFIRMED":
      return { text: "Recipient Confirmed", subtext: null };
    case "CONFIRMED":
      return { text: "Confirmed", subtext: null };
    case "REJECTED":
      return { text: "Rejected", subtext: null };
    case "FAILED":
      return { text: "Failed", subtext: null };
    default:
      return { text: status.replace(/_/g, " "), subtext: null };
  }
};

export const getStatusColor = (status: string, theme: any) => {
  switch (status) {
    case "AVAILABLE":
    case "PENDING":
    case "ACTIVE":
      return "#f59e0b";
    case "COMPLETED":
    case "FULFILLED":
    case "MATCHED":
    case "CONFIRMED":
      return theme.success;
    case "CANCELLED_BY_DONOR":
    case "CANCELLED_BY_RECIPIENT":
    case "CANCELLED_DUE_TO_MATCH_FAILURE":
    case "EXPIRED":
    case "REJECTED":
    case "FAILED":
      return theme.error;
    case "IN_PROGRESS":
    case "DONOR_CONFIRMED":
    case "RECIPIENT_CONFIRMED":
      return theme.primary;
    case "WITHDRAWN":
      return "#6B7280";
    default:
      return theme.textSecondary;
  }
};

export const getStatusInfo = (status: string) => {
  return STATUS_INFO[status as keyof typeof STATUS_INFO] || { description: status, icon: "info" };
};

export const getUrgencyConfig = (level: string, theme: any) => {
  switch (level) {
    case "CRITICAL":
      return {
        color: theme.error,
        backgroundColor: theme.error + "15",
        borderColor: theme.error + "40",
        icon: "alert-circle",
        text: "Critical",
      };
    case "HIGH":
      return {
        color: "#FF6B35",
        backgroundColor: "#FF6B35" + "15",
        borderColor: "#FF6B35" + "40",
        icon: "alert-triangle",
        text: "High",
      };
    case "MEDIUM":
      return {
        color: "#f59e0b",
        backgroundColor: "#f59e0b" + "15",
        borderColor: "#f59e0b" + "40",
        icon: "info",
        text: "Medium",
      };
    case "LOW":
      return {
        color: theme.success,
        backgroundColor: theme.success + "15",
        borderColor: theme.success + "40",
        icon: "check-circle",
        text: "Low",
      };
    default:
      return {
        color: theme.textSecondary,
        backgroundColor: theme.textSecondary + "15",
        borderColor: theme.textSecondary + "40",
        icon: "minus-circle",
        text: level,
      };
  }
};

export const canShowCancelButton = (status: string): boolean => {
  const cancellableStatuses = ["AVAILABLE", "PENDING", "ACTIVE"];
  return cancellableStatuses.includes(status);
};
