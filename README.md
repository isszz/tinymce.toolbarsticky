# tinymce.toolbarsticky
Tinymce editor toolbar ceiling plug-in, support setting the top reserved position, and focus display blur hide.

> Because of project requirements, the built-in ceiling function will obscure the navigation of the head. I searched through all the documents and found no configuration to avoid conflict.

So I wrote one myself, and then found that the top of the editor of `ckeditor5` was only displayed by `focus`, and `blur` would be closed automatically, so this function was added by the way

Release Notes

- 2021-01-22 fix full screen conflict
- 2021-01-23 Add a friendly error prompt when the reserved node cannot be found (the editor comes with a function)
- 2021-01-29 Fix the calculation method of the ceiling. There was a bug in the previous , now it is accurate, and the function throttling of the `resize` and `scroll` event is added.

# Parameter Description

| Configuration name | Default state | Configuration description |
| --- | --- | --- |
| cfyun\_toolbar\_sticky | Disabled by default | Plug-in switch |
| toolbar\_sticky\_type | Enable | Whether to enable the focus and blur automatic display or disable function, enabled by default |
| toolbar\_sticky\_elem | Default empty | If you need to dynamically obtain the height of the elem of the reserved position, please set |
| toolbar\_sticky\_elem_height | Default 0 | The height of the top reserved position, if the page change requirements are not high, please use this setting |
| toolbar\_sticky\_wrap | Default window | Scroll container where the editor is located |

# Installation Notes


1. Create a new `toolbarsticky` in the `tinymce/plugins/` directory
2. Save the code to `tinymce/plugins/toolbarsticky/plugin.min.js`
3. Add `toolbarsticky` to the `plugins` item of the editor configuration


Please see the parameter description for other configurations, the function is very simple
