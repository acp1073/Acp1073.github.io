import I18nKey from "@i18n/i18nKey";
import type { SupportedLocale } from "@i18n/locale";
import { i18n } from "@i18n/translation";
import { LinkPreset, type NavBarLink } from "@/types/config";

export function getLinkPresets(locale: SupportedLocale): {
	[key in LinkPreset]: NavBarLink;
} {
	return {
		[LinkPreset.Home]: {
			name: i18n(I18nKey.home, locale),
			url: "/",
		},
		[LinkPreset.About]: {
			name: i18n(I18nKey.about, locale),
			url: "/about/",
		},
		[LinkPreset.Archive]: {
			name: i18n(I18nKey.archive, locale),
			url: "/archive/",
		},
	};
}
