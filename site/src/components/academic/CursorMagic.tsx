import Script from "next/script";
export function CursorMagic() {
  return <Script src="/cursor-magic.js" strategy="afterInteractive" />;
}
