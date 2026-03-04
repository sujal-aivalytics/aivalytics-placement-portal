
import { NextRequest, NextResponse } from "next/server";

const HEYGEN_API_KEY = process.env.NEXT_PUBLIC_HEYGEN_API_KEY;

export async function GET(request: NextRequest) {
    try {
        if (!HEYGEN_API_KEY) {
            return NextResponse.json(
                { error: "API key is missing from server configuration" },
                { status: 500 }
            );
        }

        const res = await fetch(
            "https://api.heygen.com/v1/streaming.create_token",
            {
                method: "POST",
                headers: {
                    "x-api-key": HEYGEN_API_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({})
            }
        );

        const data = await res.json();
        console.log("HeyGen Response Status:", res.status);
        console.log("HeyGen Response Body:", JSON.stringify(data));

        if (data.error || res.status !== 200) {
            console.error("HeyGen Token Error:", data);
            return NextResponse.json(
                { error: data.error || data.message || "Failed to create token", details: data },
                { status: res.status }
            );
        }

        return NextResponse.json(data.data);
    } catch (error) {
        console.error("Error generating HeyGen token:", error);
        return NextResponse.json(
            { error: "Failed to generate token", details: String(error) },
            { status: 500 }
        );
    }
}
