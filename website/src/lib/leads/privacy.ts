/**
 * The version of the privacy notice a lead consented to.
 *
 * Lives in its own module — with no `server-only` import — so that both the
 * lead store and the public privacy page can read it and never disagree about
 * which version is in force. Bump it whenever the notice changes materially.
 */
export const PRIVACY_VERSION = "2026-08-01";
