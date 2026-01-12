
/**
 * Vercel Serverless Function: Discovery Proxy
 * Bypasses Mixed Content (HTTPS -> HTTP) blocks by executing the request server-side.
 */

export default async function handler(req: any, res: any) {
  // Only allow POST requests for this discovery endpoint
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { lat, lng } = req.body;

  // Basic validation of incoming parameters
  if (lat === undefined || lng === undefined) {
    return res.status(400).json({ error: 'Payload must include lat and lng' });
  }

  try {
    console.log(`[Proxy] Forwarding discovery request to n8n: ${lat}, ${lng}`);
    
    // Forward the request to the HTTP-only n8n server
    const response = await fetch("http://85.215.168.54:5678/webhook/discover", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ lat, lng }),
    });

    // Extract content-type to handle non-JSON responses gracefully
    const contentType = response.headers.get("content-type");
    let data;
    
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }

    // Proxy the status and data back to the frontend
    return res.status(response.status).json(data);
  } catch (error: any) {
    console.error("[Proxy Error]:", error);
    return res.status(500).json({ 
      error: 'Internal Proxy Error: Unable to connect to n8n server', 
      details: error.message 
    });
  }
}
