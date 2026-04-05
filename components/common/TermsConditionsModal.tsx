import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';

const { width, height } = Dimensions.get('window');

interface TermsConditionsModalProps {
  visible: boolean;
  onClose: () => void;
  onAccept: () => void;
  recipientMode?: boolean;
}

export function TermsConditionsModal({
  visible,
  onClose,
  onAccept,
  recipientMode = false
}: TermsConditionsModalProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.8)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.card,
      borderRadius: 20,
      width: width * 0.9,
      maxHeight: height * 0.85,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.5,
      shadowRadius: 20,
      elevation: 30,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 24,
      borderBottomWidth: 1,
      borderBottomColor: theme.border + '40',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.text,
      flex: 1,
    },
    closeButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollContent: {
      padding: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 12,
      marginTop: 20,
    },
    paragraph: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 20,
      marginBottom: 12,
    },
    bulletPoint: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 20,
      marginBottom: 8,
      marginLeft: 16,
    },
    highlight: {
      fontWeight: '600',
      color: theme.text,
    },
    warningBox: {
      backgroundColor: theme.primary + '15',
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.primary + '30',
      marginVertical: 16,
    },
    warningText: {
      fontSize: 14,
      color: theme.primary,
      fontWeight: '600',
      textAlign: 'center',
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 12,
      padding: 24,
      borderTopWidth: 1,
      borderTopColor: theme.border + '40',
    },
    button: {
      flex: 1,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    declineButton: {
      backgroundColor: theme.background,
      borderWidth: 2,
      borderColor: theme.border,
    },
    acceptButton: {
      backgroundColor: theme.primary,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    declineButtonText: {
      color: theme.text,
    },
    acceptButtonText: {
      color: '#fff',
    },
  });

  const renderRecipientTerms = () => (
    <>
      <Text style={styles.sectionTitle}>Recipient Consent Agreement</Text>
      <Text style={styles.paragraph}>
        By registering as a recipient, you acknowledge and agree to the following terms and conditions:
      </Text>

      <Text style={styles.sectionTitle}>1. Medical Information & Eligibility</Text>
      <Text style={styles.bulletPoint}>• Provide accurate and complete medical history</Text>
      <Text style={styles.bulletPoint}>• Submit all required medical documentation</Text>
      <Text style={styles.bulletPoint}>• Undergo medical evaluations as required</Text>
      <Text style={styles.bulletPoint}>• Report any changes in medical condition immediately</Text>
      <Text style={styles.bulletPoint}>• Meet eligibility criteria for receiving medical donations</Text>

      <Text style={styles.sectionTitle}>2. HLA Typing & Compatibility Testing</Text>
      <Text style={styles.paragraph}>
        <Text style={styles.highlight}>HLA (Human Leukocyte Antigen) typing</Text> is essential for matching compatible donors to recipients.
      </Text>
      <Text style={styles.bulletPoint}>• Consent to HLA typing through certified laboratories</Text>
      <Text style={styles.bulletPoint}>• Undergo tissue typing and cross-matching procedures</Text>
      <Text style={styles.bulletPoint}>• Allow verification of compatibility results</Text>
      <Text style={styles.bulletPoint}>• Understand that HLA profiles will be stored securely</Text>
      <Text style={styles.bulletPoint}>• Accept that matching depends on compatibility and donor availability</Text>

      <Text style={styles.sectionTitle}>3. Matching & Allocation Process</Text>
      <Text style={styles.bulletPoint}>• Understand the matching algorithm prioritizes medical urgency</Text>
      <Text style={styles.bulletPoint}>• Accept that suitable matches may take time</Text>
      <Text style={styles.bulletPoint}>• Agree to respond promptly when a match is found</Text>
      <Text style={styles.bulletPoint}>• Comply with pre-transplant/transfusion protocols</Text>
      <Text style={styles.bulletPoint}>• Maintain regular contact with medical team</Text>

      <Text style={styles.sectionTitle}>4. Medical Treatment & Procedures</Text>
      <Text style={styles.bulletPoint}>• Follow all pre-procedure medical guidelines</Text>
      <Text style={styles.bulletPoint}>• Accept potential risks associated with receiving donations</Text>
      <Text style={styles.bulletPoint}>• Comply with post-procedure care instructions</Text>
      <Text style={styles.bulletPoint}>• Attend all scheduled follow-up appointments</Text>
      <Text style={styles.bulletPoint}>• Report any complications or adverse reactions</Text>

      <Text style={styles.sectionTitle}>5. Data Privacy & Confidentiality</Text>
      <Text style={styles.bulletPoint}>• Medical records will be kept confidential</Text>
      <Text style={styles.bulletPoint}>• Anonymized data may be used for medical research</Text>
      <Text style={styles.bulletPoint}>• HLA information shared only with authorized personnel</Text>
      <Text style={styles.bulletPoint}>• Identity protected according to privacy regulations</Text>
      <Text style={styles.bulletPoint}>• Right to access your medical data</Text>

      <View style={styles.warningBox}>
        <Text style={styles.warningText}>
          Important: Accurate medical information is critical for your safety. Providing false information may result in serious medical complications.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>6. Financial & Legal Responsibilities</Text>
      <Text style={styles.bulletPoint}>• Understand financial obligations related to treatment</Text>
      <Text style={styles.bulletPoint}>• No payment to donors for donations</Text>
      <Text style={styles.bulletPoint}>• Medical insurance requirements may apply</Text>
      <Text style={styles.bulletPoint}>• Comply with all legal and ethical guidelines</Text>

      <Text style={styles.sectionTitle}>7. Emergency Contact & Communication</Text>
      <Text style={styles.bulletPoint}>• Maintain updated contact information</Text>
      <Text style={styles.bulletPoint}>• Designate emergency contacts</Text>
      <Text style={styles.bulletPoint}>• Respond to urgent notifications promptly</Text>
      <Text style={styles.bulletPoint}>• Keep medical team informed of travel plans</Text>

      <Text style={styles.paragraph}>
        <Text style={styles.highlight}>By accepting these terms</Text>, you confirm that you have read, understood, and agree to all conditions outlined above. You acknowledge the importance of accurate medical information and consent to HLA typing, compatibility testing, and medical procedures necessary for receiving donations.
      </Text>
    </>
  );

  const renderDonorTerms = () => (
    <>
      <Text style={styles.sectionTitle}>Donor Consent Agreement</Text>
      <Text style={styles.paragraph}>
        By registering as a donor, you acknowledge and agree to the following terms and conditions:
      </Text>

      <Text style={styles.sectionTitle}>1. Medical Information & Testing</Text>
      <Text style={styles.bulletPoint}>• Provide accurate and complete medical information</Text>
      <Text style={styles.bulletPoint}>• Undergo required medical screenings and tests</Text>
      <Text style={styles.bulletPoint}>• Allow periodic health assessments</Text>
      <Text style={styles.bulletPoint}>• Report any changes in health status immediately</Text>

      <Text style={styles.sectionTitle}>2. HLA Typing & Genetic Testing</Text>
      <Text style={styles.paragraph}>
        <Text style={styles.highlight}>HLA (Human Leukocyte Antigen) typing</Text> is essential for organ and tissue compatibility matching.
      </Text>
      <Text style={styles.bulletPoint}>• Consent to HLA typing through certified laboratories</Text>
      <Text style={styles.bulletPoint}>• Allow genetic testing for compatibility assessment</Text>
      <Text style={styles.bulletPoint}>• Understand that HLA profiles will be stored securely</Text>
      <Text style={styles.bulletPoint}>• Agree to verification of HLA results through approved testing methods</Text>
      <Text style={styles.bulletPoint}>• Allow sharing of anonymized HLA data for medical research</Text>

      <Text style={styles.sectionTitle}>3. Donation Process</Text>
      <Text style={styles.bulletPoint}>• Follow all pre-donation medical guidelines</Text>
      <Text style={styles.bulletPoint}>• Comply with donation scheduling and procedures</Text>
      <Text style={styles.bulletPoint}>• Understand the risks associated with donation</Text>
      <Text style={styles.bulletPoint}>• Accept post-donation care instructions</Text>

      <Text style={styles.sectionTitle}>4. Data Privacy & Sharing</Text>
      <Text style={styles.bulletPoint}>• Medical data will be kept confidential</Text>
      <Text style={styles.bulletPoint}>• Anonymous data may be used for research</Text>
      <Text style={styles.bulletPoint}>• HLA information shared only with authorized medical personnel</Text>
      <Text style={styles.bulletPoint}>• Right to withdraw consent (excluding already donated materials)</Text>

      <Text style={styles.sectionTitle}>5. Legal & Medical Responsibilities</Text>
      <Text style={styles.bulletPoint}>• Donation is voluntary and without coercion</Text>
      <Text style={styles.bulletPoint}>• No financial compensation for donations</Text>
      <Text style={styles.bulletPoint}>• Medical decisions made by qualified healthcare professionals</Text>
      <Text style={styles.bulletPoint}>• Follow-up care may be required</Text>

      <View style={styles.warningBox}>
        <Text style={styles.warningText}>
          Important: HLA typing results must be verified by certified laboratories. False information may result in medical complications.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>6. Emergency Contact & Medical Records</Text>
      <Text style={styles.bulletPoint}>• Maintain updated emergency contact information</Text>
      <Text style={styles.bulletPoint}>• Allow access to relevant medical records</Text>
      <Text style={styles.bulletPoint}>• Notify of any medication changes or medical procedures</Text>

      <Text style={styles.paragraph}>
        <Text style={styles.highlight}>By accepting these terms</Text>, you confirm that you have read, understood, and agree to all conditions outlined above. You acknowledge the importance of accurate medical information and consent to HLA typing and genetic testing procedures.
      </Text>
    </>
  );

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Terms & Conditions</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Feather name="x" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {recipientMode ? renderRecipientTerms() : renderDonorTerms()}
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.declineButton]} onPress={onClose}>
              <Text style={[styles.buttonText, styles.declineButtonText]}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={onAccept}>
              <Text style={[styles.buttonText, styles.acceptButtonText]}>Accept Terms</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
