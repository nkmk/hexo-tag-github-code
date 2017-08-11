# hexo-tag-github-code

Insert code from [GitHub](https://github.com/) when static files are generated.

Not embedded.

## Install

```sh
$ npm install hexo-tag-github-code --save
```

## Usage
```
{% ghcode URL [start_line stop_line] [options] %}
```

## Options

Set like as `{cap:false,re:true}`. Please do __NOT__ insert any spaces.

| option | description | default |
| :--- | :--- | :--- |
| cap| `true`: show caption<br> `false`: no caption | `true` |
| re| `true`: the first line number restart from 1<br> `false`: the first line number start from original code number | `false` |

### Config setting

You can change default settings in `_config.yml` as below.

```yml
github_code:
  cap: false
  re: true
```


## Examples

### Full code
```
{% ghcode https://github.com/nkmk/hexo-list-related-posts/blob/master/lib/index.js %}
```

### Selected lines
Insert code from line 17 to line 22.
```
{% ghcode https://github.com/nkmk/hexo-list-related-posts/blob/master/lib/index.js 17 22 %}
```

![Selected lines](https://i.gyazo.com/babfb9ad3851b5a3f4267636ccc8a70d.png)

### Without caption
```
{% ghcode https://github.com/nkmk/hexo-list-related-posts/blob/master/lib/index.js 17 22 {cap:false} %}
```

![Without caption](https://i.gyazo.com/d1e0f94c5041371fc26e5bdc9033edf6.png)

### Restart the first line number from 1
```
{% ghcode https://github.com/nkmk/hexo-list-related-posts/blob/master/lib/index.js 17 22 {re:true} %}
```

![Restart the first line number from 1](https://i.gyazo.com/dc3611fc637352bbe5c57bf7d94f60f2.png)
