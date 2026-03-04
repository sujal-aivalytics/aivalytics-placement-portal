"use client";

import { useRouter } from "next/navigation";
import { EligibilityModal } from "./eligibility-modal";

export function EligibilityActionWrapper({ company, defaultValues }: { company: "TCS" | "Wipro", defaultValues: any }) {
    const router = useRouter();
    return (
        <EligibilityModal
            company={company}
            defaultValues={defaultValues}
            onSuccess={() => router.refresh()}
        />
    );
}
