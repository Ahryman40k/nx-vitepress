# Ahryman40k

This project was generated using [Nx](https://nx.dev).

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="450"></p>

## Install the plugin

You first need to install the plugin to your workspace

`npm i -D @ahryman40k/nx-vitepress`

## Add a vitepress project to workspace

then you can add as many vitepress projects to your workspace

`nx g @ahryman40k/nx-vitepress:app`

Vitepress project is initialized with

- a dark/light theme switcher
- a custom toolbar
- a predefined navbar
- an home page

the vitepress project declares 3 commands:

- `nx build --project your_doc_project` to build your documentation project
- `nx serve --project your_doc_project` to serve your documentation project
- `nx dev --project your_doc_project` to serve your documentation project for development purpose (hot reload, ...)

The addin also support custom directory.

`nx g @ahryman40k/nx-vitepress:app --directory your_custom_dir`
