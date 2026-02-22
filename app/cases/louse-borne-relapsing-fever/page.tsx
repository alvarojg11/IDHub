import { permanentRedirect } from "next/navigation";

export default function LegacyLbrfCaseRedirectPage() {
  permanentRedirect("/cases/lbrf");
}
