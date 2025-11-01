interface DetailItem {
  label: string;
  value: string;
  isLast?: boolean;
}

interface DetailSection {
  icon: string;
  title: string;
  items: DetailItem[];
}

const formatDate = (dateValue: any): string => {
  if (!dateValue) return "N/A";

  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      return "N/A";
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return "N/A";
  }
};

export const formatDonorDetails = (donorData: any): DetailSection[] => {
  const sections: DetailSection[] = [];

  sections.push({
    icon: "user",
    title: "Registration Details",
    items: [
      {
        label: "Registration Date",
        value: formatDate(donorData.registrationDate)
      },
      {
        label: "Status",
        value: donorData.status || "N/A",
        isLast: true
      }
    ]
  });

  if (donorData.medicalDetails) {
    const medicalItems: DetailItem[] = [
      {
        label: "Hemoglobin",
        value: `${donorData.medicalDetails.hemoglobinLevel || "N/A"} g/dL`
      },
      {
        label: "Blood Glucose",
        value: `${donorData.medicalDetails.bloodGlucoseLevel || "N/A"} mg/dL`
      },
      {
        label: "Blood Pressure",
        value: donorData.medicalDetails.bloodPressure || "N/A"
      },
      {
        label: "Has Diabetes",
        value: donorData.medicalDetails.hasDiabetes ? "Yes" : "No"
      },
      {
        label: "Has Diseases",
        value: donorData.medicalDetails.hasDiseases ? "Yes" : "No"
      },
      {
        label: "Disease Description",
        value: donorData.medicalDetails.diseaseDescription || "N/A"
      },
      {
        label: "Creatinine",
        value: `${donorData.medicalDetails.creatinineLevel || "N/A"} mg/dL`
      },
      {
        label: "Pulmonary Function",
        value: donorData.medicalDetails.pulmonaryFunction ? `${donorData.medicalDetails.pulmonaryFunction}%` : "N/A"
      },
      {
        label: "Liver Function Tests",
        value: donorData.medicalDetails.liverFunctionTests || "N/A"
      },
      {
        label: "Cardiac Status",
        value: donorData.medicalDetails.cardiacStatus || "N/A"
      },
      {
        label: "Has Infectious Diseases",
        value: donorData.medicalDetails.hasInfectiousDiseases ? "Yes" : "No"
      },
      {
        label: "Infectious Disease Details",
        value: donorData.medicalDetails.infectiousDiseaseDetails || "N/A"
      },
      {
        label: "Health Status",
        value: donorData.medicalDetails.overallHealthStatus || "N/A"
      },
      {
        label: "Medical History",
        value: donorData.medicalDetails.medicalHistory || "N/A"
      },
      {
        label: "Current Medications",
        value: donorData.medicalDetails.currentMedications || "N/A"
      },
      {
        label: "Taking Medication",
        value: donorData.medicalDetails.takingMedication ? "Yes" : "No"
      },
      {
        label: "Last Medical Checkup",
        value: formatDate(donorData.medicalDetails.lastMedicalCheckup),
        isLast: true
      }
    ];
    sections.push({
      icon: "heart",
      title: "Medical Information",
      items: medicalItems
    });
  }


  if (donorData.eligibilityCriteria) {
    const eligibilityItems: DetailItem[] = [
      {
        label: "Age",
        value: `${donorData.eligibilityCriteria.age || "N/A"} years`
      },
      {
        label: "Date of Birth",
        value: formatDate(donorData.eligibilityCriteria.dob)
      },
      {
        label: "Weight",
        value: `${donorData.eligibilityCriteria.weight || "N/A"} kg`
      },
      {
        label: "Height",
        value: `${donorData.eligibilityCriteria.height || "N/A"} cm`
      },
      {
        label: "BMI",
        value: donorData.eligibilityCriteria.bodyMassIndex ? donorData.eligibilityCriteria.bodyMassIndex.toFixed(1) : "N/A"
      },
      {
        label: "Body Size",
        value: donorData.eligibilityCriteria.bodySize || "N/A"
      },
      {
        label: "Medical Clearance",
        value: donorData.eligibilityCriteria.medicalClearance ? "✓ Approved" : "Pending"
      },
      {
        label: "Is Living Donor",
        value: donorData.eligibilityCriteria.isLivingDonor ? "Yes" : "No"
      },
      {
        label: "Smoking Status",
        value: donorData.eligibilityCriteria.smokingStatus || "N/A"
      },
      {
        label: "Pack Years",
        value: donorData.eligibilityCriteria.packYears || "N/A"
      },
      {
        label: "Alcohol Status",
        value: donorData.eligibilityCriteria.alcoholStatus || "N/A"
      },
      {
        label: "Drinks Per Week",
        value: donorData.eligibilityCriteria.drinksPerWeek || "N/A"
      },
      {
        label: "Recent Tattoo/Piercing",
        value: donorData.eligibilityCriteria.recentTattooOrPiercing ? "Yes" : "No"
      },
      {
        label: "Recent Vaccination",
        value: donorData.eligibilityCriteria.recentVaccination ? "Yes" : "No"
      },
      {
        label: "Recent Surgery",
        value: donorData.eligibilityCriteria.recentSurgery ? "Yes" : "No"
      },
      {
        label: "Recent Travel Details",
        value: donorData.eligibilityCriteria.recentTravelDetails || "N/A"
      },
      {
        label: "Chronic Diseases",
        value: donorData.eligibilityCriteria.chronicDiseases || "N/A"
      },
      {
        label: "Allergies",
        value: donorData.eligibilityCriteria.allergies || "N/A"
      },
      {
        label: "Last Donation",
        value: formatDate(donorData.eligibilityCriteria.lastDonationDate) === "N/A"
          ? "Never"
          : formatDate(donorData.eligibilityCriteria.lastDonationDate),
        isLast: true
      }
    ];

    sections.push({
      icon: "check-circle",
      title: "Eligibility Status",
      items: eligibilityItems
    });
  }


  if (donorData.hlaProfile) {
    sections.push({
      icon: "shield",
      title: "HLA Profile",
      items: [
        {
          label: "HLA-A",
          value: `${donorData.hlaProfile.hlaA1 || "N/A"}, ${donorData.hlaProfile.hlaA2 || "N/A"}`
        },
        {
          label: "HLA-B",
          value: `${donorData.hlaProfile.hlaB1 || "N/A"}, ${donorData.hlaProfile.hlaB2 || "N/A"}`
        },
        {
          label: "HLA-C",
          value: `${donorData.hlaProfile.hlaC1 || "N/A"}, ${donorData.hlaProfile.hlaC2 || "N/A"}`
        },
        {
          label: "HLA-DR",
          value: `${donorData.hlaProfile.hlaDR1 || "N/A"}, ${donorData.hlaProfile.hlaDR2 || "N/A"}`
        },
        {
          label: "Testing Date",
          value: formatDate(donorData.hlaProfile.testingDate)
        },
        {
          label: "Laboratory",
          value: donorData.hlaProfile.laboratoryName || "N/A"
        },
        {
          label: "Method",
          value: donorData.hlaProfile.testingMethod || "N/A"
        },
        {
          label: "Certification",
          value: donorData.hlaProfile.certificationNumber || "N/A",
          isLast: true
        }
      ]
    });
  }

  if (donorData.location || donorData.addresses?.length > 0) {
    const addressData = donorData.addresses?.length > 0 ? donorData.addresses[0] : donorData.location;
    if (addressData) {
      sections.push({
        icon: "map-pin",
        title: "Primary Address",
        items: [
          {
            label: "Address",
            value: addressData.addressLine || "N/A"
          },
          {
            label: "Area",
            value: addressData.area || "N/A"
          },
          {
            label: "City, State",
            value: `${addressData.city || "N/A"}, ${addressData.state || "N/A"}`
          },
          {
            label: "Pincode",
            value: addressData.pincode || "N/A",
            isLast: true
          }
        ]
      });
    }
  }

  if (donorData.consentForm) {
    sections.push({
      icon: "file-text",
      title: "Consent Details",
      items: [
        {
          label: "Consent Status",
          value: donorData.consentForm.isConsented ? "✓ Consented" : "Not Consented"
        },
        {
          label: "Consent Date",
          value: formatDate(donorData.consentForm.consentedAt),
          isLast: true
        }
      ]
    });
  }

  return sections;
};

export const formatRecipientDetails = (recipientData: any): DetailSection[] => {
  const sections: DetailSection[] = [];

  sections.push({
    icon: "user",
    title: "Status Information",
    items: [
      {
        label: "Availability Status",
        value: recipientData.availability || "N/A",
        isLast: true
      }
    ]
  });

  if (recipientData.medicalDetails) {
    const medicalItems: DetailItem[] = [
      {
        label: "Diagnosis",
        value: recipientData.medicalDetails.diagnosis || "N/A"
      },
      {
        label: "Allergies",
        value: recipientData.medicalDetails.allergies || "None"
      },
      {
        label: "Current Medications",
        value: recipientData.medicalDetails.currentMedications || "N/A"
      },
      {
        label: "Hemoglobin",
        value: `${recipientData.medicalDetails.hemoglobinLevel || "N/A"} g/dL`
      },
      {
        label: "Blood Glucose",
        value: `${recipientData.medicalDetails.bloodGlucoseLevel || "N/A"} mg/dL`
      },
      {
        label: "Blood Pressure",
        value: recipientData.medicalDetails.bloodPressure || "N/A"
      },
      {
        label: "Has Diabetes",
        value: recipientData.medicalDetails.hasDiabetes ? "Yes" : "No"
      },
      {
        label: "Creatinine",
        value: `${recipientData.medicalDetails.creatinineLevel || "N/A"} mg/dL`
      },
      {
        label: "Pulmonary Function",
        value: recipientData.medicalDetails.pulmonaryFunction ? `${recipientData.medicalDetails.pulmonaryFunction}%` : "N/A"
      },
      {
        label: "Liver Function Tests",
        value: recipientData.medicalDetails.liverFunctionTests || "N/A"
      },
      {
        label: "Cardiac Status",
        value: recipientData.medicalDetails.cardiacStatus || "N/A"
      },
      {
        label: "Has Infectious Diseases",
        value: recipientData.medicalDetails.hasInfectiousDiseases ? "Yes" : "No"
      },
      {
        label: "Infectious Disease Details",
        value: recipientData.medicalDetails.infectiousDiseaseDetails || "N/A"
      },
      {
        label: "Additional Notes",
        value: recipientData.medicalDetails.additionalNotes || "N/A"
      },
      {
        label: "Health Status",
        value: recipientData.medicalDetails.overallHealthStatus || "N/A",
        isLast: true
      }
    ];

    sections.push({
      icon: "heart",
      title: "Medical Information",
      items: medicalItems
    });
  }

  if (recipientData.eligibilityCriteria) {
    const eligibilityItems: DetailItem[] = [
      {
        label: "Medically Eligible",
        value: recipientData.eligibilityCriteria.medicallyEligible ? "✓ Yes" : "✗ No"
      },
      {
        label: "Legal Clearance",
        value: recipientData.eligibilityCriteria.legalClearance ? "✓ Yes" : "✗ No"
      },
      {
        label: "Age",
        value: `${recipientData.eligibilityCriteria.age || "N/A"} years`
      },
      {
        label: "Date of Birth",
        value: formatDate(recipientData.eligibilityCriteria.dob)
      },
      {
        label: "Weight",
        value: `${recipientData.eligibilityCriteria.weight || "N/A"} kg`
      },
      {
        label: "Height",
        value: `${recipientData.eligibilityCriteria.height || "N/A"} cm`
      },
      {
        label: "BMI",
        value: recipientData.eligibilityCriteria.bodyMassIndex ? recipientData.eligibilityCriteria.bodyMassIndex.toFixed(1) : "N/A"
      },
      {
        label: "Body Size",
        value: recipientData.eligibilityCriteria.bodySize || "N/A"
      },
      {
        label: "Last Reviewed",
        value: formatDate(recipientData.eligibilityCriteria.lastReviewed),
        isLast: true
      }
    ];

    sections.push({
      icon: "check-circle",
      title: "Eligibility Status",
      items: eligibilityItems
    });
  }

  if (recipientData.hlaProfile) {
    sections.push({
      icon: "shield",
      title: "HLA Profile",
      items: [
        {
          label: "HLA-A",
          value: `${recipientData.hlaProfile.hlaA1 || "N/A"}, ${recipientData.hlaProfile.hlaA2 || "N/A"}`
        },
        {
          label: "HLA-B",
          value: `${recipientData.hlaProfile.hlaB1 || "N/A"}, ${recipientData.hlaProfile.hlaB2 || "N/A"}`
        },
        {
          label: "HLA-C",
          value: `${recipientData.hlaProfile.hlaC1 || "N/A"}, ${recipientData.hlaProfile.hlaC2 || "N/A"}`
        },
        {
          label: "HLA-DR",
          value: `${recipientData.hlaProfile.hlaDR1 || "N/A"}, ${recipientData.hlaProfile.hlaDR2 || "N/A"}`
        },
        {
          label: "HLA-DQ",
          value: `${recipientData.hlaProfile.hlaDQ1 || "N/A"}, ${recipientData.hlaProfile.hlaDQ2 || "N/A"}`
        },
        {
          label: "HLA-DP",
          value: `${recipientData.hlaProfile.hlaDP1 || "N/A"}, ${recipientData.hlaProfile.hlaDP2 || "N/A"}`
        },
        {
          label: "Testing Date",
          value: formatDate(recipientData.hlaProfile.testingDate)
        },
        {
          label: "Laboratory",
          value: recipientData.hlaProfile.laboratoryName || "N/A"
        },
        {
          label: "Method",
          value: recipientData.hlaProfile.testingMethod || "N/A"
        },
        {
          label: "Is High Resolution",
          value: recipientData.hlaProfile.isHighResolution ? "Yes" : "No"
        },
        {
          label: "Certification",
          value: recipientData.hlaProfile.certificationNumber || "N/A",
          isLast: true
        }
      ]
    });
  }

  if (recipientData.addresses?.length > 0) {
    sections.push({
      icon: "map-pin",
      title: "Primary Address",
      items: [
        {
          label: "Address",
          value: recipientData.addresses[0].addressLine || "N/A"
        },
        {
          label: "Landmark",
          value: recipientData.addresses[0].landmark || "N/A"
        },
        {
          label: "Area",
          value: recipientData.addresses[0].area || "N/A"
        },
        {
          label: "City",
          value: recipientData.addresses[0].city || "N/A"
        },
        {
          label: "District",
          value: recipientData.addresses[0].district || "N/A"
        },
        {
          label: "State",
          value: recipientData.addresses[0].state || "N/A"
        },
        {
          label: "Country",
          value: recipientData.addresses[0].country || "N/A"
        },
        {
          label: "Pincode",
          value: recipientData.addresses[0].pincode || "N/A",
          isLast: true
        }
      ]
    });
  }

  if (recipientData.consentForm) {
    sections.push({
      icon: "file-text",
      title: "Consent Details",
      items: [
        {
          label: "Consent Status",
          value: recipientData.consentForm.isConsented ? "✓ Consented" : "Not Consented"
        },
        {
          label: "Consent Date",
          value: formatDate(recipientData.consentForm.consentedAt),
          isLast: true
        }
      ]
    });
  }

  return sections;
};
