# @ghostv/babel-preset-ghostv

babel preset for @ghostv

## Usage

.babelrc:

```json
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "useBuiltIns": "usage",
                "corejs": {
                    "version": 3,
                    "proposals": true
                }
            }
        ],
        // @ghostv/babel-preset-ghostv
        [
            "@ghostv/ghostv",
            {
                "jsx": true
            }
        ]
    ]
}
```
