import { google } from "googleapis";
import { type NextRequest, NextResponse } from "next/server";

interface Attendee {
  orderId: string;
  email: string;
  code: string;
  rowIndex: number;
}

interface VerificationResponse {
  status: "success" | "error" | "warning";
  data?: {
    code: string;
  };
  message: string;
}

const sheets = google.sheets({
  version: "v4",
  auth: new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
        /\\n/g,
        "\n",
      ),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"], // Read and Write scope
  }),
});

// Cache the data to avoid hitting the API on every scan
const cachedData: Map<string, Attendee[]> = new Map();
const lastFetchTime: Map<string, number> = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

async function getSheetData(sheetId: string): Promise<Attendee[]> {
  const now = Date.now();
  const cachedSheetData = cachedData.get(sheetId);
  const lastFetch = lastFetchTime.get(sheetId) || 0;
  if (
    now - lastFetch < CACHE_DURATION &&
    cachedSheetData !== undefined &&
    cachedSheetData.length > 0
  ) {
    console.log("Serving from cache");
    return cachedSheetData;
  }

  console.log("Fetching fresh data from Google Sheets");
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: sheetId,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      throw new Error("No data found in spreadsheet.");
    }

    const headers = rows[0].map((h: string) => h.trim());
    const emailIndex = headers.indexOf("Email");
    const orderNumIndex = headers.indexOf("Order no."); // NEW: Get the Order ID column index
    const codeIndex = headers.indexOf("Code");

    if (emailIndex === -1 || orderNumIndex === -1 || codeIndex === -1) {
      throw new Error(
        "Could not find required columns. Ensure 'Email', 'Order no.' and 'Code' exist.",
      );
    }

    cachedData.set(
      sheetId,
      rows
        .slice(1)
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        .map((row: any[], index: number): Attendee | null => {
          const email = row[emailIndex];
          const orderId = row[orderNumIndex];
          const code = row[codeIndex];
          if (!email || !orderId || !code) return null; // Skip rows with missing data

          return {
            email: email.trim(),
            orderId: orderId.trim(),
            code: code.trim(),
            rowIndex: index + 2, // +1 for 0-based index, +1 for skipping header row
          };
        })
        .filter((item): item is Attendee => item !== null),
    );

    lastFetchTime.set(sheetId, now);
    return cachedData.get(sheetId) || [];
  } catch (error) {
    console.error("Error fetching from Google Sheets:", error);
    if (cachedData.has(sheetId)) return cachedData.get(sheetId) || [];
    throw error;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const { productId } = await params;

    // 2. Get the search parameters from the request URL
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");
    const orderId = searchParams.get("orderId");

    if (!email || !orderId) {
      return NextResponse.json(
        { status: "error", message: "Email and Order ID are required." },
        { status: 400 },
      );
    }

    if (!productId) {
      return NextResponse.json(
        { status: "error", message: "Product ID is required in the URL." },
        { status: 400 },
      );
    }

    const attendees = await getSheetData(productId);
    const attendee = attendees.find(
      (a) => a.email === email && a.orderId === orderId,
    );

    // 1. Check if the attendee exists
    if (!attendee) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Invalid Ticket, combination of Email and Order ID not found.",
        },
        { status: 404 },
      );
    }

    const response: VerificationResponse = {
      status: "success",
      message: "Redemption Successful!",
      data: {
        code: attendee.code,
      },
    };
    return NextResponse.json(response, { status: 200 });
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "An internal server error occurred.",
      },
      { status: 500 },
    );
  }
}
