import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { createProfileStyles } from "../../constants/styles/profileStyles";
import { useLanguage } from "../../utils/language-context";

interface ProfileContentProps {
  activeTab: string;
  theme: any;
  isOwnProfile: boolean;
  canViewProfile: boolean;
  checkingAccess: boolean;
  donationsLoading: boolean;
  receivesLoading: boolean;
  donations: any[];
  receives: any[];
  mockReviews: any[];
  formatDate: (dateStr: string) => string;
}

const formatLocalDate = (dateValue: any): string => {
  if (!dateValue) return "N/A";

  if (Array.isArray(dateValue)) {
    const [year, month, day] = dateValue;
    const date = new Date(year, month - 1, day);
    const dayNum = date.getDate();
    const monthName = date.toLocaleString("default", { month: "long" });
    const yearNum = date.getFullYear();
    return `${dayNum} ${monthName} ${yearNum}`;
  }

  if (typeof dateValue === "string") {
    const date = new Date(dateValue);
    const dayNum = date.getDate();
    const monthName = date.toLocaleString("default", { month: "long" });
    const yearNum = date.getFullYear();
    return `${dayNum} ${monthName} ${yearNum}`;
  }

  return "N/A";
};

export const ProfileContent: React.FC<ProfileContentProps> = ({
  activeTab,
  theme,
  isOwnProfile,
  canViewProfile,
  checkingAccess,
  donationsLoading,
  receivesLoading,
  donations,
  receives,
  mockReviews,
  formatDate,
}) => {
  const router = useRouter();
  const styles = createProfileStyles(theme);
  const { t } = useLanguage();

  const getTabLabel = (tab: string) => {
    if (tab === "donations") return t("profile.tabs.donations");
    if (tab === "reviews") return t("profile.tabs.reviews");
    if (tab === "receives") return t("profile.tabs.receives");
    return tab;
  };

  if (!isOwnProfile && checkingAccess) {
    return (
      <View style={styles.emptyState}>
        <ActivityIndicator size="small" color={theme.primary} />
        <Text style={[styles.emptyDescription, { marginTop: 10 }]}>
          {t("profile.permissions.checking")}
        </Text>
      </View>
    );
  }

  if (!isOwnProfile && !canViewProfile) {
    return (
      <View style={styles.emptyState}>
        <View style={styles.emptyIcon}>
          <Feather name="lock" size={56} color={theme.textSecondary} />
        </View>
        <Text style={styles.emptyTitle}>{t("profile.private.title")}</Text>
        <Text style={styles.emptyDescription}>
          {t("profile.private.message", { tab: getTabLabel(activeTab) })}
        </Text>
      </View>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "donations":
        if (donationsLoading) {
          return (
            <View style={styles.emptyState}>
              <ActivityIndicator size="small" color={theme.primary} />
              <Text style={[styles.emptyDescription, { marginTop: 10 }]}>
                {t("profile.donations.loading")}
              </Text>
            </View>
          );
        }

        if (!donations.length) {
          return (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Feather name="droplet" size={56} color={theme.textSecondary} />
              </View>
              <Text style={styles.emptyTitle}>{t("profile.donations.emptyTitle")}</Text>
              <Text style={styles.emptyDescription}>
                {isOwnProfile
                  ? t("profile.donations.emptyOwnDescription")
                  : t("profile.donations.emptyOtherDescription")}
              </Text>
              {isOwnProfile && (
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    styles.primaryButton,
                    { width: "80%" },
                  ]}
                  onPress={() =>
                    router.push("/navigation/donorscreens/donorScreen")
                  }
                >
                  <Feather name="plus-circle" size={16} color="#fff" />
                  <Text style={[styles.buttonText, styles.primaryButtonText]}>
                    {t("profile.donations.registerButton")}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }

        return (
          <View style={styles.contentContainer}>
            {donations.slice(0, 5).map((donation, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.card}
                onPress={() => router.push("/navigation/statusscreens/StatusScreen")}
                activeOpacity={0.7}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>
                    {donation.donationType || t("profile.donations.defaultType")}
                  </Text>
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor:
                          donation.status === "COMPLETED"
                            ? theme.success + "20"
                            : theme.primary + "20",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        {
                          color:
                            donation.status === "COMPLETED"
                              ? theme.success
                              : theme.primary,
                        },
                      ]}
                    >
                      {donation.status || "AVAILABLE"}
                    </Text>
                  </View>
                </View>

                {donation.bloodType && (
                  <View style={styles.cardDetail}>
                    <Feather
                      name="droplet"
                      size={14}
                      color={theme.textSecondary}
                    />
                    <Text style={styles.detailLabel}>{t("profile.fields.bloodType")}</Text>
                    <Text style={styles.detailValue}>{donation.bloodType}</Text>
                  </View>
                )}

                {donation.organType && (
                  <View style={styles.cardDetail}>
                    <Feather
                      name="heart"
                      size={14}
                      color={theme.textSecondary}
                    />
                    <Text style={styles.detailLabel}>{t("profile.fields.organ")}</Text>
                    <Text style={styles.detailValue}>{donation.organType}</Text>
                  </View>
                )}

                {donation.quantity && (
                  <View style={styles.cardDetail}>
                    <Feather
                      name="package"
                      size={14}
                      color={theme.textSecondary}
                    />
                    <Text style={styles.detailLabel}>{t("profile.fields.quantity")}</Text>
                    <Text style={styles.detailValue}>{donation.quantity}</Text>
                  </View>
                )}

                <View style={styles.cardDetail}>
                  <Feather
                    name="calendar"
                    size={14}
                    color={theme.textSecondary}
                  />
                  <Text style={styles.detailLabel}>{t("profile.fields.date")}</Text>
                  <Text style={styles.detailValue}>
                    {formatLocalDate(donation.donationDate)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            {isOwnProfile && (
              <TouchableOpacity
                style={[styles.actionButton, styles.viewAllButton]}
                onPress={() => router.push("/navigation/statusscreens/StatusScreen")}
              >
                <Feather name="list" size={16} color={theme.primary} />
                <Text style={[styles.buttonText, styles.viewAllButtonText]}>
                  {t("profile.donations.viewAll")}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        );

      case "reviews":
        return (
          <View style={styles.contentContainer}>
            {mockReviews.map((review) => (
              <View key={review.id} style={styles.card}>
                <Text style={[styles.cardTitle, { marginBottom: 8 }]}>
                  {review.text}
                </Text>
                <View style={styles.cardDetail}>
                  <Feather
                    name="calendar"
                    size={14}
                    color={theme.textSecondary}
                  />
                  <Text style={styles.detailLabel}>{t("profile.fields.date")}</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(review.date)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        );

      case "receives":
        if (receivesLoading) {
          return (
            <View style={styles.emptyState}>
              <ActivityIndicator size="small" color={theme.primary} />
              <Text style={[styles.emptyDescription, { marginTop: 10 }]}>
                {t("profile.receives.loading")}
              </Text>
            </View>
          );
        }

        if (!receives.length) {
          return (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Feather
                  name="clipboard"
                  size={56}
                  color={theme.textSecondary}
                />
              </View>
              <Text style={styles.emptyTitle}>{t("profile.receives.emptyTitle")}</Text>
              <Text style={styles.emptyDescription}>
                {isOwnProfile
                  ? t("profile.receives.emptyOwnDescription")
                  : t("profile.receives.emptyOtherDescription")}
              </Text>
              {isOwnProfile && (
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor: theme.error,
                      borderColor: theme.error,
                      width: "80%",
                    },
                  ]}
                  onPress={() =>
                    router.push("/navigation/recipientscreens/RecipientScreen")
                  }
                >
                  <Feather name="plus-circle" size={16} color="#fff" />
                  <Text style={[styles.buttonText, styles.primaryButtonText]}>
                    {t("profile.receives.registerButton")}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }

        return (
          <View style={styles.contentContainer}>
            {receives.slice(0, 5).map((req, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.card}
                onPress={() => router.push("/navigation/statusscreens/StatusScreen")}
                activeOpacity={0.7}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>
                    {req.requestedBloodType ||
                      req.requestedOrgan ||
                      req.requestType}
                  </Text>
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor:
                          req.urgencyLevel === "CRITICAL"
                            ? theme.error + "20"
                            : theme.primary + "20",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        {
                          color:
                            req.urgencyLevel === "CRITICAL"
                              ? theme.error
                              : theme.primary,
                        },
                      ]}
                    >
                      {req.urgencyLevel}
                    </Text>
                  </View>
                </View>

                {req.requestedOrgan && (
                  <View style={styles.cardDetail}>
                    <Feather
                      name="heart"
                      size={14}
                      color={theme.textSecondary}
                    />
                    <Text style={styles.detailLabel}>{t("profile.fields.organ")}</Text>
                    <Text style={styles.detailValue}>{req.requestedOrgan}</Text>
                  </View>
                )}

                {req.quantity && (
                  <View style={styles.cardDetail}>
                    <Feather
                      name="package"
                      size={14}
                      color={theme.textSecondary}
                    />
                    <Text style={styles.detailLabel}>{t("profile.fields.quantity")}</Text>
                    <Text style={styles.detailValue}>{req.quantity}</Text>
                  </View>
                )}

                <View style={styles.cardDetail}>
                  <Feather name="info" size={14} color={theme.textSecondary} />
                  <Text style={styles.detailLabel}>{t("profile.fields.status")}</Text>
                  <Text style={styles.detailValue}>{req.status}</Text>
                </View>

                <View style={styles.cardDetail}>
                  <Feather
                    name="calendar"
                    size={14}
                    color={theme.textSecondary}
                  />
                  <Text style={styles.detailLabel}>{t("profile.fields.date")}</Text>
                  <Text style={styles.detailValue}>
                    {formatLocalDate(req.requestDate)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            {isOwnProfile && (
              <TouchableOpacity
                style={[styles.actionButton, styles.viewAllButton]}
                onPress={() => router.push("/navigation/statusscreens/StatusScreen")}
              >
                <Feather name="list" size={16} color={theme.primary} />
                <Text style={[styles.buttonText, styles.viewAllButtonText]}>
                  {t("profile.receives.viewAll")}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return <>{renderContent()}</>;
};
