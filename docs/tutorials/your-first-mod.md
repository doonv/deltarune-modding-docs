# Your first mod

We'll start with the very basics.

<!--                               look at me i found an excuse to use emdash NOT AI GENERATED!!!!!-->
At its very core, a mod is just that— a **mod**ification.

## File Mods

All you have to do to create a mod is to modify one of DELTARUNE's files. You don't have to use any tools for a file mod.

First, we need to find DELTARUNE's files.

::: details Find DELTARUNE's files via steam
TODO
:::
::: details Find DELTARUNE's files via path
TODO
:::

You should find a folder with this file structure.

```ansi
[01;34mDELTARUNE[0m
├── [01;34mchapter1_windows[0m
├── [01;34mchapter2_windows[0m
├── [01;34mchapter3_windows[0m
├── [01;34mchapter4_windows[0m
├── [01;34mmus[0m
├── [00mdata.win[0m
├── [01;32mDELTARUNE.exe[0m
└── ...
```

Start looking in the subdirectories, you should find some audio files and some other files. We'll get into the other files later but for now... all we really need to modify DELTARUNE's music is to modify those files. So modify one!

::: info NOTE
If you are replacing a file, note that **the files must be named identically**
:::

If you did everything correctly, you should be able to boot up DELTARUNE, and see that the music you changed... changed.
So congratulations, you just created your first DELTARUNE mod!

---

But you want to create something a bit more than that, right? You want change sprites, or code. *Where are the sprites anyway?*

You may have noticed suspiciously large files named `data.win` in the game's root folder and in each one of the chapter folders.
These files contain all most of the game's data, but it's in some weird format we can't read.

If only there was a tool that could read these files...
