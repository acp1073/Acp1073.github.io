<script lang="ts">
import type { SupportedLocale } from "@i18n/locale";
import { type CategoryNode, categoryLabel } from "../utils/category-utils";
import { getCategoryUrl, getPostUrlBySlug } from "../utils/url-utils";

export let node: CategoryNode;
export let locale: SupportedLocale = "zh_CN";
</script>

<details open class="category-archive-branch my-2" data-category-path={node.path}>
    <summary class="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-75 hover:bg-[var(--btn-plain-bg-hover)]">
        <span class="category-arrow text-[var(--primary)]" aria-hidden="true">›</span>
        <span class="min-w-0 flex-1 break-words font-bold">{categoryLabel(node.name)}</span>
        <span class="shrink-0 text-sm text-50">{node.count} {locale === "en" ? (node.count === 1 ? "post" : "posts") : "篇"}</span>
        <a class="shrink-0 text-xs text-[var(--primary)]" href={getCategoryUrl(node.path, locale)}>{locale === "en" ? "View all" : "查看全部"}</a>
    </summary>
    <div class="ml-4 border-l border-[var(--line-divider)] pl-3">
        {#each node.children as child (child.path)}
            <svelte:self node={child} {locale} />
        {/each}
        {#each node.posts as post (post.slug)}
            <a href={getPostUrlBySlug(post.slug, locale)} class="btn-plain flex items-start gap-3 rounded-lg px-3 py-3 text-75" data-archive-post>
                <span class="mt-0.5 text-[var(--primary)]" aria-hidden="true">·</span>
                <span class="min-w-0 flex-1 break-words font-medium">{post.data.title}</span>
                <time class="shrink-0 text-xs text-50" datetime={post.data.published.toISOString()}>{post.data.published.toISOString().slice(0, 10)}</time>
            </a>
        {/each}
    </div>
</details>

<style>
    summary { list-style: none; }
    summary::-webkit-details-marker { display: none; }
    .category-arrow { transition: transform .15s; }
    details[open] > summary > .category-arrow { transform: rotate(90deg); }
</style>
