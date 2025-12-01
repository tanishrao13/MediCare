import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { message } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: 'API key not configured' },
                { status: 500 }
            );
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: message }]
                    }]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.error?.message || 'API request failed' },
                { status: response.status }
            );
        }

        const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!botResponse) {
            return NextResponse.json(
                { error: 'Invalid response format from API' },
                { status: 502 }
            );
        }

        return NextResponse.json({ response: botResponse });

    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
