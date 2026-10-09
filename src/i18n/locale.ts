import { profileConfig, siteConfig } from "../config";

export type SupportedLocale = "zh_CN" | "en";

export function getLocale(pathname: string): SupportedLocale {
	const base = import.meta.env.BASE_URL.replace(/\/$/, "");
	const path = pathname.startsWith(`${base}/`)
		? pathname.slice(base.length)
		: pathname;
	return /^\/en(?:\/|$)/.test(path) ? "en" : "zh_CN";
}

export function getSiteLabels(locale: SupportedLocale) {
	return locale === "en"
		? {
				title: "ACP1073's Blog",
				subtitle: "Learning, technology & life",
				bio: "Learning, technology & life",
			}
		: {
				title: siteConfig.title,
				subtitle: siteConfig.subtitle,
				bio: profileConfig.bio,
			};
}
