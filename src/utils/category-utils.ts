import type { PostForList } from "./content-utils";

export type CategoryNode = {
	name: string;
	path: string;
	count: number;
	children: CategoryNode[];
	posts: PostForList[];
};

export function categorySegments(
	category: string | null | undefined,
): string[] {
	return (category || "")
		.split(/[\\/]/)
		.map((segment) => segment.trim())
		.filter(Boolean);
}

export function categoryLabel(name: string): string {
	return /^games\d+$/i.test(name) ? name.toUpperCase() : name;
}

export function matchesCategory(
	category: string | null | undefined,
	selected: string,
): boolean {
	const actual = categorySegments(category).join("/");
	const parent = categorySegments(selected).join("/");
	return !!parent && (actual === parent || actual.startsWith(`${parent}/`));
}

export function buildCategoryTree(
	posts: PostForList[],
	uncategorizedLabel: string,
): CategoryNode[] {
	const roots: CategoryNode[] = [];
	for (const post of posts) {
		const parts = categorySegments(post.data.category);
		const uncategorized = parts.length === 0;
		if (uncategorized) parts.push(uncategorizedLabel);
		let siblings = roots;
		for (let index = 0; index < parts.length; index++) {
			const path = uncategorized ? "" : parts.slice(0, index + 1).join("/");
			let node = siblings.find((candidate) => candidate.path === path);
			if (!node) {
				node = { name: parts[index], path, count: 0, children: [], posts: [] };
				siblings.push(node);
			}
			node.count++;
			if (index === parts.length - 1) node.posts.push(post);
			siblings = node.children;
		}
	}
	const sort = (nodes: CategoryNode[]) => {
		nodes.sort((a, b) =>
			a.name.localeCompare(b.name, "zh-CN", { numeric: true }),
		);
		for (const node of nodes) sort(node.children);
	};
	sort(roots);
	return roots;
}
