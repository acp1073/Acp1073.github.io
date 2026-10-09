import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import type { SupportedLocale } from "../i18n/locale";

export function pathsEqual(path1: string, path2: string) {
	const normalizedPath1 = path1.replace(/^\/|\/$/g, "").toLowerCase();
	const normalizedPath2 = path2.replace(/^\/|\/$/g, "").toLowerCase();
	return normalizedPath1 === normalizedPath2;
}

function joinUrl(...parts: string[]): string {
	const joined = parts.join("/");
	return joined.replace(/\/+/g, "/");
}

export function getPostUrlBySlug(
	slug: string,
	locale: SupportedLocale = "zh_CN",
): string {
	return localizedUrl(`/posts/${slug}/`, locale);
}

export function getTagUrl(
	tag: string,
	locale: SupportedLocale = "zh_CN",
): string {
	if (!tag) return localizedUrl("/archive/", locale);
	return localizedUrl(
		`/archive/?tag=${encodeURIComponent(tag.trim())}`,
		locale,
	);
}

export function getCategoryUrl(
	category: string | null,
	locale: SupportedLocale = "zh_CN",
): string {
	if (
		!category ||
		category.trim() === "" ||
		category.trim().toLowerCase() ===
			i18n(I18nKey.uncategorized, locale).toLowerCase()
	)
		return localizedUrl("/archive/?uncategorized=true", locale);
	return localizedUrl(
		`/archive/?category=${encodeURIComponent(category.trim())}`,
		locale,
	);
}

export function getDir(path: string): string {
	const lastSlashIndex = path.lastIndexOf("/");
	if (lastSlashIndex < 0) {
		return "/";
	}
	return path.substring(0, lastSlashIndex + 1);
}

export function url(path: string) {
	return joinUrl("", import.meta.env.BASE_URL, path);
}

// Keep query strings and anchors while changing the interface language.
export function localizedUrl(path: string, locale: SupportedLocale): string {
	const base = import.meta.env.BASE_URL.replace(/\/$/, "");
	const splitAt = path.search(/[?#]/);
	const pathname = splitAt < 0 ? path : path.slice(0, splitAt);
	const suffix = splitAt < 0 ? "" : path.slice(splitAt);
	const relative = pathname.startsWith(`${base}/`)
		? pathname.slice(base.length)
		: pathname;
	const unprefixed = relative.replace(/^\/en(?:\/|$)/, "/");
	return url(`${locale === "en" ? "/en" : ""}${unprefixed}`) + suffix;
}
