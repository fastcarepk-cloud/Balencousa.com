import type { LocationServiceData } from "@/lib/location-services"

// Import all service JSON files for DHA Phase 1, Islamabad (Residence 21).
import hairDyeAndWash from "@/data/islamabad/dha-phase-1/hair-dye-and-wash-residence-21.json"
import fullBodyFruitWaxExceptFace from "@/data/islamabad/dha-phase-1/full-body-fruit-wax-except-face-residence-21.json"
import fullBodyMassageHalfHour from "@/data/islamabad/dha-phase-1/full-body-massage---for-half-hour-residence-21.json"
import maniPedi from "@/data/islamabad/dha-phase-1/mani-pedi-residence-21.json"
import goldFacial from "@/data/islamabad/dha-phase-1/gold-facial-residence-21.json"
import bridalSpecialMehndi from "@/data/islamabad/dha-phase-1/bridal-special-mehndi-residence-21.json"
import hairCutWithBlowDry from "@/data/islamabad/dha-phase-1/hair-cut-with-blow-dry-residence-21.json"
import partyMakeupFreeHairstylingLashes from "@/data/islamabad/dha-phase-1/party-makeup-with-free-hairstyling-and-lashes-residence-21.json"
import hairProteinTreatment from "@/data/islamabad/dha-phase-1/hair-protein-treatment-residence-21.json"
import halfLegsHalfArmsFruitWax from "@/data/islamabad/dha-phase-1/half-legs-half-arms-with-fruit-wax-residence-21.json"
import eyeMakeupWithoutLashes from "@/data/islamabad/dha-phase-1/eye-makeup-without-lashes-residence-21.json"

// Build the index keyed by "<city>/<area>/<slug>" using folder naming.
export const servicesIndex: Record<string, LocationServiceData> = {
  "islamabad/dha-phase-1/hair-dye-and-wash-residence-21": hairDyeAndWash as LocationServiceData,
  "islamabad/dha-phase-1/full-body-fruit-wax-except-face-residence-21": fullBodyFruitWaxExceptFace as LocationServiceData,
  "islamabad/dha-phase-1/full-body-massage---for-half-hour-residence-21": fullBodyMassageHalfHour as LocationServiceData,
  "islamabad/dha-phase-1/mani-pedi-residence-21": maniPedi as LocationServiceData,
  "islamabad/dha-phase-1/gold-facial-residence-21": goldFacial as LocationServiceData,
  "islamabad/dha-phase-1/bridal-special-mehndi-residence-21": bridalSpecialMehndi as LocationServiceData,
  "islamabad/dha-phase-1/hair-cut-with-blow-dry-residence-21": hairCutWithBlowDry as LocationServiceData,
  "islamabad/dha-phase-1/party-makeup-with-free-hairstyling-and-lashes-residence-21":
    partyMakeupFreeHairstylingLashes as LocationServiceData,
  "islamabad/dha-phase-1/hair-protein-treatment-residence-21": hairProteinTreatment as LocationServiceData,
  "islamabad/dha-phase-1/half-legs-half-arms-with-fruit-wax-residence-21": halfLegsHalfArmsFruitWax as LocationServiceData,
  "islamabad/dha-phase-1/eye-makeup-without-lashes-residence-21": eyeMakeupWithoutLashes as LocationServiceData,
}
