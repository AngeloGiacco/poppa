import { registerGlobals } from "@livekit/react-native";
import { registerRootComponent } from "expo";

import App from "./App";

// Initialize LiveKit WebRTC globals for ElevenLabs voice conversations
registerGlobals();

registerRootComponent(App);
