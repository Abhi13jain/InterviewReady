import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Extract parameters based on whether it's assistant or workflow
        let inputText: string;

        if (body.message?.toolCallList?.length > 0) {
            // Assistant payload
            inputText = body.message.toolCallList[0].function.arguments;
        } else if (body.prompt?.text) {
            // Workflow payload
            inputText = body.prompt.text;
        } else {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        // Send to Gemini API
        const GEMINI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

        const geminiResponse = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${GEMINI_API_KEY}`,
                },
                body: JSON.stringify({
                    prompt: { text: inputText },
                    model: "gemini-2.0-flash",
                    temperature: 0.7,
                    max_output_tokens: 256,
                }),
            }
        );

        const data = await geminiResponse.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Proxy error:", error);
        return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
    }
}
