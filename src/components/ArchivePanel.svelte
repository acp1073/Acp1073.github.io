<script lang="ts">
import type { SupportedLocale } from "@i18n/locale";
import { onMount } from "svelte";
import I18nKey from "../i18n/i18nKey";
import { i18n } from "../i18n/translation";
import {
	buildCategoryTree,
	type CategoryNode,
	categorySegments,
	matchesCategory,
} from "../utils/category-utils";
import type { PostForList as Post } from "../utils/content-utils";
import { getPostUrlBySlug } from "../utils/url-utils";
import CategoryArchiveBranch from "./CategoryArchiveBranch.svelte";

export let tags: string[] = [];
export let categories: string[] = [];
export let sortedPosts: Post[] = [];

const params = new URLSearchParams(window.location.search);
tags = params.has("tag") ? params.getAll("tag") : [];
categories = params.has("category") ? params.getAll("category") : [];
const uncategorized = params.get("uncategorized");

interface Group {
	year: number;
	posts: Post[];
}

export let locale: SupportedLocale = "zh_CN";

let groups: Group[] = [];
let categoryTree: CategoryNode[] = [];
let view: "categories" | "time" = "categories";
let postCount = 0;

function formatDate(date: Date) {
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day = date.getDate().toString().padStart(2, "0");
	return `${month}-${day}`;
}

function formatTag(tagList: string[]) {
	return tagList.map((t) => `#${t}`).join(" ");
}

onMount(async () => {
	let filteredPosts: Post[] = sortedPosts;

	if (tags.length > 0) {
		filteredPosts = filteredPosts.filter(
			(post) =>
				Array.isArray(post.data.tags) &&
				post.data.tags.some((tag) => tags.includes(tag)),
		);
	}

	if (categories.length > 0) {
		filteredPosts = filteredPosts.filter((post) =>
			categories.some((category) =>
				matchesCategory(post.data.category, category),
			),
		);
	}

	if (uncategorized) {
		filteredPosts = filteredPosts.filter(
			(post) => categorySegments(post.data.category).length === 0,
		);
	}

	const grouped = filteredPosts.reduce(
		(acc, post) => {
			const year = post.data.published.getFullYear();
			if (!acc[year]) {
				acc[year] = [];
			}
			acc[year].push(post);
			return acc;
		},
		{} as Record<number, Post[]>,
	);

	const groupedPostsArray = Object.keys(grouped).map((yearStr) => ({
		year: Number.parseInt(yearStr, 10),
		posts: grouped[Number.parseInt(yearStr, 10)],
	}));

	groupedPostsArray.sort((a, b) => b.year - a.year);

	groups = groupedPostsArray;
	postCount = filteredPosts.length;
	categoryTree = buildCategoryTree(
		filteredPosts,
		i18n(I18nKey.uncategorized, locale),
	);
});
</script>

<div class="card-base px-8 py-6">
    <div class="mb-5 flex flex-wrap items-center gap-2" role="group" aria-label={locale === "en" ? "Archive view" : "归档视图"}>
        <button class="btn-plain rounded-lg px-4 py-2" class:active={view === "categories"} aria-pressed={view === "categories"} on:click={() => view = "categories"}>{locale === "en" ? "By category" : "按分类"}</button>
        <button class="btn-plain rounded-lg px-4 py-2" class:active={view === "time"} aria-pressed={view === "time"} on:click={() => view = "time"}>{locale === "en" ? "By date" : "按时间"}</button>
    </div>
    {#if postCount === 0}
        <p class="py-8 text-center text-50">{locale === "en" ? "No posts found." : "暂无文章"}</p>
    {:else if view === "categories"}
        <div data-category-archive>
            {#each categoryTree as node (node.path)}
                <CategoryArchiveBranch {node} {locale} />
            {/each}
        </div>
    {:else}
    {#each groups as group}
        <div>
            <div class="flex flex-row w-full items-center h-[3.75rem]">
                <div class="w-[15%] md:w-[10%] transition text-2xl font-bold text-right text-75">
                    {group.year}
                </div>
                <div class="w-[15%] md:w-[10%]">
                    <div
                            class="h-3 w-3 bg-none rounded-full outline outline-[var(--primary)] mx-auto
                  -outline-offset-[2px] z-50 outline-3"
                    ></div>
                </div>
                <div class="w-[70%] md:w-[80%] transition text-left text-50">
                    {group.posts.length} {i18n(group.posts.length === 1 ? I18nKey.postCount : I18nKey.postsCount, locale)}
                </div>
            </div>

            {#each group.posts as post}
                <a
                        href={getPostUrlBySlug(post.slug, locale)}
                        aria-label={post.data.title}
                        class="group btn-plain !block h-10 w-full rounded-lg hover:text-[initial]"
                >
                    <div class="flex flex-row justify-start items-center h-full">
                        <!-- date -->
                        <div class="w-[15%] md:w-[10%] transition text-sm text-right text-50">
                            {formatDate(post.data.published)}
                        </div>

                        <!-- dot and line -->
                        <div class="w-[15%] md:w-[10%] relative dash-line h-full flex items-center">
                            <div
                                    class="transition-all mx-auto w-1 h-1 rounded group-hover:h-5
                       bg-[oklch(0.5_0.05_var(--hue))] group-hover:bg-[var(--primary)]
                       outline outline-4 z-50
                       outline-[var(--card-bg)]
                       group-hover:outline-[var(--btn-plain-bg-hover)]
                       group-active:outline-[var(--btn-plain-bg-active)]"
                            ></div>
                        </div>

                        <!-- post title -->
                        <div
                                class="w-[70%] md:max-w-[65%] md:w-[65%] text-left font-bold
                     group-hover:translate-x-1 transition-all group-hover:text-[var(--primary)]
                     text-75 pr-8 whitespace-nowrap overflow-ellipsis overflow-hidden"
                        >
                            {post.data.title}
                        </div>

                        <!-- tag list -->
                        <div
                                class="hidden md:block md:w-[15%] text-left text-sm transition
                     whitespace-nowrap overflow-ellipsis overflow-hidden text-30"
                        >
                            {formatTag(post.data.tags)}
                        </div>
                    </div>
                </a>
            {/each}
        </div>
    {/each}
    {/if}
</div>

<style>
    button.active { background: var(--btn-regular-bg); color: var(--primary); }
</style>
