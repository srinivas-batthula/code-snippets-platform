// web/src/app/api/auth/callback/route.ts
import User from "@/models/User";
import { connectDB } from "@/lib/dbConnect";
import Auth from "@/models/Extension_Auth";

export async function GET(req: Request) {
    // parse query params from incoming callback
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (!code || !state)
        return new Response("Missing code or state", { status: 400 });

    // console.log("Callback state:", state);
    try {
        // exchange code for GitHub access token (server-side)
        const tokenResp = await fetch(
            "https://github.com/login/oauth/access_token",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    client_id: process.env.VSCODE_GITHUB_CLIENT_ID!,
                    client_secret: process.env.VSCODE_GITHUB_CLIENT_SECRET!,
                    code,
                    state,
                }),
            },
        );
        const tokenJson = await tokenResp.json();
        const accessToken = tokenJson.access_token || null;
        if (!accessToken)
            return new Response("Failed to GET access token!", { status: 500 });

        // fetch GitHub user profile with returned access token
        const userResp = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `token ${accessToken}`,
                Accept: "application/json",
            },
        });
        const userJson = await userResp.json();
        const githubUsername = userJson.login || null;
        if (!githubUsername)
            return new Response("Github Username Not Found!", { status: 404 });

        // fetch the primary and verified email of user
        const emailResp = await fetch("https://api.github.com/user/emails", {
            headers: {
                Authorization: `token ${accessToken}`,
                Accept: "application/vnd.github.v3+json",
            },
        });
        const emails = await emailResp.json();
        const primaryEmail =
            emails.find((email: any) => email.primary && email.verified)
                ?.email ||
            emails.find((email: any) => email.verified)?.email ||
            null;
        if (!primaryEmail)
            return new Response("Github Primary-Email Not Found!", {
                status: 404,
            });

        // connect to DB and `create` the 'user' If not there in DB...
        await connectDB();
        let user = await User.findOne({ $or: [{ username: githubUsername }, { email: primaryEmail }] });
        if (!user) {
            user = await User.create({
                username: githubUsername,
                email: primaryEmail,
                is_from_oauth: true,
                is_verified: true,
            });
        }

        // update pending entry: mark done and hold userId (so extension polling can create a JWT)
        await Auth.findOneAndUpdate(
            { state },
            { done: true, userId: user._id },
        );

        // Redirect the 'user' back to VSCode...
        return new Response(
            `
<html>
  <head>
    <script>
      // Construct VS Code deep link
      const vscodeUri = "vscode://srinivas-batthula.codesnippets/redirect?state=${state}";
      window.location.href = vscodeUri;

      // Fallback: close after 4 seconds
      setTimeout(() => window.close(), 4000);
    </script>
  </head>
  <body>
    <h2 style="font-weight: "bold", color: "gray"">Redirecting back to VS Code...</h2>
    <p>If nothing happens, <a id="link" href="#">click here</a>.</p>

    <div style="display: "flex", flex-direction: "column", margin-top: "1.5rem"">
        <p style="color: "gray"; font-size: "1.2rem"">Feedback Team - </p>
        <p style="color: "green"">~CodeSnippets</p>
    </div>
    <script>
      document.getElementById("link").href = "vscode://srinivas-batthula.codesnippets/redirect?state=${state}";
    </script>
  </body>
</html>`,
            {
                status: 200,
                headers: { "Content-Type": "text/html" },
            },
        );
    } catch (err) {
        return new Response(
            (err as any).message || "Error in `/api/auth/callback`!",
            { status: 500 },
        );
    }
}
