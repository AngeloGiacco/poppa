# Poppa

Poppa is a conversational AI platform for tutoring with the thinking method. We use livekit and the openai realtime api.

## Repository Structure

### /agent

This directory contains the agent implementation. There are two versions, one in Python and one in TypeScript.

1. `playground_agent.py` - Built on the LiveKit [Python Agents framework](https://github.com/livekit/agents)
2. `playground_agent.ts` - Built on the LiveKit [Node.js Agents framework](https://github.com/livekit/agents-js)

### /web

This directory houses the web frontend, built with Next.js.

## Prerequisites

- Node.js and pnpm (for web frontend and Node.js agent)
- Python 3.9 or higher (for Python agent)
- pip (Python package installer)
- LiveKit Cloud or self-hosted LiveKit server

## Getting Started

### Agent Setup

1. Navigate to the `/agent` directory
2. Copy the sample environment file: `cp .env.sample .env.local`
3. Open `.env.local` in a text editor and enter your LiveKit credentials

#### Python Version

1. Create a virtual environment: `python -m venv .venv`
2. Activate the virtual environment:
   - On macOS and Linux: `source .venv/bin/activate`
   - On Windows: `.venv\Scripts\activate`
3. Load the environment variables:
   - On macOS and Linux: `source .env.local`
   - On Windows: `set -a; . .env.local; set +a`
4. Install dependencies: `pip install -r requirements.txt`
5. Run the agent in development mode: `python playground_agent.py dev`

#### Node.js Version

1. Install dependencies: `pnpm install`
2. Load the environment variables:
   - On macOS and Linux: `source .env.local`
   - On Windows: `set -a; . .env.local; set +a` or `Get-Content .env.local | ForEach-Object { if ($_ -match '^([^=]+)=(.*)$') { [System.Environment]::SetEnvironmentVariable($Matches[1], $Matches[2]) } }`
3. Run the agent in development mode: `pnpm dev`

### Web Frontend Setup

1. Navigate to the `/web` directory
2. Copy the sample environment file: `cp .env.sample .env.local`
3. Open `.env.local` in a text editor and enter your LiveKit credentials:
4. Install dependencies: `pnpm install`
5. Run the development server: `pnpm dev`
6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

The agent can be deployed in a variety of ways: [Deployment & Scaling Guide](https://docs.livekit.io/agents/deployment/)

The web frontend can be deployed using your preferred Next.js hosting solution, such as [Vercel](https://vercel.com/).

## Troubleshooting

Ensure the following:

- Both web and agent are running
- Environment variables are set up correctly
- Correct versions of Node.js, pnpm, and Python are installed

## Contributing

We welcome contributions to improve Poppa. To contribute, please follow these guidelines:

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature-branch`)
6. Open a pull request

## Additional Resources

For more information or support, please refer to [LiveKit docs](https://docs.livekit.io/).

## License

Apache 2.0
