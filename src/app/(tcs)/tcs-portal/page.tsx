import { getOrCreatePlacementApplication, checkEligibility } from "@/app/actions/placement";
import { TCSWelcomeContent } from "./content";

export default async function TCSWelcomePage() {
    const { application, user } = await getOrCreatePlacementApplication("TCS");
    const eligibility = await checkEligibility("TCS");
    const userName = user?.name || "Candidate";

    return <TCSWelcomeContent userName={userName} eligibility={eligibility} user={user} />;
}

