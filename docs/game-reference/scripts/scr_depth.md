# `scr_depth`

## Parameters

- `target_object` [Real](https://manual.gamemaker.io/monthly/en/GameMaker_Language/GML_Overview/Data_Types.htm) (Default: `id`)\
   The object

- `offset` (Default: `0`)

```gml
function scr_depth(target_object = id, offset = 0)
{
    with (target_object)
        depth = 100000 - ((y * 10) + (sprite_height * 10) + (offset * 10));
}

```