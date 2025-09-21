#load "_globals.csx"
using System.IO;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UndertaleModLib.Util;
using ImageMagick;
using ImageMagick.Drawing;
using UndertaleModLib;
using UndertaleModLib.Scripting;
using UndertaleModLib.Compiler;
using UndertaleModLib.Models;
using UndertaleModLib.Decompiler;
using Microsoft.CodeAnalysis.Diagnostics;
using System.Text.RegularExpressions;
using System.Diagnostics;
using Internal;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;

readonly int chapter = int.Parse(Data?.GeneralInfo?.DisplayName?.Content["DELTARUNE Chapter ".Length..]);
readonly DirectoryInfo dir = Directory.CreateDirectory(Path.Join(Environment.GetEnvironmentVariable("TMPDIR"), $"ch{chapter}"));

readonly DirectoryInfo scripts_dir = dir.CreateSubdirectory("scripts");


GlobalDecompileContext globalDecompileContext = new(Data);
Underanalyzer.Decompiler.IDecompileSettings decompilerSettings = Data.ToolInfo.DecompilerSettings;

List<UndertaleCode> toDump = [.. Data.Code.Where(c => c.ParentEntry is null)];

SetProgressBar(null, $"Code Entries (Chapter {chapter})", 0, toDump.Count);
StartProgressBarUpdater();

await DumpCode();

await StopProgressBarUpdater();
HideProgressBar();

async Task DumpCode()
{
    await Task.Run(() => Parallel.ForEach(toDump, DumpCode));
}

void DumpCode(UndertaleCode code)
{
    if (code is not null)
    {
        string path = Path.Combine(scripts_dir.FullName, code.Name.Content + ".gml");
        try
        {
            File.WriteAllText(path, (code != null
                ? new Underanalyzer.Decompiler.DecompileContext(globalDecompileContext, code, decompilerSettings).DecompileToString()
                : ""));
        }
        catch (Exception e)
        {
            File.WriteAllText(path, "/*\nDECOMPILER FAILED!\n\n" + e.ToString() + "\n*/");
        }
    }

    IncrementProgressParallel();
}

foreach (var item in Data.BuiltinList.Instance
)
{
    Console.WriteLine(item.Key);
}
