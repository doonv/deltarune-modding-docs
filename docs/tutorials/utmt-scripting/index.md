# UndertaleModTool Scripting

::: warning
This guide assumes you have experience with both the inner workings of GameMaker and experience with C#. The scripting API is not really documented, be ready to read UndertaleModTool's source code.

If you have issues or are stuck, ask for help in the `#modding-help` channel in the [DELTAModders discord](https://discord.gg/uKqHUrekvK).
:::

UndertaleModTool can be extended with the use of C# `.csx` Scripts. These scripts can:

- interact with UndertaleModTool's API to modify assets, automate tedious tasks, and more.
- UndertaleModTool scripts have similar abilities as regular C# applications, allowing them to interact with the filesystem, allowing for exporting/importing of assets.
- You can apply multiple scripts to one data file, allowing for easy data merging.

Additionally, all of these features can be used together, making scripts extremely powerful and versatile.

## Setting up a development environment

todo show how to with vscode

## Creating a script

### UTMT scripts vs regular C#

Since you *should be* coming from regular C#, you should know the differences between regular C# and <abbr title="UndertaleModTool">UTMT</abbr> scripting.

UTMT scripts are still written in C#, but the execution context is different:

- There is no entry point method.
- Everything can and should be declared in top-level statements.
- You can execute `async` methods freely.

You have access to several global variables via [IScriptInterface](https://github.com/UnderminersTeam/UndertaleModTool/blob/master/UndertaleModLib/Scripting/IScriptInterface.cs):

| Property | Type | Description |
| :--- | :--- | :--- |
| [`Data`] | `UndertaleData` | The root object for the entire loaded `data.win` file. This is your primary entry point for accessing and modifying game assets like `Data.GameObjects`, `Data.Sprites`, `Data.Rooms`, `Data.Code`, etc. |
| [`FilePath`] | `string` | The full path to the currently loaded `data.win` file. |
| [`ScriptPath`] | `string` | The full path of the `.csx` script file that is currently being executed. |
| [`ExePath`] | `string` | The full path to the `UndertaleModTool.exe` or `UMTCLI` executable that is running the script. |
| [`CanSave`] | `bool` | Returns `true` if the UMT interface currently allows saving the file. |
| [`ScriptExecutionSuccess`] | `bool` | Returns `true` if the *previous* script finished without errors. |
| [`ScriptErrorMessage`] | `string` | Contains the error message from the *previous* script if it failed. Otherwise `""`. |
| [`ScriptErrorType`] | `string` | Contains the exception type from the *previous* script if it failed. Otherwise `""`. |
| [`IsAppClosed`] | `bool` | Indicates if the main application window is in the process of closing. Used for advanced cases to prevent tasks from running after the app has been closed. |

UTMT scripts have the following namespaces automatically imported[^1]:

- `UndertaleModLib`
- `UndertaleModLib.Models`
- `UndertaleModLib.Decompiler`
- `UndertaleModLib.Scripting`
- `UndertaleModLib.Compiler`
- `UndertaleModTool`
- `System`
- `System.IO`
- `System.Collections.Generic`
- `System.Text.RegularExpressions`

If you want to learn more about how UTMT executes scripts see [MainWindow.xaml.cs in the UTMT source code](https://github.com/UnderminersTeam/UndertaleModTool/blob/a22a404aa51bbdc5345f83a655f50ef252b2be74/UndertaleModTool/MainWindow.xaml.cs#L2404).

### Your first script

Let's make a  mod that doubles Kris' walking speed:

```C#
// Ensures that a valid data file is loaded
// A ScriptException should be thrown if it isn't
EnsureDataLoaded();

// CodeImportGroup allows us to modify source code via several operations
// Create one using the `Data` global
CodeImportGroup importGroup = new(Data);

// This is a find replace operation on gml source code
importGroup.QueueFindReplace(
    "gml_Object_obj_mainchara_Step_0", // The code we want to modify
    "x += px;",                        // The string to find
    "x += px * 2;"                     // The string to replace it with
);
// Again, with y
importGroup.QueueFindReplace(
    "gml_Object_obj_mainchara_Step_0", // The code we want to modify
    "y += py;",                        // The string to find
    "y += py * 2;"                     // The string to replace it with
);

// Applies all the queued operations
importGroup.Import();

// Show a lil message to the user
ScriptMessage("All changes applied successfully!");
```

Now let's run our script, open UndertaleModTool with an unmodified data file of any chapter you'd like. Then go **Scripts > Run other script...**, and select your script.
<!-- <ThemeImage light="index-utmt-run-script-light.png" dark="index-utmt-run-script-dark.png" alt="A screenshot of UndertaleModTool, with the Scripts > Run other script... option highlighted" /> -->
<Image alt="A screenshot of UndertaleModTool, with the Scripts > Run other script... option highlighted" :image="{ light: 'index-utmt-run-script-light.png', dark: 'index-utmt-run-script-dark.png' }" />

The script should have modified `gml_Object_obj_mainchara_Step_0`. (you may have to reopen the code if it was already open in UTMT)

Now save the `data.win` and launch DELTARUNE. Kris should be walking twice as fast.

::: tip

We could simplify this into one `CodeImportGroup` operation with <abbr title="regular expression">regex</abbr>es.

```C#{5-13}
EnsureDataLoaded();

CodeImportGroup importGroup = new(Data);

importGroup.QueueRegexFindReplace(
    "gml_Object_obj_mainchara_Step_0",
    // @ allows us to use backslashes with needing to use double backslash
    // [xy] matches either x or y
    // \1 matches the character that matched in the first capturing group
    @"([xy]) \+= p\1;",
    // $1 contains what was matched in the first capturing group (x or y)
    @"$1 += p$1 * 2;"
);

importGroup.Import();

ScriptMessage("All changes applied successfully!");
```

:::

### Automation

UTMT Scripts can be used to modify large chunks of code at once.

For example, we can loop over every code entry in a chapter and replace every sound effect with `snd_splat`.

```C#
EnsureDataLoaded();

CodeImportGroup importGroup = new(Data);

foreach (UndertaleCode code in Data.Code)
{
    // importGroup can only modify code entries where the Offset is set to 0
    if (code.Offset != 0) continue;

    importGroup.QueueRegexFindReplace(
        code,
        @"snd_play\([a-z_]+\)",
        @"snd_play(snd_splat)"
    );
}

importGroup.Import();

ScriptMessage("the splattening has commenced.");
```

[^1]: [MainWindow.xaml.cs#L246](https://github.com/UnderminersTeam/UndertaleModTool/blob/a22a404aa51bbdc5345f83a655f50ef252b2be74/UndertaleModTool/MainWindow.xaml.cs#L246)

[`Data`]: https://github.com/UnderminersTeam/UndertaleModTool/blob/a22a404aa51bbdc5345f83a655f50ef252b2be74/UndertaleModLib/Scripting/IScriptInterface.cs#L45
[`FilePath`]: https://github.com/UnderminersTeam/UndertaleModTool/blob/a22a404aa51bbdc5345f83a655f50ef252b2be74/UndertaleModLib/Scripting/IScriptInterface.cs#L50
[`ScriptPath`]: https://github.com/UnderminersTeam/UndertaleModTool/blob/a22a404aa51bbdc5345f83a655f50ef252b2be74/UndertaleModLib/Scripting/IScriptInterface.cs#L55
[`ExePath`]: https://github.com/UnderminersTeam/UndertaleModTool/blob/a22a404aa51bbdc5345f83a655f50ef252b2be74/UndertaleModLib/Scripting/IScriptInterface.cs#L86
[`CanSave`]: https://github.com/UnderminersTeam/UndertaleModTool/blob/a22a404aa51bbdc5345f83a655f50ef252b2be74/UndertaleModLib/Scripting/IScriptInterface.cs#L70
[`ScriptExecutionSuccess`]: https://github.com/UnderminersTeam/UndertaleModTool/blob/a22a404aa51bbdc5345f83a655f50ef252b2be74/UndertaleModLib/Scripting/IScriptInterface.cs#L75
[`ScriptErrorMessage`]: https://github.com/UnderminersTeam/UndertaleModTool/blob/a22a404aa51bbdc5345f83a655f50ef252b2be74/UndertaleModLib/Scripting/IScriptInterface.cs#L80
[`ScriptErrorType`]: https://github.com/UnderminersTeam/UndertaleModTool/blob/a22a404aa51bbdc5345f83a655f50ef252b2be74/UndertaleModLib/Scripting/IScriptInterface.cs#L91
[`IsAppClosed`]: https://github.com/UnderminersTeam/UndertaleModTool/blob/a22a404aa51bbdc5345f83a655f50ef252b2be74/UndertaleModLib/Scripting/IScriptInterface.cs#L98
