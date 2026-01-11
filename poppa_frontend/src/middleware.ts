import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  // Keep this list in sync with locales in src/i18n/routing.ts
  matcher: [
    "/",
    "/(af|ar|as|az|be|bg|bn|bs|ca|cs|cy|da|de|el|en|es|et|fa|fi|fr|ga|gl|gu|ha|he|hi|hr|hu|hy|id|is|it|ja|jv|ka|kk|kn|ko|ky|lb|lt|lv|mk|ml|mr|ms|ne|nl|no|pa|pl|ps|pt|pt-br|ro|ru|sd|sk|sl|so|sr|sv|sw|ta|te|th|tl|tr|uk|ur|vi|zh)/:path*",
  ],
};
