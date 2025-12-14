export interface PublicUserDTO {
    id: string;
    username: string;
    name: string;
    profileImageUrl?: string;
}

export interface NearbyDonationActivityDTO {
    user: PublicUserDTO;
    pendingDonations: DonationDTO[];
}

export interface NearbyRequestActivityDTO {
    user: PublicUserDTO;
    pendingRequests: ReceiveRequestDTO[];
}

export type DonationType = 'BLOOD' | 'ORGAN' | 'TISSUE' | 'STEM_CELL';
export type RequestType = 'BLOOD' | 'ORGAN' | 'TISSUE' | 'STEM_CELL';
export type BloodType = 'A_POSITIVE' | 'A_NEGATIVE' | 'B_POSITIVE' | 'B_NEGATIVE' | 'O_POSITIVE' | 'O_NEGATIVE' | 'AB_POSITIVE' | 'AB_NEGATIVE';
export type OrganType = 'HEART' | 'LIVER' | 'KIDNEY' | 'LUNG' | 'PANCREAS' | 'INTESTINE';
export type TissueType = 'BONE' | 'SKIN' | 'CORNEA' | 'VEIN' | 'TENDON' | 'LIGAMENT';
export type StemCellType = 'PERIPHERAL_BLOOD' | 'BONE_MARROW' | 'CORD_BLOOD';
export type DonationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED_BY_DONOR' | 'IN_PROGRESS';
export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'FULFILLED' | 'CANCELLED' | 'EXPIRED';
export type UrgencyLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface DonationDTO {
    id: string;
    donorId: string;
    locationId?: string;
    donationType: DonationType;
    donationDate: string;
    status: DonationStatus;
    bloodType: BloodType;
    quantity?: number;

    organType?: OrganType;
    isCompatible?: boolean;
    organQuality?: string;
    organViabilityExpiry?: string;
    coldIschemiaTime?: number;
    organPerfused?: boolean;
    organWeight?: number;
    organSize?: string;
    functionalAssessment?: string;
    hasAbnormalities?: boolean;
    abnormalityDescription?: string;

    tissueType?: TissueType;

    stemCellType?: StemCellType;
}

export interface ReceiveRequestDTO {
    id: string;
    recipientId: string;
    locationId?: string;
    requestType: RequestType;
    requestedBloodType: BloodType;
    requestedOrgan?: OrganType;
    requestedTissue?: TissueType;
    requestedStemCellType?: StemCellType;
    urgencyLevel: UrgencyLevel;
    quantity?: number;
    requestDate: string;
    status: RequestStatus;
    notes?: string;
}
