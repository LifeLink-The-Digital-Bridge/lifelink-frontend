import React, { useState, useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { createUnifiedStyles } from '../../constants/styles/unifiedStyles';
import { CustomDatePicker } from '../common/DatePicker';

interface HlaProfileProps {
  hlaA1: string;
  setHlaA1: (value: string) => void;
  hlaA2: string;
  setHlaA2: (value: string) => void;
  hlaB1: string;
  setHlaB1: (value: string) => void;
  hlaB2: string;
  setHlaB2: (value: string) => void;
  hlaC1: string;
  setHlaC1: (value: string) => void;
  hlaC2: string;
  setHlaC2: (value: string) => void;
  hlaDR1: string;
  setHlaDR1: (value: string) => void;
  hlaDR2: string;
  setHlaDR2: (value: string) => void;
  hlaDQ1: string;
  setHlaDQ1: (value: string) => void;
  hlaDQ2: string;
  setHlaDQ2: (value: string) => void;
  hlaDP1: string;
  setHlaDP1: (value: string) => void;
  hlaDP2: string;
  setHlaDP2: (value: string) => void;
  testingDate: string;
  setTestingDate: (value: string) => void;
  testingMethod: string;
  setTestingMethod: (value: string) => void;
  laboratoryName: string;
  setLaboratoryName: (value: string) => void;
  certificationNumber: string;
  setCertificationNumber: (value: string) => void;
}

export function HlaProfile({
  hlaA1, setHlaA1, hlaA2, setHlaA2,
  hlaB1, setHlaB1, hlaB2, setHlaB2,
  hlaC1, setHlaC1, hlaC2, setHlaC2,
  hlaDR1, setHlaDR1, hlaDR2, setHlaDR2,
  hlaDQ1, setHlaDQ1, hlaDQ2, setHlaDQ2,
  hlaDP1, setHlaDP1, hlaDP2, setHlaDP2,
  testingDate, setTestingDate,
  testingMethod, setTestingMethod,
  laboratoryName, setLaboratoryName,
  certificationNumber, setCertificationNumber,
}: HlaProfileProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  const [touched, setTouched] = useState({
    hlaA1: false, hlaA2: false,
    hlaB1: false, hlaB2: false,
    hlaC1: false, hlaC2: false,
    hlaDR1: false, hlaDR2: false,
    hlaDQ1: false, hlaDQ2: false,
    hlaDP1: false, hlaDP2: false,
    testingDate: false,
    testingMethod: false,
    laboratoryName: false,
  });

  const hasAnyHlaData = !!(
    hlaA1 || hlaA2 || hlaB1 || hlaB2 || hlaC1 || hlaC2 ||
    hlaDR1 || hlaDR2 || hlaDQ1 || hlaDQ2 || hlaDP1 || hlaDP2 ||
    testingDate || testingMethod || laboratoryName || certificationNumber
  );

  const requiredFieldsCount = 15;
  const hlaFields = [
    hlaA1, hlaA2, hlaB1, hlaB2, hlaC1, hlaC2,
    hlaDR1, hlaDR2, hlaDQ1, hlaDQ2, hlaDP1, hlaDP2,
    testingDate, testingMethod, laboratoryName
  ];
  const filledFieldsCount = hlaFields.filter(field => field && field.trim() !== '').length;
  const isSectionComplete = !hasAnyHlaData || filledFieldsCount === requiredFieldsCount;
  const missingCount = requiredFieldsCount - filledFieldsCount;

  const shouldShowRequired = hasAnyHlaData;

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Feather
            name={isSectionComplete ? (hasAnyHlaData ? "check-circle" : "shield") : "shield"}
            size={18}
            color={isSectionComplete ? (hasAnyHlaData ? theme.success : theme.primary) : theme.primary}
          />
        </View>
        <Text style={styles.sectionTitle}>HLA Profile</Text>
        {hasAnyHlaData && !isSectionComplete && (
          <View style={{
            backgroundColor: theme.error + '20',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
            marginLeft: 'auto',
          }}>
            <Text style={{
              color: theme.error,
              fontSize: 11,
              fontWeight: '600',
            }}>
              {missingCount} required
            </Text>
          </View>
        )}
      </View>

      <View style={{
        backgroundColor: theme.primary + '15',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.primary + '30',
        marginBottom: 16,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Feather name="info" size={16} color={theme.primary} />
          <Text style={{
            marginLeft: 8,
            fontSize: 13,
            color: theme.primary,
            fontWeight: '600',
            flex: 1,
          }}>
            HLA Profile is optional for blood donations
          </Text>
        </View>
        <Text style={{
          marginTop: 4,
          marginLeft: 24,
          fontSize: 12,
          color: theme.textSecondary,
          lineHeight: 16,
        }}>
          Required only for organ, tissue, and stem cell donations. If you start entering HLA data, you must complete all 12 alleles and laboratory information.
        </Text>
      </View>

      {hasAnyHlaData && !isSectionComplete && (
        <View style={{
          backgroundColor: theme.error + '15',
          padding: 12,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: theme.error + '30',
          marginBottom: 16,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Feather name="alert-circle" size={16} color={theme.error} />
          <Text style={{
            marginLeft: 8,
            fontSize: 12,
            color: theme.error,
            flex: 1,
            lineHeight: 18,
          }}>
            You've started entering HLA data. Please complete all 12 HLA alleles and laboratory information to enable organ/tissue/stem cell donations.
          </Text>
        </View>
      )}

      <Text style={styles.subSectionTitle}>HLA Class I Alleles</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          HLA-A Alleles {shouldShowRequired && <Text style={{ color: theme.error }}>*</Text>}
        </Text>
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <TextInput
              style={[
                styles.input,
                shouldShowRequired && !hlaA1 && touched.hlaA1 && { borderColor: theme.error, borderWidth: 2 }
              ]}
              placeholder="A*02:01"
              placeholderTextColor={theme.textSecondary}
              value={hlaA1}
              onChangeText={setHlaA1}
              onBlur={() => setTouched({ ...touched, hlaA1: true })}
            />
            {shouldShowRequired && !hlaA1 && touched.hlaA1 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Feather name="alert-circle" size={12} color={theme.error} />
                <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
                  HLA-A1 is required
                </Text>
              </View>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              style={[
                styles.input,
                shouldShowRequired && !hlaA2 && touched.hlaA2 && { borderColor: theme.error, borderWidth: 2 }
              ]}
              placeholder="A*24:02"
              placeholderTextColor={theme.textSecondary}
              value={hlaA2}
              onChangeText={setHlaA2}
              onBlur={() => setTouched({ ...touched, hlaA2: true })}
            />
            {shouldShowRequired && !hlaA2 && touched.hlaA2 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Feather name="alert-circle" size={12} color={theme.error} />
                <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
                  HLA-A2 is required
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          HLA-B Alleles {shouldShowRequired && <Text style={{ color: theme.error }}>*</Text>}
        </Text>
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <TextInput
              style={[
                styles.input,
                shouldShowRequired && !hlaB1 && touched.hlaB1 && { borderColor: theme.error, borderWidth: 2 }
              ]}
              placeholder="B*15:01"
              placeholderTextColor={theme.textSecondary}
              value={hlaB1}
              onChangeText={setHlaB1}
              onBlur={() => setTouched({ ...touched, hlaB1: true })}
            />
            {shouldShowRequired && !hlaB1 && touched.hlaB1 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Feather name="alert-circle" size={12} color={theme.error} />
                <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
                  HLA-B1 is required
                </Text>
              </View>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              style={[
                styles.input,
                shouldShowRequired && !hlaB2 && touched.hlaB2 && { borderColor: theme.error, borderWidth: 2 }
              ]}
              placeholder="B*44:03"
              placeholderTextColor={theme.textSecondary}
              value={hlaB2}
              onChangeText={setHlaB2}
              onBlur={() => setTouched({ ...touched, hlaB2: true })}
            />
            {shouldShowRequired && !hlaB2 && touched.hlaB2 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Feather name="alert-circle" size={12} color={theme.error} />
                <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
                  HLA-B2 is required
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          HLA-C Alleles {shouldShowRequired && <Text style={{ color: theme.error }}>*</Text>}
        </Text>
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <TextInput
              style={[
                styles.input,
                shouldShowRequired && !hlaC1 && touched.hlaC1 && { borderColor: theme.error, borderWidth: 2 }
              ]}
              placeholder="C*03:04"
              placeholderTextColor={theme.textSecondary}
              value={hlaC1}
              onChangeText={setHlaC1}
              onBlur={() => setTouched({ ...touched, hlaC1: true })}
            />
            {shouldShowRequired && !hlaC1 && touched.hlaC1 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Feather name="alert-circle" size={12} color={theme.error} />
                <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
                  HLA-C1 is required
                </Text>
              </View>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              style={[
                styles.input,
                shouldShowRequired && !hlaC2 && touched.hlaC2 && { borderColor: theme.error, borderWidth: 2 }
              ]}
              placeholder="C*16:01"
              placeholderTextColor={theme.textSecondary}
              value={hlaC2}
              onChangeText={setHlaC2}
              onBlur={() => setTouched({ ...touched, hlaC2: true })}
            />
            {shouldShowRequired && !hlaC2 && touched.hlaC2 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Feather name="alert-circle" size={12} color={theme.error} />
                <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
                  HLA-C2 is required
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <Text style={styles.subSectionTitle}>HLA Class II Alleles</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          HLA-DR Alleles {shouldShowRequired && <Text style={{ color: theme.error }}>*</Text>}
        </Text>
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <TextInput
              style={[
                styles.input,
                shouldShowRequired && !hlaDR1 && touched.hlaDR1 && { borderColor: theme.error, borderWidth: 2 }
              ]}
              placeholder="DRB1*07:01"
              placeholderTextColor={theme.textSecondary}
              value={hlaDR1}
              onChangeText={setHlaDR1}
              onBlur={() => setTouched({ ...touched, hlaDR1: true })}
            />
            {shouldShowRequired && !hlaDR1 && touched.hlaDR1 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Feather name="alert-circle" size={12} color={theme.error} />
                <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
                  HLA-DR1 is required
                </Text>
              </View>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              style={[
                styles.input,
                shouldShowRequired && !hlaDR2 && touched.hlaDR2 && { borderColor: theme.error, borderWidth: 2 }
              ]}
              placeholder="DRB1*15:01"
              placeholderTextColor={theme.textSecondary}
              value={hlaDR2}
              onChangeText={setHlaDR2}
              onBlur={() => setTouched({ ...touched, hlaDR2: true })}
            />
            {shouldShowRequired && !hlaDR2 && touched.hlaDR2 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Feather name="alert-circle" size={12} color={theme.error} />
                <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
                  HLA-DR2 is required
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          HLA-DQ Alleles {shouldShowRequired && <Text style={{ color: theme.error }}>*</Text>}
        </Text>
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <TextInput
              style={[
                styles.input,
                shouldShowRequired && !hlaDQ1 && touched.hlaDQ1 && { borderColor: theme.error, borderWidth: 2 }
              ]}
              placeholder="DQB1*02:02"
              placeholderTextColor={theme.textSecondary}
              value={hlaDQ1}
              onChangeText={setHlaDQ1}
              onBlur={() => setTouched({ ...touched, hlaDQ1: true })}
            />
            {shouldShowRequired && !hlaDQ1 && touched.hlaDQ1 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Feather name="alert-circle" size={12} color={theme.error} />
                <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
                  HLA-DQ1 is required
                </Text>
              </View>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              style={[
                styles.input,
                shouldShowRequired && !hlaDQ2 && touched.hlaDQ2 && { borderColor: theme.error, borderWidth: 2 }
              ]}
              placeholder="DQB1*06:02"
              placeholderTextColor={theme.textSecondary}
              value={hlaDQ2}
              onChangeText={setHlaDQ2}
              onBlur={() => setTouched({ ...touched, hlaDQ2: true })}
            />
            {shouldShowRequired && !hlaDQ2 && touched.hlaDQ2 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Feather name="alert-circle" size={12} color={theme.error} />
                <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
                  HLA-DQ2 is required
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          HLA-DP Alleles {shouldShowRequired && <Text style={{ color: theme.error }}>*</Text>}
        </Text>
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <TextInput
              style={[
                styles.input,
                shouldShowRequired && !hlaDP1 && touched.hlaDP1 && { borderColor: theme.error, borderWidth: 2 }
              ]}
              placeholder="DPB1*04:01"
              placeholderTextColor={theme.textSecondary}
              value={hlaDP1}
              onChangeText={setHlaDP1}
              onBlur={() => setTouched({ ...touched, hlaDP1: true })}
            />
            {shouldShowRequired && !hlaDP1 && touched.hlaDP1 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Feather name="alert-circle" size={12} color={theme.error} />
                <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
                  HLA-DP1 is required
                </Text>
              </View>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              style={[
                styles.input,
                shouldShowRequired && !hlaDP2 && touched.hlaDP2 && { borderColor: theme.error, borderWidth: 2 }
              ]}
              placeholder="DPB1*14:01"
              placeholderTextColor={theme.textSecondary}
              value={hlaDP2}
              onChangeText={setHlaDP2}
              onBlur={() => setTouched({ ...touched, hlaDP2: true })}
            />
            {shouldShowRequired && !hlaDP2 && touched.hlaDP2 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Feather name="alert-circle" size={12} color={theme.error} />
                <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
                  HLA-DP2 is required
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <Text style={styles.subSectionTitle}>Laboratory Information</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Testing Date {shouldShowRequired && <Text style={{ color: theme.error }}>*</Text>}
        </Text>
        <CustomDatePicker
          selectedDate={testingDate}
          onDateChange={(date) => {
            setTestingDate(date);
            setTouched({ ...touched, testingDate: true });
          }}
          hasError={shouldShowRequired && !testingDate && touched.testingDate}
          placeholder="Select HLA testing date"
        />
        {shouldShowRequired && !testingDate && touched.testingDate && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              Testing date is required
            </Text>
          </View>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Testing Method {shouldShowRequired && <Text style={{ color: theme.error }}>*</Text>}
        </Text>
        <TextInput
          style={[
            styles.input,
            shouldShowRequired && !testingMethod && touched.testingMethod && { borderColor: theme.error, borderWidth: 2 }
          ]}
          placeholder="e.g., NGS_SEQUENCING, PCR_SSP, PCR_SSOP"
          placeholderTextColor={theme.textSecondary}
          value={testingMethod}
          onChangeText={setTestingMethod}
          onBlur={() => setTouched({ ...touched, testingMethod: true })}
        />
        {shouldShowRequired && !testingMethod && touched.testingMethod && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              Testing method is required
            </Text>
          </View>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Laboratory Name {shouldShowRequired && <Text style={{ color: theme.error }}>*</Text>}
        </Text>
        <TextInput
          style={[
            styles.input,
            shouldShowRequired && !laboratoryName && touched.laboratoryName && { borderColor: theme.error, borderWidth: 2 }
          ]}
          placeholder="Enter laboratory name"
          placeholderTextColor={theme.textSecondary}
          value={laboratoryName}
          onChangeText={setLaboratoryName}
          onBlur={() => setTouched({ ...touched, laboratoryName: true })}
        />
        {shouldShowRequired && !laboratoryName && touched.laboratoryName && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              Laboratory name is required
            </Text>
          </View>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Certification Number (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter certification number"
          placeholderTextColor={theme.textSecondary}
          value={certificationNumber}
          onChangeText={setCertificationNumber}
        />
      </View>
    </View>
  );
}
