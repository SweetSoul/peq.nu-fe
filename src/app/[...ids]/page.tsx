import Loader from "@/components/Loader";
import Text from "@/components/Typography/text";
import { BACKEND_URL } from "@/constants/env";
import { cn } from "@/utils/className";
import type { Metadata } from "next";
import urlMetadata from "url-metadata";
import Redirector from "./Redirector";

type Props = {
  params: { ids: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function Index({ params }: { params: { ids: string[] } }) {
  return (
    <>
      <main
        className={cn(
          "flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[rgb(5_61_56)] to-[rgb(20_20_15)]"
        )}
      >
        <Text as="h1" size="5xl" className="mb-10 text-primary">
          Calma que já vai!
        </Text>
        <Redirector params={params} />
        <Loader />
      </main>
    </>
  );
}

function parseMetadata(fetchedMetadata: urlMetadata.Result): Metadata {
  const title =
    typeof fetchedMetadata?.title === "string"
      ? fetchedMetadata?.title
      : "Link encurtado peq.nu!";
  const description =
    typeof fetchedMetadata?.description === "string"
      ? fetchedMetadata?.description
      : "Encurtador de links simples e direto ao ponto :)";
  const generator =
    typeof fetchedMetadata?.generator === "string"
      ? fetchedMetadata?.generator
      : "peq.nu";
  const keywords =
    typeof fetchedMetadata?.keywords === "string"
      ? fetchedMetadata?.keywords
      : "peq.nu, encurtador, link, url";
  const icons = {
    icon:
      typeof fetchedMetadata?.favicon === "string"
        ? fetchedMetadata?.favicon
        : "/favicon.ico",
    apple:
      typeof fetchedMetadata?.["apple-touch-icon"] === "string"
        ? fetchedMetadata?.["apple-touch-icon"]
        : "/favicon.ico",
  };
  const twitter = {
    card:
      typeof fetchedMetadata?.["twitter:card"] === "string"
        ? fetchedMetadata?.["twitter:card"]
        : "summary_large_image",
    title:
      typeof fetchedMetadata?.["twitter:title"] === "string"
        ? fetchedMetadata?.["twitter:title"]
        : title,
    description:
      typeof fetchedMetadata?.["twitter:description"] === "string"
        ? fetchedMetadata?.["twitter:description"]
        : "Encurtador de links simples e direto ao ponto :)",
    images: [
      typeof fetchedMetadata?.["twitter:image"] === "string"
        ? fetchedMetadata?.["twitter:image"]
        : `/api/og?title=${title}`,
    ],
  };
  const openGraph = {
    title:
      typeof fetchedMetadata?.["og:title"] === "string"
        ? fetchedMetadata?.["og:title"]
        : title,
    description:
      typeof fetchedMetadata?.["og:description"] === "string"
        ? fetchedMetadata?.["og:description"]
        : "Encurtador de links simples e direto ao ponto :)",
    images: [
      {
        url:
          typeof fetchedMetadata?.["og:image"] === "string"
            ? fetchedMetadata?.["og:image"]
            : `/api/og?title=${title}`,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
    url:
      typeof fetchedMetadata?.["og:url"] === "string"
        ? fetchedMetadata?.["og:url"]
        : "https://peq.nu",
    siteName:
      typeof fetchedMetadata?.["og:site_name"] === "string"
        ? fetchedMetadata?.["og:site_name"]
        : "peq.nu",
  };

  return {
    metadataBase: new URL("https://peq.nu"),
    title,
    description,
    openGraph,
    generator,
    keywords,
    icons,
    twitter,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const hash = params.ids.slice(-1)[0];
  if (!hash)
    return {
      title: "Link encurtado peq.nu!",
      openGraph: {
        images: ["/favicon.ico"],
      },
    };
  //fetch metadata from final url
  const finalUrl: string = await fetch(`${BACKEND_URL}${hash ?? ""}`)
    .then((res) => res.json())
    .then((res: { url: string }) => res.url);

  const targetMetadata = await urlMetadata(finalUrl);

  return parseMetadata(targetMetadata);
}
