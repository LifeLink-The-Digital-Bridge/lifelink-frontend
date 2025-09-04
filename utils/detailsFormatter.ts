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

export const formatDonorDetails = (donorData: any): DetailSection[] => {
  const sections: DetailSection[] = [];

  sections.push({
    icon: "user",
    title: "Registration Details",
    items: [
      {
        label: "Registration Date",
        value: donorData.registrationDate ? new Date(donorData.registrationDate).toLocaleDateString() : "N/A"
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
        label: "Blood Pressure",
        value: donorData.medicalDetails.bloodPressure || "N/A"
      },
      {
        label: "Creatinine",
        value: `${donorData.medicalDetails.creatinineLevel || "N/A"} mg/dL`
      },
      {
        label: "Cardiac Status",
        value: donorData.medicalDetails.cardiacStatus || "N/A"
      },
      {
        label: "Health Status",
        value: donorData.medicalDetails.overallHealthStatus || "N/A"
      },
      {
        label: "Taking Medication",
        value: donorData.medicalDetails.takingMedication ? "Yes" : "No",
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
        label: "Weight",
        value: `${donorData.eligibilityCriteria.weight || "N/A"} kg`
      },
      {
        label: "Height",
        value: `${donorData.eligibilityCriteria.height || "N/A"} cm`
      }
    ];
    
    if (donorData.eligibilityCriteria.bodyMassIndex) {
      eligibilityItems.push({
        label: "BMI",
        value: donorData.eligibilityCriteria.bodyMassIndex.toString()
      });
    }
    
    eligibilityItems.push(
      {
        label: "Medical Clearance",
        value: donorData.eligibilityCriteria.medicalClearance ? "✓ Approved" : "Pending"
      },
      {
        label: "Last Donation",
        value: donorData.eligibilityCriteria.lastDonationDate 
          ? new Date(donorData.eligibilityCriteria.lastDonationDate).toLocaleDateString() 
          : "Never",
        isLast: true
      }
    );
    
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
          value: donorData.hlaProfile.testingDate 
            ? new Date(donorData.hlaProfile.testingDate).toLocaleDateString() 
            : "N/A"
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
          value: donorData.consentForm.consentedAt 
            ? new Date(donorData.consentForm.consentedAt).toLocaleDateString() 
            : "N/A",
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
      }
    ];
    
    if (recipientData.medicalDetails.hemoglobinLevel) {
      medicalItems.push({
        label: "Hemoglobin",
        value: `${recipientData.medicalDetails.hemoglobinLevel} g/dL`
      });
    }
    
    if (recipientData.medicalDetails.bloodPressure) {
      medicalItems.push({
        label: "Blood Pressure",
        value: recipientData.medicalDetails.bloodPressure
      });
    }
    
    if (recipientData.medicalDetails.creatinineLevel) {
      medicalItems.push({
        label: "Creatinine",
        value: `${recipientData.medicalDetails.creatinineLevel} mg/dL`
      });
    }
    
    medicalItems.push({
      label: "Health Status",
      value: recipientData.medicalDetails.overallHealthStatus || "N/A",
      isLast: true
    });
    
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
      }
    ];
    
    if (recipientData.eligibilityCriteria.age) {
      eligibilityItems.push({
        label: "Age",
        value: `${recipientData.eligibilityCriteria.age} years`
      });
    }
    
    if (recipientData.eligibilityCriteria.weight) {
      eligibilityItems.push({
        label: "Weight",
        value: `${recipientData.eligibilityCriteria.weight} kg`
      });
    }
    
    if (recipientData.eligibilityCriteria.height) {
      eligibilityItems.push({
        label: "Height",
        value: `${recipientData.eligibilityCriteria.height} cm`
      });
    }
    
    if (recipientData.eligibilityCriteria.bodyMassIndex) {
      eligibilityItems.push({
        label: "BMI",
        value: recipientData.eligibilityCriteria.bodyMassIndex.toString()
      });
    }
    
    eligibilityItems.push({
      label: "Last Reviewed",
      value: recipientData.eligibilityCriteria.lastReviewed 
        ? new Date(recipientData.eligibilityCriteria.lastReviewed).toLocaleDateString() 
        : "N/A",
      isLast: true
    });
    
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
          label: "Testing Date",
          value: recipientData.hlaProfile.testingDate 
            ? new Date(recipientData.hlaProfile.testingDate).toLocaleDateString() 
            : "N/A"
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
          label: "Area",
          value: recipientData.addresses[0].area || "N/A"
        },
        {
          label: "City, State",
          value: `${recipientData.addresses[0].city || "N/A"}, ${recipientData.addresses[0].state || "N/A"}`
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
          value: recipientData.consentForm.consentedAt 
            ? new Date(recipientData.consentForm.consentedAt).toLocaleDateString() 
            : "N/A",
          isLast: true
        }
      ]
    });
  }

  return sections;
};