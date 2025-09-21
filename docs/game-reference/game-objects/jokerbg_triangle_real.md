# `jokerbg_triangle_real`

Jevil's fight has an unique trait that makes it memorable - it utilizes _fake_ 3D elements for its background. It consists of two elements being the **column** and the **carousel**.

The code of those elements is kept inside the Draw event of **`jokerbg_triangle_real`** object.

## Column

<imgcaption width="100%" src="./jokerbg_triangle_real-carouselbg.png" alt="Background sprite" caption="carouselbg"/>

This element uses `carouselbg` sprite (look above), splitting it into **32 slices** (16 for left and 16 for right side) and stretching them to form a fake 3D perspective resembling a column.

### Basics

The Create script introduces a variable called `bgx`. This value tracks the column’s horizontal scroll position. When `bgx` reaches 640 (the width of the background sprite), it resets to 0 so the background can loop seamlessly.

Background sprite uses color called `dkblue3` with the value <hexclr color="#1a1a4d"/>, formed from GameMaker colors in the Create script.

Each slice is normally 5 pixels wide (from `curw` variable), but it is stretched horizontally with `curscale` variable, up to 45 pixels. Slices are also slightly moved upward within its loops to help create a perspective.

### Rendering

<imgcaption src="./jokerbg_triangle_real-bgonly.png" alt="Background rendering" caption="Rendered in-game"/>

The column is rendered in two passes: one loop for the left side and another for the right. The two loops use different source heights, which might've been an oversight.

The left side starts with the smallest slice and grows up to **40 pixels** wide:

```gml
for (i = 0; i < 16; i += 1)
{
    draw_sprite_part_ext(
      spr_carouselbg, 0, curl, 0, curw, // curl - bg sprite start position
      300, curx, -i + __view_get(e__VW.YView, 0),
      curscale, 1, dkblue3, bgalpha
    ); // stretches 5 pixels of its width by curscale
    // for i = 15: 5 * 8 = 40 pixels

    tempscale = 1 + (0.5 * i); // for i = 15: 1 + (0.5 * 15) = 8.5
    curscale = floor(tempscale); // 8.5 -> 8
    curl += 5;

    if (curl >= 640) // check if overflowing
        curl -= 640; // subtract width of the sprite if true

    curw = 5;
    curx += ((5 * curscale) - 5); // prevents gaps
}
```

The right side goes in the opposite direction, shrinking from **45 pixels** down to **10 pixels**:

```gml
for (i = 16; i > 0; i -= 1)
{
    draw_sprite_part_ext(
      spr_carouselbg, 0, curl, 0, curw,
      380, curx, -i + __view_get(e__VW.YView, 0),
      curscale, 1, dkblue3, bgalpha
    ); // stretches 5 pixels of its width by curscale
    // for i = 16: 5 * 9 = 45 pixels

    tempscale = 1 + (0.5 * i); // for i = 16: 1 + (0.5 * 16) = 9

    if (tempscale < 1) // cannot be less than 1
        tempscale = 1;

    curscale = ceil(tempscale);
    curl += 5;
    ... // the same as in left side
}
```

## Carousel

This element renders a spinning set of triangular wedges, forming a carousel with alternating dark blue colors.

### Basics

The create script defines `xcen` and `ycen` as the background’s center point, set to half of the room’s width and height. They serve as the anchor for the carousel. Each loop draws **8 triangles**, controlled by the `trimax` variable.

### Rotation

The Other script for the object contains this:

::: code-group

```gml [gml_Object_obj_jokerbg_triangle_real_Other_10]
newx1 = lengthdir_x(radius, rot + ((360 / trimax) * i));
newy1 = lengthdir_y(radius / 2, rot + ((360 / trimax) * i));
newx2 = lengthdir_x(radius, rot + ((360 / trimax) * (i + 1)));
newy2 = lengthdir_y(radius / 2, rot + ((360 / trimax) * (i + 1)));

if (newy1 <= 0)
  newy1 *= 0.6;
if (newy2 <= 0)
  newy2 *= 0.6;

if (blackon == 0)
{
    draw_set_color(dkblue);
    blackon = 1;
}
else
{
    blackon = 0;
    draw_set_color(dkblue2);
}
```

:::

For each wedge, it takes two adjacent angles on an ellipse (`radius` horizontally and `radius / 2` vertically) using `lengthdir` function.

The angles advance by `360 / trimax` (with `trimax=8`, each step is 45°). The back half of the carousel is squashed to **60% of its height** to fake depth.

The colors alternate between `dkblue` (<hexclr color="#060680"/>) and `dkblue2` (<hexclr color="#202060"/>).

### Rendering

<imgcaption src="./jokerbg_triangle_real-carouselonly.png" alt="Carousel rendering" caption="Rendered in-game"/>

The carousel has **four parts**: bottom base, bottom spike, top spike and top base - each drawn in its loop using the `draw_triangle` function.

::: code-group

```gml [gml_Object_obj_jokerbg_triangle_real_Draw_0]
// bottom base
for (i = 0; i < trimax; i += 1)
{
    event_user(0); // forces to recalculate x/y variables

    draw_triangle(
      xcen, ycen,
      xcen + newx1, ycen + newy1,
      xcen + newx2, ycen + newy2,
    false);
}

// bottom spike, scaled to 1/6
for (i = 0; i < 8; i += 1)
{
    event_user(0);
    ng = 0;

    if (newy1 > 0 || newy2 > 0)
    {
        if (newx2 > (newx1 - 48))
            draw_triangle(
              xcen, ycen - 80,
              xcen + (newx1 / 6), ycen + (newy1 / 6),
              xcen + (newx2 / 6), ycen + (newy2 / 6),
            false);
    }
}

// top spike
for (i = 8; i >= 0; i -= 1)
{
    event_user(0);

    if (newy1 > 0 || newy2 > 0)
        draw_triangle(
          xcen, ycen - 80,
          xcen + (newx1 / 4), (ycen + newy1) - 380,
          xcen + (newx2 / 4), (ycen + newy2) - 380,
        false);
}

// top base
for (i = 0; i < trimax; i += 1)
{
    event_user(0);

    draw_triangle(
      xcen, ycen - 320,
      xcen + newx1, (ycen + newy1) - 320,
      xcen + newx2, (ycen + newy2) - 320,
    false);
}
```

:::
