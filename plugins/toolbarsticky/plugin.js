(function () {
    'use strict';

    let global = tinymce.util.Tools.resolve('tinymce.PluginManager');
    let Global = typeof window !== 'undefined' ? window : Function('return this;')();

    let offset = {};
    let runtime = {};

    let toolbar_sticky_type = !0;
    let cfyun_toolbar_sticky = !1;
    let toolbar_sticky_elem = null;
    let toolbar_sticky_elem_height = 0;
    let toolbar_sticky_wrap = null;

    class ToolbarSticky {
        constructor(editor) {

            cfyun_toolbar_sticky = editor.getParam('cfyun_toolbar_sticky', !1, 'bool');

            if (!cfyun_toolbar_sticky) {
                return;
            }

            toolbar_sticky_type = editor.getParam('toolbar_sticky_type', !0, 'bool');
            toolbar_sticky_elem = editor.getParam('toolbar_sticky_elem', '', 'string');
            toolbar_sticky_wrap = editor.getParam('toolbar_sticky_wrap', '', 'string');
            toolbar_sticky_elem_height = editor.getParam('toolbar_sticky_elem_height', 0, 'number');

            this.editor = editor;
            runtime.wrap = window;
            runtime.editor = editor.$(editor.container);
            runtime.header = runtime.editor.find('.tox-editor-header');
            runtime.container = runtime.editor.find('.tox-editor-container');
            runtime.elemHeight = toolbar_sticky_elem_height;

            if(toolbar_sticky_wrap && typeof toolbar_sticky_wrap === 'string' && toolbar_sticky_wrap != 'body') {
                runtime.wrap = document.querySelector(toolbar_sticky_wrap) || window;
            }

            let _this = this;

            if(toolbar_sticky_type) {
                editor.on('focus', () => {
                    _this.bind();
                });
    
                editor.on('blur', () => {
                    _this.restore();
                    _this.unBind();
                });
            } else {
                this.bind(); 
            }

            return this;
        }
        sticky() {
            // Prevent full screen conflict
            if(runtime.editor.hasClass('tox-fullscreen')) {
                this.restore();
                return !1;
            }
            this.position();
            if(offset.isSticky) {
                runtime.container.css('padding-top', runtime.header[0].clientHeight);
                runtime.editor.removeClass('tox-tinymce--toolbar-sticky-off').addClass('tox-tinymce--toolbar-sticky-on');
                runtime.header.css({
                    position: 'fixed',
                    width: offset.width,
                    left: offset.left,
                    top: runtime.elemHeight || 0,
                    borderTop: '1px solid #ccc'
                });
                return !1;
            }

            this.restore();
        }
        position() {
            let elemOffsetHeight = runtime.elemHeight;
            if (toolbar_sticky_elem) {
                var elem = document.querySelector(toolbar_sticky_elem);
                if(!elem) {
                    // Prevent incorrect configuration from reporting errors
                    this.editor.notificationManager.open({
                        text: 'ToolbarSticky did not get: reserved DOM node, please check the configuration toolbar_sticky_elem.',
                        type: 'info',
                    });
                    return !1;
                }
                elemOffsetHeight = elem.offsetHeight;
                runtime.elemHeight = elem.clientHeight;
            }
            offset.width = this.editor.container.clientWidth;
            offset.left = runtime.editor.offset().left + 1;
            offset.isSticky = this.scrollTop() >= this.editor.$(runtime.container).offset().top - elemOffsetHeight;
        }
        bind() {
            runtime.wrap.addEventListener('scroll', this.throttle(this.sticky.bind(this), 60));
            this.sticky()
        }
        unBind() {
            runtime.wrap.removeEventListener('scroll', this.throttle(this.sticky.bind(this), 60));
        }
        restore() {
            runtime.header.attr('style', '');
            runtime.container.css('padding-top', 0);
            runtime.editor.removeClass('tox-tinymce--toolbar-sticky-on').addClass('tox-tinymce--toolbar-sticky-off')
        }
        destroy() {
            offset = runtime = {};
            this.unBind();
            this.restore()
        }
        scrollTop() {
            return document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset
        }
        now() {
            return Date.now() || new Date().getTime()
        }
        /**
         * Function throttling
         * @param {func} fn 
         * @param {number} delay 
         */
        throttle(fn, delay) {
            let _this = this, context, args, result;
            let timeout = null;
            let previous = 0;
            const later = () => {
                previous = 0;
                timeout = null;
                result = fn.apply(context, args);
                if (!timeout) {
                    context = args = null;
                }
            };
            return () => {
                let now = _this.now();
                if (!previous) {
                    previous = now;
                }
                let remaining = delay - (now - previous);
                context = this;
                args = arguments;
                if (remaining <= 0 || remaining > delay) {
                    if (timeout) {
                        clearTimeout(timeout);
                        timeout = null;
                    }
                    previous = now;
                    result = fn.apply(context, args);
                    if (!timeout) {
                        context = args = null;
                    }
                } else if (!timeout) {
                    timeout = setTimeout(later, remaining);
                }
                return result;
            };
        }
    }
    
    function Plugin () {
        global.add('toolbarsticky', function (editor) {
            editor.on('init', function (e) {
                new ToolbarSticky(editor)
            });
        });
    }
  
    Plugin();

}());
