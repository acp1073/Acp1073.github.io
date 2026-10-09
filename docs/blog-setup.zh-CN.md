# 博客部署与 Obsidian 写作

网站地址：https://acp1073.github.io/

## 首次部署

1. 在仓库的 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**。
2. 合并博客初始化 PR 到 `main`。
3. 在 **Actions → Build and deploy blog** 中查看运行结果。构建通过后，`deploy` 作业会将网站发布到 GitHub Pages。
4. 打开 https://acp1073.github.io/。以后每次推送到 `main` 都会自动检查、构建和部署。

PR 只检查和构建，不部署。首次设置前网站不会自动可用；如果部署失败，先确认 Pages 的 Source 已选择 GitHub Actions。

## 本地预览

安装 Git、Node.js 22 LTS 和 pnpm 9.14.4，然后运行：

```powershell
git clone https://github.com/acp1073/Acp1073.github.io.git
cd Acp1073.github.io
pnpm install --frozen-lockfile
pnpm dev
```

打开终端显示的本地地址。`pnpm dev` 会显示草稿，`pnpm build` 的正式输出会排除 `draft: true` 的文章。

发布前可以运行：

```powershell
pnpm check
pnpm build
pnpm preview
```

正式构建会生成搜索索引、RSS 和站点地图。

## 用 Obsidian 写文章

最简单的方式是把本地仓库的 `src/content/posts` 文件夹作为一个独立的 Obsidian 库打开。这样，文章及其附件不需要额外同步。

不要把整个个人笔记库直接推送到这个仓库：仓库是公开的。`draft: true` 只控制网页是否展示，不会隐藏 GitHub 上已经提交的 Markdown 文件。私人草稿应保留在原来的私人笔记库，准备公开时再复制到博客。

推荐每篇文章一个文件夹：

```text
src/content/posts/
  my-first-post/
    index.md
    cover.jpg
    assets/
      screenshot.png
```

将 `docs/blog-post-template.md` 复制为 `my-first-post/index.md`，修改文章属性。封面填写 `image: ./cover.jpg`。

在 Obsidian **设置 → 文件与链接** 中关闭“使用 Wiki 链接”，将新链接格式设为“基于当前笔记的相对路径”，附件存储位置设为“当前文件所在文件夹下指定的子文件夹”，子文件夹名设为 `assets`。图片即可使用 `![说明](./assets/screenshot.png)`，方便以后导出到其他平台。

正文优先使用标准 Markdown。`[[双链]]`、`![[笔记嵌入]]`、Dataview 和其他 Obsidian 插件渲染结果不会自动转换成博客内容。

## 发布文章

1. 完成正文、标题、发布日期、摘要、封面、分类和标签。
2. 将 `draft` 改为 `false`，保存文件。
3. 在仓库根目录检查并提交这篇文章：

```powershell
git status
git add src/content/posts/my-first-post
git commit -m "Publish my first post"
git push origin main
```

首次 Git 登录使用自己的 GitHub 账号。命令中的文件夹名请替换成实际文章文件夹。更新文章同样提交并推送即可；需要展示更新日期时，添加 `updated: 2026-10-10`，并修改为实际日期。

`pnpm new-post my-first-post/index` 也能创建文章，新文章默认是草稿。Obsidian 的本地设置目录 `.obsidian` 和回收站 `.trash` 已加入 Git 忽略规则。

## 修改外观

- 中文名称、简介、头像、横幅和导航：`src/config.ts`。
- 英文名称、简介：`src/i18n/locale.ts` 的 `getSiteLabels`。
- 关于页面：中文版 `src/content/spec/about.md`，英文版 `src/content/spec/about-en.md`。
- 网站域名：`astro.config.mjs` 的 `site`。当前为用户主页站点，`base` 保持 `/`。
- 横幅目前使用 Fuwari 的示例图片；更换为自己的图片后，可以更新关于页面中的图片来源说明。
- 模板示例文章保留为草稿，可参考其写法。不要把它们误当成自己的原创文章发布。

文章模板中的 `image` 留空时没有封面；填写本地相对路径或远程图片地址即可显示。博客上线不会自动发布到知乎、CSDN 或小黑盒，这些平台需要各自的发布适配。

右上角的 `EN` / `中文` 按钮切换界面语言。中文版使用根路径，英文版使用 `/en/`；切换时保留当前页面和归档筛选。导航、侧栏、搜索和关于页面均有对应语言，文章正文、标题和自定义分类标签保留原文，新增文章会自动生成两种界面下的页面。

## 参考

- [Fuwari 模板](https://github.com/saicaca/fuwari)
- [Astro 部署到 GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)
