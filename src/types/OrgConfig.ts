export default interface OrgConfig {
    brandingId: string;
    completionPhases: string[];
    pickerDisabledTaskPhases: string[];
    isSessionMode: boolean;
    isPickupMode: boolean;
    initialPhase: string;
    arrivalPhase: string;
    finalPhase: string;
    initialTrackingPhase: string;
    areShiftsEnabled: boolean;
    defaultTravelMode: string;
    isSignatureUploadEnabled: boolean;
    isPhotoUploadEnabled: boolean;
}
