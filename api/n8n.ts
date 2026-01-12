
/**
 * Vercel Serverless Function Proxy
 * Acts as a bridge to avoid "Mixed Content" errors when calling HTTP from HTTPS.
 */

export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { lat, lng } = req.body;

  if (lat === undefined || lng === undefined) {
    return res.status(400).json({ error: 'Missing lat or lng in request body' });
  }

  try {
    console.log(`Proxying request to n8n: lat=${lat}, lng=${lng}`);
    
    // Forward the request to the HTTP n8n server side-to-side
    const response = await fetch("http://85.215.168.54:5678/webhook/discover", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lat, lng }),
    });

    // Check if the response is JSON
    const contentType = response.headers.get("content-type");
    let responseData;
    
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = { message: await response.text() };
    }

    // Return the n8n response to the frontend
    return res.status(response.status).json(responseData);
  } catch (error: any) {
    console.error("Proxy error:", error);
    return res.status(500).json({ 
      error: 'Failed to connect to n8n server', 
      details: error.message 
    });
  }
}
