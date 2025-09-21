import { DefaultTheme, defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'
import { gmlGrammar, gmlTheme } from './shiki-gml'
import { createHighlighter } from 'shiki'
import footnote_plugin from 'markdown-it-footnote'
import { CodeToHastOptions, ResolveBundleKey } from '@shikijs/types'

function gameReferenceItems(): { text: string; collapsible: boolean; items: DefaultTheme.SidebarItem[] }[] {
  const dirPath = path.resolve(__dirname, `../docs/game-reference`)

  const subdirectories = fs.readdirSync(dirPath)
    .filter(item => fs.statSync(path.join(dirPath, item)).isDirectory())

  const sidebarGroups = subdirectories.map((subDir) => {
    const subDirPath = path.join(dirPath, subDir)

    const files = fs.readdirSync(subDirPath)
      .filter(file => file.endsWith('.md') && file !== 'index.md')
      .sort((a, b) => a.localeCompare(b))

    const items: DefaultTheme.SidebarItem[] = files.map(file => {
      const fileName = file.replace(/\.md$/, '')
      return {
        text: fileName,
        link: `/game-reference/${subDir}/${fileName}`
      }
    })

    return {
      text: formatTitle(subDir),
      collapsible: true,
      items: items
    }
  })

  return sidebarGroups
}

/**
 * Helper function to create a title from a file/dir name.
 * 
 * @param {string} name - The file or directory name.
 * @returns {string} The formatted title.
 */
function formatTitle(name: string): string {
  return name
    .replace(/^\d+-/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "docs",
  lastUpdated: true,
  title: "DELTARUNE Modding Docs",
  description: "Documentation for DELTARUNE mods",
  useWebFonts: false,
  cleanUrls: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
      { text: 'v1.04', items: [] },
      {
        text: 'Chapter 1', items: [
          {
            text: 'Chapter 2',
            link: '/'
          },
          {
            text: 'Chapter 3',
            link: '/'
          },
          {
            text: 'Chapter 4',
            link: '/'
          }
        ]
      }
    ],

    sidebar: [
      {
        text: 'Tutorials',
        items: [
          { text: 'Your first mod', link: '/tutorials/your-first-mod' },
          { text: 'Using UndertaleModTool', link: '/tutorials/using-undertalemodtool' },
          {
            text: 'UndertaleModTool Scripting',
            link: '/tutorials/utmt-scripting',
            items: [
              {
                text: 'API Reference',
                link: '/tutorials/utmt-scripting/api-reference'
              }
            ]
          }
        ]
      },
      {
        text: 'Game Reference',
        link: '/game-reference',
        items: gameReferenceItems()
      },
      {
        text: 'Examples (TODO REMOVE)',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      },
    ],
    socialLinks: [
      { icon: 'discord', link: 'https://discord.gg/uKqHUrekvK' },
      { icon: 'github', link: 'https://github.com/doonv/deltarune-moddding-docs' }
    ],
    footer: {
      // copyright: "© TODO"
      message: "Not an official DELTARUNE website" // todo: make better
    },
    outline: [2, 3],
    editLink: {
      pattern: 'https://github.com/doonv/deltarune-moddding-docs/edit/main/docs/:path'
    }
  },
  markdown: {
    config: (md) => {
      md.use(footnote_plugin);
    },

    theme: 'houston',
    async shikiSetup(shiki) {
      await shiki.loadTheme(gmlTheme);
      await shiki.loadLanguage(gmlGrammar);
      const orig = shiki.codeToHtml;
      shiki.codeToHtml = (code, options) => {
        if (options.lang === 'gml') {
          if ('themes' in options) {
            options.themes = {
              light: 'gml-theme',
              dark: 'gml-theme'
            };
          } else {
            options.theme = 'gml-theme';
          }
        }
        return orig(code, options);
      };
    }
  }
})