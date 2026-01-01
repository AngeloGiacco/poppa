import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  matcher: [
    "/",
    "/(en|zh|ja|ko|hi|id|th|vi|yo|sw|es|fr|de|it|pt|tr|ar|el|ru|nl|pl|sv|he|ro|hu|cs|da|fi|no|hr|bg|sk|uk|fa|tl|ur)/:path*",
  ],
};
