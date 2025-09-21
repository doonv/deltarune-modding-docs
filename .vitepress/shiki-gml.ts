const gmlGrammar = {
    "name": "gml",
    "displayName": "GameMaker Language",
    "scopeName": "source.gml",
    "patterns": [
        { "include": "#comments" },
        { "include": "#strings" },
        { "include": "#keywords" },
        { "include": "#constants" },
        { "include": "#numbers" },
        { "include": "#arguments" },
        { "include": "#function-calls" },
        { "include": "#identifiers" }
    ],
    "repository": {
        "comments": {
            "patterns": [
                {
                    "name": "comment.line.double-slash.gml",
                    "match": "//.*"
                },
                {
                    "name": "comment.block.gml",
                    "begin": "/\\*",
                    "end": "\\*/",
                    "captures": {
                        "0": {
                            "name": "comment.block.gml"
                        }
                    }
                }
            ]
        },
        "strings": {
            "patterns": [
                {
                    "name": "string.quoted.double.gml",
                    "begin": "\"",
                    "end": "\"",
                    "patterns": [
                        {
                            "name": "constant.character.escape.gml",
                            "match": "\\\\."
                        }
                    ]
                },
                {
                    "name": "string.quoted.single.gml",
                    "begin": "'",
                    "end": "'",
                    "patterns": [
                        {
                            "name": "constant.character.escape.gml",
                            "match": "\\\\."
                        }
                    ]
                }
            ]
        },
        "keywords": {
            "patterns": [
                {
                    "name": "keyword.control.gml",
                    "match": "\\b(if|else|do|while|for|repeat|switch|case|default|break|continue|with|return|exit|until|begin|end|then|try|catch|finally|function)\\b"
                },
                {
                    "name": "keyword.declaration.gml",
                    "match": "\\b(var|function|constructor|static|enum)\\b"
                },
                {
                    "name": "keyword.operator.new.gml",
                    "match": "\\b(new)\\b"
                },
                {
                    "name": "keyword.operator.word.gml",
                    "match": "\\b(and|or|xor|mod|div|throw)\\b"
                }
            ]
        },
        "constants": {
            "patterns": [
                {
                    "match": "\\b(global)(?:\\.([a-zA-Z_][a-zA-Z0-9_]*))?\\b",
                    "captures": {
                        "1": {
                            "name": "constant.language.gml"
                        },
                        "2": {
                            "name": "variable.global.gml"
                        }
                    }
                },
                {
                    "name": "constant.language.gml",
                    "match": "\\b((spr_|obj_)[a-zA-Z_][a-zA-Z0-9_]*)\\b"
                },
                {
                    "name": "constant.language.gml",
                    "match": "\\b(true|false|undefined)\\b"
                },
                {
                    "name": "variable.language.gml",
                    "match": "\\b(self|other|all|noone)\\b"
                },
                {
                    "name": "variable.instance.gml",
                    "match": "\\b(x|y|xprevious|yprevious|xstart|ystart|hspeed|vspeed|direction|speed|friction|gravity|gravity_direction|object_index|id|alarm|solid|visible|persistent|depth|bbox_left|bbox_right|bbox_top|bbox_bottom|sprite_index|image_index|image_single|image_number|sprite_width|sprite_height|sprite_xoffset|sprite_yoffset|image_xscale|image_yscale|image_angle|image_alpha|image_blend|image_speed|mask_index|path_index|path_position|path_positionprevious|path_speed|path_scale|path_orientation|path_endaction|timeline_index|timeline_position|timeline_speed|timeline_running|timeline_loop|phy_rotation|phy_position_x|phy_position_y|phy_angular_velocity|phy_linear_velocity_x|phy_linear_velocity_y|phy_speed_x|phy_speed_y|phy_speed|phy_angular_damping|phy_linear_damping|phy_bullet|phy_fixed_rotation|phy_active|phy_mass|phy_inertia|phy_com_x|phy_com_y|phy_dynamic|phy_kinematic|phy_sleeping|phy_position_xprevious|phy_position_yprevious|phy_collision_points)\\b"
                }
            ]
        },
        "numbers": {
            "patterns": [
                {
                    "name": "constant.numeric.hex.gml",
                    "match": "\\b0x[0-9a-fA-F]+\\b|\\$[0-9a-fA-F]+\\b"
                },
                {
                    "name": "constant.other.color.gml",
                    "match": "#[0-9a-fA-F]{6}\\b"
                },
                {
                    "name": "constant.numeric.decimal.gml",
                    "match": "\\b(-?\\d+(?:\\.\\d+)?|-?\\.\\d+)\\b"
                }
            ]
        },
        "arguments": {
            "patterns": [
                {
                    "name": "variable.parameter.gml",
                    "match": "\\b(argument(1[0-5]|[0-9]))\\b"
                }
            ]
        },
        "function-calls": {
            "patterns": [
                {
                    // This captures the function name in a call
                    "match": "\\b([a-zA-Z_][a-zA-Z0-9_]*)(?=\\()",
                    "captures": {
                        "1": {
                            "name": "entity.name.function.gml"
                        }
                    }
                }
            ]
        },
        "identifiers": {
            "patterns": [
                {
                    // This is a general identifier, often used for variables.
                    // It has a less specific scope so keywords, functions, etc., take precedence.
                    "name": "variable.other.gml",
                    "match": "\\b[a-zA-Z_][a-zA-Z0-9_]*\\b"
                }
            ]
        }
    }
};
import { ThemeRegistration } from 'shiki'
const gmlTheme: ThemeRegistration = {
    name: "gml-theme",
    displayName: "GML Theme",
    type: 'dark',
    bg: "#282C34",
    fg: "#ABB2BF",
    settings: [
        {
            "scope": [
                "comment",
                "punctuation.definition.comment"
            ],
            "settings": {
                "foreground": "#5B995B"
            }
        },
        {
            "scope": "string",
            "settings": {
                "foreground": "#FFFF00"
            }
        },
        {
            "scope": "constant.numeric",
            "settings": {
                "foreground": "#FF6464"
            }
        },
        {
            "scope": "keyword.control",
            "settings": {
                "foreground": "#F9B46F"
            }
        },
        {
            "scope": "constant.language",
            "settings": {
                "foreground": "#FF8080"
            }
        },
        {
            "scope": "variable.parameter",
            "settings": {
                "foreground": "#FFF899"
            }
        },
        {
            "scope":
                "variable.other.gml",
            "settings": {
                "foreground": "#B2B1FF"
            }
        },
        {
            "scope": "variable.global.gml",
            "settings": {
                "foreground": "#F97BF9"
            }
        },
        {
            "scope": "variable.instance.gml",
            "settings": {
                "foreground": "#58E35A"
            }
        },
        {
            "scope": "entity.name.function",
            "settings": {
                "foreground": "#FFB871",
                "fontStyle": "bold"
            }
        }
    ]
}

export { gmlGrammar, gmlTheme };