import './index.css'
import $ from 'jquery'



class Loading {
    /**
     * status
     */
    status = false
    /**
     * 范围
     */
    scope = 'body'
    /**
     * 是否需要固定
     */
    fix = true
    /**
     * 背景色
     */
    background = 'rgba(0,0,0,.5)';
    /**
     * 文字颜色
     */
    color = '#ffffff'

    constructor(options = {}) {
        this.scope = $(options.scope || this.scope);
        this.fix = typeof options.fix === undefined ? this.fix : options.fix;
        this.color = options.color || this.color;
        this.background = options.background || this.background;
    }

    render(options = {}) {
        const fix = typeof options.fix === undefined ? this.fix : options.fix;
        const color = options.color || this.color;
        const background = options.background || this.background;
        this.$html = $(`
        <div class="loading-opacity">
            <span class="l">L</span>
            <span class="o">o</span>
            <span class="a">a</span>
            <span class="d">d</span>
            <span class="i">i</span>
            <span class="n">n</span>
            <span class="g">g</span>
            <span class="point">…</span>
        </div>
        `);

        this.$html.css({
            'position': fix ? 'fixed' : 'absolute',
            'color': color,
            'background': background,
        });
    }

    show(options = {}, callback) {
        const scope = $(options.scope || this.scope);
        if (this.status) return;
        this.status = true;
        this.render(options);
        scope.append(this.$html);
        this.$html.css('zIndex', Loading.zIndex++)
        // 确定模态框位置
        this.$html.addClass('ease-opacity-fade-in');
        // 清除class 并且执行回调
        window.setTimeout(() => {
            this.$html.removeClass('ease-opacity-fade-in');
            //执行回调
            typeof callback === 'function' ? callback() : null;
        }, 200);
    }

    hide() {
        if (!this.status)
            return;
        this.status = false;
        // 确定模态框位置
        this.$html.addClass('ease-opacity-fade-out');
        window.setTimeout(() => {
            this.$html.removeClass('ease-opacity-fade-out');
            this.$html.remove();
            // 执行回调
            typeof callback === 'function' ? callback() : null;
        }, 200);
    }
}
Loading.zIndex = 2048;

export default Loading;
export const loading = window.loading  = new Loading()