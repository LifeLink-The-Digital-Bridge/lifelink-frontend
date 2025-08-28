import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { createDonateHubStyles } from '../../constants/styles/donateHubStyles';

interface DonateProfileProps {
  donorData: any;
}

export function DonateProfile({ donorData }: DonateProfileProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createDonateHubStyles(theme);

  return (
    <View style={styles.card}>
      <Text style={styles.labelText}>
        Registration Date:{" "}
        <Text style={styles.valueText}>
          {donorData.registrationDate || "N/A"}
        </Text>
      </Text>
      <Text style={styles.labelText}>
        Status:{" "}
        <Text style={[styles.valueText, { 
          color: donorData.status === 'ACTIVE' ? theme.success : theme.textSecondary 
        }]}>
          {donorData.status || "N/A"}
        </Text>
      </Text>

      {(donorData.location || donorData.addresses?.length > 0) && (
        <>
          <Text style={styles.sectionTitle}>Location Details:</Text>
          {donorData.addresses?.length > 0 ? (
            donorData.addresses.map((address: any, index: number) => (
              <View key={index} style={{ marginBottom: 12 }}>
                {address.addressLine && (
                  <Text style={styles.detailText}>
                    Address: {address.addressLine}
                  </Text>
                )}
                {address.landmark && (
                  <Text style={styles.detailText}>
                    Landmark: {address.landmark}
                  </Text>
                )}
                {address.area && (
                  <Text style={styles.detailText}>Area: {address.area}</Text>
                )}
                {address.district && (
                  <Text style={styles.detailText}>
                    District: {address.district}
                  </Text>
                )}
                <Text style={styles.detailText}>
                  City: {address.city || "N/A"}, State: {address.state || "N/A"}
                </Text>
                <Text style={styles.detailText}>
                  Country: {address.country || "N/A"}
                </Text>
                <Text style={styles.detailText}>
                  Pincode: {address.pincode || "N/A"}
                </Text>
                {address.latitude && address.longitude && (
                  <Text style={styles.detailText}>
                    Coordinates: {address.latitude.toFixed(4)}, {address.longitude.toFixed(4)}
                  </Text>
                )}
              </View>
            ))
          ) : donorData.location && (
            <View>
              <Text style={styles.detailText}>
                Address: {donorData.location.addressLine || 
                         donorData.location.landmark || 
                         donorData.location.area || "N/A"}
              </Text>
              {donorData.location.addressLine && (
                <Text style={styles.detailText}>
                  Address Line: {donorData.location.addressLine}
                </Text>
              )}
              {donorData.location.landmark && (
                <Text style={styles.detailText}>
                  Landmark: {donorData.location.landmark}
                </Text>
              )}
              {donorData.location.area && (
                <Text style={styles.detailText}>Area: {donorData.location.area}</Text>
              )}
              {donorData.location.district && (
                <Text style={styles.detailText}>
                  District: {donorData.location.district}
                </Text>
              )}
              <Text style={styles.detailText}>
                City: {donorData.location.city || "N/A"}, State: {donorData.location.state || "N/A"}, Country: {donorData.location.country || "N/A"}
              </Text>
              <Text style={styles.detailText}>
                Pincode: {donorData.location.pincode || "N/A"}
              </Text>
              {donorData.location.latitude && donorData.location.longitude && (
                <Text style={styles.detailText}>
                  Coordinates: {donorData.location.latitude.toFixed(4)}, {donorData.location.longitude.toFixed(4)}
                </Text>
              )}
            </View>
          )}
        </>
      )}

      {donorData.medicalDetails && (
        <>
          <Text style={styles.sectionTitle}>Medical Details:</Text>
          <Text style={styles.detailText}>
            Hemoglobin: {donorData.medicalDetails.hemoglobinLevel || "N/A"} g/dL
          </Text>
          <Text style={styles.detailText}>
            Blood Pressure: {donorData.medicalDetails.bloodPressure || "N/A"}
          </Text>
          <Text style={styles.detailText}>
            Has Diseases: {donorData.medicalDetails.hasDiseases ? "Yes" : "No"}
          </Text>
          <Text style={styles.detailText}>
            Taking Medication: {donorData.medicalDetails.takingMedication ? "Yes" : "No"}
          </Text>
          {donorData.medicalDetails.overallHealthStatus && (
            <Text style={styles.detailText}>
              Health Status: {donorData.medicalDetails.overallHealthStatus}
            </Text>
          )}
        </>
      )}

      {donorData.eligibilityCriteria && (
        <>
          <Text style={styles.sectionTitle}>Eligibility:</Text>
          <Text style={styles.detailText}>
            Age: {donorData.eligibilityCriteria.age || "N/A"}
          </Text>
          <Text style={styles.detailText}>
            Weight: {donorData.eligibilityCriteria.weight || "N/A"} kg
          </Text>
          {donorData.eligibilityCriteria.height && (
            <Text style={styles.detailText}>
              Height: {donorData.eligibilityCriteria.height} cm
            </Text>
          )}
          {donorData.eligibilityCriteria.bodyMassIndex && (
            <Text style={styles.detailText}>
              BMI: {donorData.eligibilityCriteria.bodyMassIndex}
            </Text>
          )}
          <Text style={styles.detailText}>
            Medical Clearance: {donorData.eligibilityCriteria.medicalClearance ? "Yes" : "No"}
          </Text>
          <Text style={styles.detailText}>
            Recent Tattoo/Piercing: {donorData.eligibilityCriteria.recentTattooOrPiercing ? "Yes" : "No"}
          </Text>
          <Text style={styles.detailText}>
            Recent Travel: {donorData.eligibilityCriteria.recentTravelDetails || "N/A"}
          </Text>
          <Text style={styles.detailText}>
            Last Donation: {donorData.eligibilityCriteria.lastDonationDate || "Never"}
          </Text>
        </>
      )}

      {donorData.consentForm && (
        <>
          <Text style={styles.sectionTitle}>Consent:</Text>
          <Text style={styles.detailText}>
            Consented: {donorData.consentForm.isConsented ? "Yes" : "No"}
          </Text>
          <Text style={styles.detailText}>
            Consented At: {donorData.consentForm.consentedAt ? 
              new Date(donorData.consentForm.consentedAt).toLocaleDateString() : "N/A"}
          </Text>
        </>
      )}
    </View>
  );
}
