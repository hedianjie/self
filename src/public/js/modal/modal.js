"use strict";
exports.__esModule = true;
exports.Modal = void 0;
var $ = require("jquery");
var Modal = /** @class */ (function () {
    function Modal(options, element) {
        /**
         * 模态框当前状态
         * true->显示 false->隐藏
         * 默认：false
         *
         */
        this.status = false;
        this['show-opacity-animate'] = 'ease-opacity-fade-in';
        this['hide-opacity-animate'] = 'ease-opacity-fade-out';
        this.middle = options.middle || true;
        this.center = options.center || true;
        this.mask = typeof options.mask === 'undefined' ? true : options.mask;
        this.animate = options.animate || 'center';
        this.duration = options.duration || 500;
        this['mask-closable'] = options['mask-closable'] || false;
        this.width = options.width || 0;
        this.onConfirm = options.onConfirm || undefined;
        this['on-confirm-text'] = options['on-confirm-text'] || '';
        this.onCancel = options.onCancel || undefined;
        this['on-cancel-text'] = options['on-cancel-text'] || '';
        this.title = options.title || '';
        this.content = options.content || '';
        this.element = this.htmlTemplate(element);
        this.initHtmlTemplate();
    }
    Modal.prototype.htmlTemplate = function (template) {
        var html = template || $("\n        <div class=\"modal\">\n            <div class=\"modal-header\">\n                <div class=\"caption\"></div>\n                <div class=\"action\"><span class=\"modal-header-close on-close\">&times;</span></div>\n            </div>\n            <div class=\"modal-body\"></div>\n            <div class=\"modal-footer\">\n                <button class=\"ivu-btn on-cancel\">\u53D6\u6D88</button>\n                <button class=\"ivu-btn on-confirm ivu-btn-primary\">\u786E\u5B9A</button>\n            </div>\n        </div>\n        ");
        var htmlTemplate = $('<div class="modal-warpper modal-hidden"><div class="modal-mask"></div></div>').append(html);
        var htmlMask = htmlTemplate.find('.modal-mask');
        var htmlTitle = htmlTemplate.find('.modal-header .caption');
        var htmlBody = htmlTemplate.find('.modal-body');
        var htmlCancel_btn = htmlTemplate.find('.on-cancel');
        var htmlConfirm_btn = htmlTemplate.find('.on-confirm');
        var htmlModal = htmlTemplate.find('.modal');
        /**
         * 修改模态框标题
         */
        if (this.title) {
            htmlTitle.empty().append(typeof this.title === 'function' ? this.title() : this.title);
        }
        /**
         * 修改模态框内容
         */
        if (this.content) {
            htmlBody.empty().append(typeof this.content === 'function' ? this.content() : this.content);
        }
        /**
         * 修改模态框取消按钮文字
         */
        if (this['on-cancel-text']) {
            htmlCancel_btn.empty().append(this['on-cancel-text']);
        }
        /**
         * 修改模态框确认按钮文字
         */
        if (this['on-confirm-text']) {
            htmlConfirm_btn.empty().append(this['on-confirm-text']);
        }
        /**
         * 如果模态框上下不居中
         */
        if (typeof this.middle === 'number') {
            htmlTemplate.css({
                'display': 'block'
            });
            htmlModal.css({
                'top': this.middle
            });
        }
        /**
         * 如果模态框左右不居中
         */
        if (typeof this.center === 'number') {
            htmlModal.css({
                'left': this.center,
                'right': 'initial',
                'margin': 0
            });
        }
        /**
         * 是否打开遮罩层
         */
        if (!this.mask) {
            htmlMask.css({
                'background': 'transparent',
                'pointer-events': 'none'
            });
            htmlTemplate.css({
                'pointer-events': 'none'
            });
        }
        /**
         * 修改模态框长度
         */
        if (this.width) {
            htmlModal.width(this.width);
        }
        /**
         * 确定模态框弹出动画
         */
        switch (this.animate) {
            case 'center': {
                this['show-animate'] = 'ease-center-in';
                this['hide-animate'] = 'ease-center-out';
                break;
            }
            case 'left': {
                this['show-animate'] = 'ease-left-in';
                this['hide-animate'] = 'ease-left-out';
                break;
            }
            case 'right': {
                this['show-animate'] = 'ease-right-in';
                this['hide-animate'] = 'ease-right-out';
                break;
            }
            case 'top': {
                this['show-animate'] = 'ease-top-in';
                this['hide-animate'] = 'ease-top-out';
                break;
            }
            case 'bottom': {
                this['show-animate'] = 'ease-bottom-in';
                this['hide-animate'] = 'ease-bottom-out';
                break;
            }
            default: {
                this['show-animate'] = 'ease-center-in';
                this['hide-animate'] = 'ease-center-out';
            }
        }
        htmlModal.css('display', 'block');
        $('body').append(htmlTemplate);
        return htmlTemplate;
    };
    Modal.prototype.initHtmlTemplate = function () {
        var _this = this;
        // 绑定关闭模态框方法
        this.element.find('.on-close').bind('click', function () {
            _this.hide();
        });
        // 绑定模态框确认方法
        this.element.find('.on-confirm').bind('click', function () {
            typeof _this.onConfirm === 'function' ? _this.onConfirm() : null;
        });
        // 绑定模态框取消方法
        this.element.find('.on-cancel').bind('click', function () {
            typeof _this.onCancel === 'function' ? _this.onCancel() : _this.hide();
        });
        // 绑定点击mask关闭模态框
        if (this['mask-closable']) {
            this.element.find('.modal-mask').bind('click', function () {
                _this.hide();
            });
        }
    };
    Modal.prototype.show = function (callback) {
        if (this.status)
            return;
        this.status = true;
        var showAnimate = this['show-animate'];
        var showOpacityAnimate = this['show-opacity-animate'];
        var modal = this.element.find('.modal');
        var modalMask = this.element.find('.modal-mask');
        this.element
            .css('zIndex', Modal.zIndex++)
            .removeClass('modal-hidden');
        // 确定模态框位置
        modal.addClass(showAnimate);
        modalMask.addClass(showOpacityAnimate);
        // 清除class 并且执行回调
        window.setTimeout(function () {
            modal.removeClass(showAnimate);
            modalMask.removeClass(showOpacityAnimate);
            //执行回调
            typeof callback === 'function' ? callback() : null;
        }, 200);
    };
    Modal.prototype.hide = function (callback) {
        var _this = this;
        if (!this.status)
            return;
        this.status = false;
        var hideAnimate = this['hide-animate'];
        var hideOpacityAnimate = this['hide-opacity-animate'];
        var modal = this.element.find('.modal');
        var modalMask = this.element.find('.modal-mask');
        // 确定模态框位置
        modal.addClass(hideAnimate);
        modalMask.addClass(hideOpacityAnimate);
        window.setTimeout(function () {
            _this.element.addClass('modal-hidden');
            modal.removeClass(hideAnimate);
            modalMask.removeClass(hideOpacityAnimate);
            // 执行回调
            typeof callback === 'function' ? callback() : null;
        }, 200);
    };
    /**
     * 默认
     */
    Modal.zIndex = 1024;
    return Modal;
}());
exports.Modal = Modal;
exports["default"] = (function (options, options2) {
    // 第一个参数是jquery对象或者DOM元素
    if (options instanceof $ || options instanceof Node) {
        return new Modal(options2 || {}, $(options));
    }
    // 第一个参数是配置文件
    else {
        return new Modal(options || {});
    }
});
